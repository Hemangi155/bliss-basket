"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "./MaterialIcon";
import { useCartWishlist } from "@/context/CartWishlistContext";

export default function CartDrawer() {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeItem, isLoading } =
    useCartWishlist();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 flex justify-end animate-fadeIn"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-text/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        className="relative w-full max-w-md bg-light-surface-container-lowest h-full shadow-2xl flex flex-col justify-between border-l border-light-outline-variant z-10 animate-slideLeft overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-light-outline-variant flex items-center justify-between bg-light-surface">
          <div className="flex items-center gap-3">
            <MaterialIcon name="shopping_bag" className="text-light-primary text-title-lg" />
            <h2
              id="cart-drawer-title"
              className="font-headline text-headline-sm text-light-primary tracking-tight"
            >
              Your Gift Bag
            </h2>
            <span className="font-label text-label-sm px-2.5 py-0.5 rounded-full bg-light-primary-container text-light-on-primary-container font-bold">
              {cart.totalCount} {cart.totalCount === 1 ? "item" : "items"}
            </span>
          </div>

          <button
            type="button"
            aria-label="Close cart drawer"
            onClick={closeDrawer}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-light-surface-container-lowest text-light-on-surface border border-light-outline-variant hover:bg-light-primary hover:text-light-on-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary"
          >
            <MaterialIcon name="close" size={18} />
          </button>
        </div>

        {/* Free Delivery Progress */}
        <div className="px-6 py-3 bg-light-surface-container-low border-b border-light-outline-variant text-xs font-label">
          {cart.subtotal >= 2500 ? (
            <p className="text-success font-bold flex items-center gap-1.5">
              <MaterialIcon name="verified" size={15} />
              Congratulations! Your order qualifies for Complimentary Express Delivery.
            </p>
          ) : (
            <div>
              <p className="text-light-on-surface-variant flex items-center justify-between">
                <span>Add ₹{(2500 - cart.subtotal).toLocaleString("en-IN")} more for Free Delivery</span>
                <span className="font-bold text-light-primary">
                  {Math.round((cart.subtotal / 2500) * 100)}%
                </span>
              </p>
              <div className="w-full h-1.5 bg-light-outline-variant/60 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-champagne-gold transition-all duration-300"
                  style={{ width: `${Math.min(100, (cart.subtotal / 2500) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="h-16 w-16 rounded-full bg-light-surface-container-low text-light-outline flex items-center justify-center mb-4">
                <MaterialIcon name="shopping_bag" size={32} />
              </div>
              <h3 className="font-headline text-title-lg text-light-primary">
                Your gift bag is empty
              </h3>
              <p className="font-body text-body-sm text-light-on-surface-variant max-w-xs mt-2 leading-relaxed">
                Explore our handcrafted festive hampers and thoughtful keepsakes.
              </p>
              <Link
                href="/products"
                onClick={closeDrawer}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-light-primary text-light-on-primary font-label text-label-md font-bold hover:bg-light-on-primary-container transition-colors shadow-sm"
              >
                <span>Browse Hampers</span>
                <MaterialIcon name="arrow_forward" size={16} />
              </Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 rounded-xl border border-light-outline-variant bg-light-surface-container-low/50 hover:bg-light-surface-container-low transition-colors"
              >
                {/* Product Thumbnail */}
                <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0 border border-light-outline-variant bg-light-surface-container-lowest">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Info & Quantity */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-headline text-body-md text-light-on-surface font-bold truncate">
                        {item.name}
                      </h4>
                      <p className="font-label text-label-sm text-light-outline truncate">
                        {item.category}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.productId)}
                      className="text-light-outline hover:text-error transition-colors p-1"
                    >
                      <MaterialIcon name="close" size={15} />
                    </button>
                  </div>

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="font-title text-title-md text-light-primary font-bold tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>

                    <div className="inline-flex items-center border border-light-outline-variant rounded-full bg-light-surface-container-lowest shadow-2xs">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={isLoading}
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="h-7 w-7 inline-flex items-center justify-center text-light-on-surface hover:text-light-primary disabled:opacity-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-label text-label-sm px-2 tabular-nums font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={isLoading || item.quantity >= 10}
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-7 w-7 inline-flex items-center justify-center text-light-on-surface hover:text-light-primary disabled:opacity-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.items.length > 0 && (
          <div className="p-6 border-t border-light-outline-variant bg-light-surface space-y-4">
            <div className="space-y-2 text-sm font-label">
              <div className="flex justify-between text-light-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-bold text-light-on-surface tabular-nums">
                  ₹{cart.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-light-on-surface-variant">
                <span>Estimated Delivery</span>
                <span className="tabular-nums">
                  {cart.deliveryCharge === 0 ? (
                    <span className="text-success font-bold">FREE</span>
                  ) : (
                    `₹${cart.deliveryCharge}`
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-light-outline-variant flex justify-between font-headline text-title-md text-light-primary font-bold">
                <span>Total Amount</span>
                <span className="tabular-nums">₹{cart.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-light-primary text-light-on-primary font-label text-label-lg font-bold tracking-wide hover:bg-light-on-primary-container transition-colors shadow-sm"
              >
                <span>View Full Bag & Checkout</span>
                <MaterialIcon name="arrow_forward" size={18} />
              </Link>

              <button
                type="button"
                onClick={closeDrawer}
                className="w-full py-2.5 text-center font-label text-label-sm text-light-outline hover:text-light-primary transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
