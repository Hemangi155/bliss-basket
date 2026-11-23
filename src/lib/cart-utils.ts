import { SAMPLE_PRODUCTS, Product } from "@/data/products";

export interface CartItemData {
  id: string; // cart item id or product id
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  inStock: boolean;
}

export interface CartSummary {
  items: CartItemData[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  totalCount: number;
}

export const GUEST_CART_COOKIE = "bb_guest_cart";
export const GUEST_WISHLIST_COOKIE = "bb_guest_wishlist";
export const FREE_DELIVERY_THRESHOLD = 2500;
export const STANDARD_DELIVERY_FEE = 199;

/**
 * Server-side product price and stock resolver.
 * Never trusts client-submitted prices or totals.
 */
export function getVerifiedProduct(productId: string): Product | null {
  return SAMPLE_PRODUCTS.find((p) => p.id === productId) || null;
}

/**
 * Computes verified cart financial totals on the server.
 */
export function calculateTotals(items: { productId: string; quantity: number }[]): CartSummary {
  const verifiedItems: CartItemData[] = [];
  let subtotal = 0;
  let totalCount = 0;

  for (const item of items) {
    const product = getVerifiedProduct(item.productId);
    if (!product) continue;

    const qty = Math.max(1, Math.min(10, item.quantity));
    const itemTotal = product.price * qty;
    subtotal += itemTotal;
    totalCount += qty;

    verifiedItems.push({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: qty,
      category: product.category,
      inStock: product.inStock,
    });
  }

  const deliveryCharge =
    subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const total = subtotal + deliveryCharge;

  return {
    items: verifiedItems,
    subtotal,
    deliveryCharge,
    total,
    totalCount,
  };
}
