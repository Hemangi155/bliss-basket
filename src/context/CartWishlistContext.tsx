"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  CartSummary,
  getCartAction,
  addToCartAction,
  updateCartItemQuantityAction,
  removeCartItemAction,
  getWishlistAction,
  toggleWishlistAction,
} from "@/app/cart/actions";
import { Product, SAMPLE_PRODUCTS } from "@/data/products";
import ToastNotification from "@/components/products/ToastNotification";

interface CartWishlistContextType {
  cart: CartSummary;
  wishlistIds: Set<string>;
  wishlistItems: Product[];
  isDrawerOpen: boolean;
  isLoading: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  showToast: (message: string, subMessage?: string, type?: "success" | "wishlist" | "error") => void;
  hideToast: () => void;
}

const defaultCart: CartSummary = {
  items: [],
  subtotal: 0,
  deliveryCharge: 0,
  total: 0,
  totalCount: 0,
};

const CartWishlistContext = createContext<CartWishlistContextType | null>(null);

export function CartWishlistProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartSummary>(defaultCart);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Global toast feedback state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    subMessage?: string;
    type: "success" | "wishlist" | "error";
  }>({
    visible: false,
    message: "",
    type: "wishlist",
  });

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingWishlistRef = useRef<Set<string>>(new Set());

  const hideToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const showToast = useCallback(
    (message: string, subMessage?: string, type: "success" | "wishlist" | "error" = "success") => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      setToast({ visible: true, message, subMessage, type });
      toastTimerRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
        toastTimerRef.current = null;
      }, 3000);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [c, w] = await Promise.all([getCartAction(), getWishlistAction()]);
        if (isMounted) {
          setCart(c);
          setWishlistIds(new Set(w.productIds));
          setWishlistItems(w.items);
        }
      } catch {
        // Fallback
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const refreshCart = useCallback(async () => {
    try {
      const c = await getCartAction();
      setCart(c);
    } catch {
      // Ignore
    }
  }, []);

  const refreshWishlist = useCallback(async () => {
    try {
      const w = await getWishlistAction();
      setWishlistIds(new Set(w.productIds));
      setWishlistItems(w.items);
    } catch {
      // Ignore
    }
  }, []);

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      setIsLoading(true);
      try {
        const res = await addToCartAction(productId, quantity);
        if (res.success) {
          setCart(res.cart);
          setIsDrawerOpen(true); // Open drawer automatically as requested
        }
      } catch {
        // Network fallback
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      setIsLoading(true);
      try {
        const res = await updateCartItemQuantityAction(productId, quantity);
        if (res.success) {
          setCart(res.cart);
        }
      } catch {
        // Ignore
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const removeItem = useCallback(
    async (productId: string) => {
      setIsLoading(true);
      try {
        const res = await removeCartItemAction(productId);
        if (res.success) {
          setCart(res.cart);
        }
      } catch {
        // Ignore
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const toggleWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      // Prevent duplicate rapid clicks on the same product
      if (pendingWishlistRef.current.has(productId)) {
        return false;
      }
      pendingWishlistRef.current.add(productId);

      try {
        const res = await toggleWishlistAction(productId);
        if (res.success) {
          setWishlistIds(new Set(res.productIds));
          setWishlistItems(res.items);

          const product = SAMPLE_PRODUCTS.find((p) => p.id === productId);
          const productName = product?.name;

          if (res.isWishlisted) {
            showToast("Added to Wishlist ❤️", productName, "wishlist");
          } else {
            showToast("Removed from Wishlist", productName, "wishlist");
          }
          return res.isWishlisted;
        } else {
          showToast("Failed to update wishlist", "Please try again.", "error");
        }
      } catch {
        showToast("Unable to update wishlist", "Please check your connection and try again.", "error");
        await refreshWishlist();
      } finally {
        pendingWishlistRef.current.delete(productId);
      }
      return false;
    },
    [refreshWishlist, showToast]
  );

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlistIds,
        wishlistItems,
        isDrawerOpen,
        isLoading,
        openDrawer,
        closeDrawer,
        addToCart,
        updateQuantity,
        removeItem,
        toggleWishlist,
        refreshCart,
        refreshWishlist,
        showToast,
        hideToast,
      }}
    >
      {children}
      <ToastNotification
        isVisible={toast.visible}
        message={toast.message}
        subMessage={toast.subMessage}
        type={toast.type}
        onClose={hideToast}
      />
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error("useCartWishlist must be used within a CartWishlistProvider");
  }
  return context;
}
