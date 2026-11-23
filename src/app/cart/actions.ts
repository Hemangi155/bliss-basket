"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/data/products";
import {
  CartItemData,
  CartSummary,
  GUEST_CART_COOKIE,
  GUEST_WISHLIST_COOKIE,
  getVerifiedProduct,
  calculateTotals,
} from "@/lib/cart-utils";

export type { CartItemData, CartSummary };

/**
 * Reads local guest cart cookie (fallback or guest session).
 */
async function getGuestCartFromCookie(): Promise<{ productId: string; quantity: number }[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (Array.isArray(parsed)) {
      return parsed.map((item) => ({
        productId: String(item.productId || item.id),
        quantity: Math.max(1, Math.min(10, Number(item.quantity) || 1)),
      }));
    }
  } catch {
    // Malformed cookie ignored
  }
  return [];
}

/**
 * Writes guest cart cookie.
 */
async function setGuestCartCookie(items: { productId: string; quantity: number }[]) {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_CART_COOKIE, encodeURIComponent(JSON.stringify(items)), {
    path: "/",
    httpOnly: false, // Accessible to client-side optimistic hydrate
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

/**
 * Reads guest wishlist cookie.
 */
async function getGuestWishlistFromCookie(): Promise<string[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(GUEST_WISHLIST_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (Array.isArray(parsed)) {
      return parsed.map((id) => String(id));
    }
  } catch {
    // Malformed cookie
  }
  return [];
}

/**
 * Writes guest wishlist cookie.
 */
async function setGuestWishlistCookie(ids: string[]) {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_WISHLIST_COOKIE, encodeURIComponent(JSON.stringify(ids)), {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 60, // 60 days
  });
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

// Helper to safely get the authenticated user without unhandled network exceptions
async function getAuthenticatedUser(supabase: SupabaseServerClient) {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) return data.user;
  } catch {
    // Non-blocking fallback
  }
  return null;
}

/**
 * Retrieves the active cart for either authenticated user or guest.
 */
export async function getCartAction(): Promise<CartSummary> {
  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  if (user) {
    try {
      // 1. Fetch active cart for user
      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (cart) {
        const { data: items } = await supabase
          .from("cart_items")
          .select("product_id, quantity")
          .eq("cart_id", cart.id);

        if (items && items.length > 0) {
          return calculateTotals(
            items.map((i) => ({ productId: i.product_id, quantity: i.quantity }))
          );
        }
      }
    } catch {
      // Graceful fallback if database table not yet migrated
    }
  }

  // Fallback / Guest Cart from Cookie
  const guestItems = await getGuestCartFromCookie();
  return calculateTotals(guestItems);
}

/**
 * Adds an item to the cart or increments its quantity.
 */
export async function addToCartAction(
  productId: string,
  quantity = 1
): Promise<{ success: boolean; cart: CartSummary; error?: string }> {
  const product = getVerifiedProduct(productId);
  if (!product) {
    return { success: false, cart: calculateTotals([]), error: "Product not found" };
  }
  if (!product.inStock) {
    return { success: false, cart: calculateTotals([]), error: "Product is out of stock" };
  }

  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  let resolvedItems: { productId: string; quantity: number }[] = [];

  if (user) {
    try {
      // Get or create active cart for user
      let cartId: string;
      const { data: existingCart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (existingCart) {
        cartId = existingCart.id;
      } else {
        const { data: newCart, error: createCartErr } = await supabase
          .from("carts")
          .insert({ user_id: user.id, status: "active" })
          .select("id")
          .single();
        if (createCartErr || !newCart) throw createCartErr || new Error("Failed to create cart");
        cartId = newCart.id;
      }

      // Check if product already in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cartId)
        .eq("product_id", productId)
        .maybeSingle();

      if (existingItem) {
        const newQty = Math.min(10, existingItem.quantity + quantity);
        await supabase
          .from("cart_items")
          .update({ quantity: newQty, unit_price: product.price, updated_at: new Date().toISOString() })
          .eq("id", existingItem.id);
      } else {
        await supabase.from("cart_items").insert({
          cart_id: cartId,
          product_id: productId,
          quantity: Math.min(10, quantity),
          unit_price: product.price,
        });
      }

      // Fetch all items
      const { data: allItems } = await supabase
        .from("cart_items")
        .select("product_id, quantity")
        .eq("cart_id", cartId);

      if (allItems) {
        resolvedItems = allItems.map((i) => ({ productId: i.product_id, quantity: i.quantity }));
      }
    } catch {
      // Fallback to cookie storage if table not yet migrated
      resolvedItems = await updateGuestCart(productId, quantity);
    }
  } else {
    // Guest cart
    resolvedItems = await updateGuestCart(productId, quantity);
  }

  const summary = calculateTotals(resolvedItems);
  return { success: true, cart: summary };
}

async function updateGuestCart(productId: string, quantity: number) {
  const current = await getGuestCartFromCookie();
  const existingIdx = current.findIndex((i) => i.productId === productId);
  if (existingIdx >= 0) {
    current[existingIdx].quantity = Math.min(10, current[existingIdx].quantity + quantity);
  } else {
    current.push({ productId, quantity: Math.min(10, quantity) });
  }
  await setGuestCartCookie(current);
  return current;
}

/**
 * Updates an item's quantity in the cart. If quantity <= 0, removes the item.
 */
export async function updateCartItemQuantityAction(
  productId: string,
  quantity: number
): Promise<{ success: boolean; cart: CartSummary }> {
  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  let resolvedItems: { productId: string; quantity: number }[] = [];

  if (user) {
    try {
      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (cart) {
        if (quantity <= 0) {
          await supabase.from("cart_items").delete().eq("cart_id", cart.id).eq("product_id", productId);
        } else {
          await supabase
            .from("cart_items")
            .update({ quantity: Math.min(10, quantity), updated_at: new Date().toISOString() })
            .eq("cart_id", cart.id)
            .eq("product_id", productId);
        }

        const { data: allItems } = await supabase
          .from("cart_items")
          .select("product_id, quantity")
          .eq("cart_id", cart.id);

        if (allItems) {
          resolvedItems = allItems.map((i) => ({ productId: i.product_id, quantity: i.quantity }));
        }
      }
    } catch {
      resolvedItems = await updateGuestCartQuantity(productId, quantity);
    }
  } else {
    resolvedItems = await updateGuestCartQuantity(productId, quantity);
  }

  return { success: true, cart: calculateTotals(resolvedItems) };
}

async function updateGuestCartQuantity(productId: string, quantity: number) {
  let current = await getGuestCartFromCookie();
  if (quantity <= 0) {
    current = current.filter((i) => i.productId !== productId);
  } else {
    const existing = current.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity = Math.min(10, quantity);
    }
  }
  await setGuestCartCookie(current);
  return current;
}

/**
 * Removes an item from the cart.
 */
export async function removeCartItemAction(
  productId: string
): Promise<{ success: boolean; cart: CartSummary }> {
  return await updateCartItemQuantityAction(productId, 0);
}

/**
 * Merges a guest cart into an authenticated customer's database cart after login.
 */
export async function mergeGuestCartAction(): Promise<CartSummary> {
  const guestItems = await getGuestCartFromCookie();
  if (guestItems.length === 0) {
    return await getCartAction();
  }

  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  if (!user) {
    return calculateTotals(guestItems);
  }

  try {
    let cartId: string;
    const { data: existingCart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (existingCart) {
      cartId = existingCart.id;
    } else {
      const { data: newCart, error: createCartErr } = await supabase
        .from("carts")
        .insert({ user_id: user.id, status: "active" })
        .select("id")
        .single();
      if (createCartErr || !newCart) throw createCartErr || new Error("Failed to create cart");
      cartId = newCart.id;
    }

    // Merge each guest item
    for (const item of guestItems) {
      const product = getVerifiedProduct(item.productId);
      if (!product || !product.inStock) continue;

      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cartId)
        .eq("product_id", item.productId)
        .maybeSingle();

      if (existingItem) {
        // Max limit of 10 items
        const mergedQty = Math.min(10, existingItem.quantity + item.quantity);
        await supabase
          .from("cart_items")
          .update({ quantity: mergedQty, unit_price: product.price, updated_at: new Date().toISOString() })
          .eq("id", existingItem.id);
      } else {
        await supabase.from("cart_items").insert({
          cart_id: cartId,
          product_id: item.productId,
          quantity: Math.min(10, item.quantity),
          unit_price: product.price,
        });
      }
    }

    // Clear guest cookie after safe merge
    await setGuestCartCookie([]);

    const { data: allItems } = await supabase
      .from("cart_items")
      .select("product_id, quantity")
      .eq("cart_id", cartId);

    if (allItems) {
      return calculateTotals(allItems.map((i) => ({ productId: i.product_id, quantity: i.quantity })));
    }
  } catch {
    // If DB unavailable, keep guest cookie
  }

  return await getCartAction();
}

// -------------------------------------------------------------
// WISHLIST SERVER ACTIONS
// -------------------------------------------------------------

/**
 * Retrieves the customer's wishlist.
 */
export async function getWishlistAction(): Promise<{ items: Product[]; productIds: string[] }> {
  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  let productIds: string[] = [];

  if (user) {
    try {
      // Merge any pending guest items into user's DB wishlist
      const guestIds = await getGuestWishlistFromCookie();
      if (guestIds.length > 0) {
        await mergeGuestWishlistAction();
      }

      const { data: wishlist, error: wishlistErr } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (wishlistErr) throw wishlistErr;

      if (wishlist) {
        const { data: items, error: itemsErr } = await supabase
          .from("wishlist_items")
          .select("product_id")
          .eq("wishlist_id", wishlist.id);

        if (itemsErr) throw itemsErr;

        if (items) {
          productIds = items.map((i) => i.product_id);
        }
      }
    } catch {
      productIds = await getGuestWishlistFromCookie();
    }
  } else {
    productIds = await getGuestWishlistFromCookie();
  }

  const products = productIds
    .map((id) => getVerifiedProduct(id))
    .filter((p): p is Product => p !== null);

  return { items: products, productIds };
}

/**
 * Toggles an item in the wishlist (adds if absent, removes if present).
 */
export async function toggleWishlistAction(
  productId: string
): Promise<{ success: boolean; isWishlisted: boolean; productIds: string[]; items: Product[] }> {
  const product = getVerifiedProduct(productId);
  if (!product) {
    return { success: false, isWishlisted: false, productIds: [], items: [] };
  }

  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  if (user) {
    try {
      let wishlistId: string;
      const { data: existingWishlist, error: existingWishlistErr } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingWishlistErr) throw existingWishlistErr;

      if (existingWishlist) {
        wishlistId = existingWishlist.id;
      } else {
        const { data: newWishlist, error: createWishlistErr } = await supabase
          .from("wishlists")
          .insert({ user_id: user.id })
          .select("id")
          .single();
        if (createWishlistErr || !newWishlist) throw createWishlistErr || new Error("Failed to create wishlist");
        wishlistId = newWishlist.id;
      }

      const { data: existingItem, error: existingItemErr } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("wishlist_id", wishlistId)
        .eq("product_id", productId)
        .maybeSingle();

      if (existingItemErr) throw existingItemErr;

      let isWishlisted: boolean;
      if (existingItem) {
        const { error: delErr } = await supabase.from("wishlist_items").delete().eq("id", existingItem.id);
        if (delErr) throw delErr;
        isWishlisted = false;
      } else {
        const { error: insErr } = await supabase.from("wishlist_items").insert({
          wishlist_id: wishlistId,
          product_id: productId,
        });
        if (insErr) throw insErr;
        isWishlisted = true;
      }

      const { data: allItems, error: allItemsErr } = await supabase
        .from("wishlist_items")
        .select("product_id")
        .eq("wishlist_id", wishlistId);

      if (allItemsErr) throw allItemsErr;

      const productIds = allItems ? allItems.map((i) => i.product_id) : [];
      const items = productIds
        .map((id) => getVerifiedProduct(id))
        .filter((p): p is Product => p !== null);

      return { success: true, isWishlisted, productIds, items };
    } catch {
      return await toggleGuestWishlist(productId);
    }
  } else {
    return await toggleGuestWishlist(productId);
  }
}

async function toggleGuestWishlist(productId: string) {
  let ids = await getGuestWishlistFromCookie();
  const exists = ids.includes(productId);
  if (exists) {
    ids = ids.filter((id) => id !== productId);
  } else {
    ids.push(productId);
  }
  await setGuestWishlistCookie(ids);
  const items = ids
    .map((id) => getVerifiedProduct(id))
    .filter((p): p is Product => p !== null);
  return { success: true, isWishlisted: !exists, productIds: ids, items };
}

/**
 * Merges guest wishlist items into customer's database wishlist after login.
 */
export async function mergeGuestWishlistAction(): Promise<void> {
  const guestIds = await getGuestWishlistFromCookie();
  if (guestIds.length === 0) return;

  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  if (!user) return;

  try {
    let wishlistId: string;
    const { data: existingWishlist, error: existingWishlistErr } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingWishlistErr) throw existingWishlistErr;

    if (existingWishlist) {
      wishlistId = existingWishlist.id;
    } else {
      const { data: newWishlist, error: createWishlistErr } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id })
        .select("id")
        .single();
      if (createWishlistErr || !newWishlist) throw createWishlistErr || new Error("Failed to create wishlist");
      wishlistId = newWishlist.id;
    }

    for (const productId of guestIds) {
      const product = getVerifiedProduct(productId);
      if (!product) continue;

      const { data: existingItem } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("wishlist_id", wishlistId)
        .eq("product_id", productId)
        .maybeSingle();

      if (!existingItem) {
        await supabase.from("wishlist_items").insert({
          wishlist_id: wishlistId,
          product_id: productId,
        });
      }
    }

    await setGuestWishlistCookie([]);
  } catch {
    // Non-blocking fallback
  }
}
