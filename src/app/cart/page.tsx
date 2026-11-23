"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialIcon from "@/components/MaterialIcon";
import { useCartWishlist } from "@/context/CartWishlistContext";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, isLoading } = useCartWishlist();
  const router = useRouter();

  const freeDeliveryThreshold = 2500;
  const isFreeDelivery = cart.subtotal >= freeDeliveryThreshold;
  const deliveryShortfall = Math.max(0, freeDeliveryThreshold - cart.subtotal);
  const progressPercent = Math.min(100, Math.round((cart.subtotal / freeDeliveryThreshold) * 100));

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-surface text-light-on-surface">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 lg:py-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-label text-label-sm text-light-on-surface-variant mb-8"
        >
          <Link href="/" className="hover:text-light-primary transition-colors">
            Home
          </Link>
          <span className="text-light-outline">/</span>
          <span className="text-light-primary font-bold">Shopping Bag</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-light-outline-variant pb-6 mb-10">
          <div>
            <span className="font-label text-label-sm uppercase tracking-widest text-light-primary font-bold">
              Atelier Curations
            </span>
            <h1 className="font-headline text-headline-lg-mobile lg:text-headline-lg text-light-primary mt-1">
              Your Gifting Bag
            </h1>
          </div>
          <p className="font-label text-label-md text-light-on-surface-variant">
            {cart.totalCount} {cart.totalCount === 1 ? "hamper" : "hampers"} reserved
          </p>
        </div>

        {cart.items.length === 0 ? (
          /* Empty Bag State */
          <div className="rounded-2xl border border-light-outline-variant bg-light-surface-container-lowest p-12 lg:p-20 text-center flex flex-col items-center max-w-2xl mx-auto shadow-sm">
            <div className="h-20 w-20 rounded-full bg-light-primary-container/60 text-light-primary flex items-center justify-center mb-6">
              <MaterialIcon name="shopping_bag" size={36} />
            </div>
            <h2 className="font-headline text-headline-md text-light-on-surface mb-3">
              Your bag is currently empty
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant max-w-md mb-8 leading-relaxed">
              Every occasion deserves something extraordinary. Discover our signature atelier gift boxes, 
              festive curations, and handcrafted keepsakes.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-light-primary text-light-on-primary px-8 py-3.5 font-label text-label-lg transition-colors hover:bg-burgundy/90 shadow-sm"
            >
              <span>Explore The Atelier Collections</span>
              <MaterialIcon name="arrow_forward" size={18} />
            </Link>
          </div>
        ) : (
          /* Cart Grid: Items on Left, Order Summary on Right */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Items & Delivery Meter */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Complimentary Delivery Meter */}
              <div className="p-5 rounded-xl border border-light-outline-variant bg-light-surface-container-low">
                {isFreeDelivery ? (
                  <div className="flex items-center gap-2.5 text-success font-label text-label-md font-bold">
                    <MaterialIcon name="verified" size={20} />
                    <span>Your order qualifies for Complimentary Express Courier Delivery.</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between font-label text-label-sm mb-2">
                      <span className="text-light-on-surface-variant">
                        Add <strong className="text-light-primary font-bold">₹{deliveryShortfall.toLocaleString("en-IN")}</strong> more for Complimentary Express Delivery
                      </span>
                      <span className="text-light-primary font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-light-outline-variant/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-champagne-gold transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items Table/List */}
              <div className="rounded-2xl border border-light-outline-variant bg-light-surface-container-lowest overflow-hidden shadow-sm">
                <div className="hidden sm:grid grid-cols-12 gap-4 p-5 border-b border-light-outline-variant/60 font-label text-label-sm text-light-on-surface-variant uppercase tracking-wider">
                  <div className="col-span-6">Curated Hamper</div>
                  <div className="col-span-2 text-center">Unit Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                <div className="divide-y divide-light-outline-variant/60">
                  {cart.items.map((item) => {
                    const itemSubtotal = item.price * item.quantity;
                    return (
                      <div
                        key={item.productId}
                        className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                      >
                        {/* Hamper Details */}
                        <div className="sm:col-span-6 flex items-center gap-4">
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-light-surface-container-low shrink-0 border border-light-outline-variant/60">
                            <Image
                              src={item.image || "/images/velvet-rose.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="font-label text-[11px] uppercase tracking-wider text-light-primary font-bold truncate">
                              {item.category}
                            </span>
                            <h3 className="font-headline text-headline-sm text-light-on-surface truncate">
                              {item.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              disabled={isLoading}
                              className="inline-flex items-center gap-1 font-label text-[12px] text-light-error hover:underline mt-1 w-fit disabled:opacity-50"
                            >
                              <MaterialIcon name="delete_outline" size={14} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* Unit Price */}
                        <div className="sm:col-span-2 sm:text-center flex sm:flex-col justify-between items-center sm:items-center">
                          <span className="sm:hidden font-label text-label-sm text-light-on-surface-variant">Unit Price:</span>
                          <span className="font-title text-title-md text-light-on-surface tabular-nums">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="sm:col-span-2 flex sm:justify-center items-center justify-between">
                          <span className="sm:hidden font-label text-label-sm text-light-on-surface-variant">Quantity:</span>
                          <div className="inline-flex items-center rounded-full border border-light-outline-variant bg-light-surface-container-low px-1.5 py-0.5">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.name}`}
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={isLoading}
                              className="h-7 w-7 inline-flex items-center justify-center rounded-full text-light-on-surface hover:bg-light-surface-container-lowest transition-colors disabled:opacity-50"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-title text-title-sm tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.name}`}
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={isLoading || item.quantity >= 10}
                              className="h-7 w-7 inline-flex items-center justify-center rounded-full text-light-on-surface hover:bg-light-surface-container-lowest transition-colors disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Item Subtotal */}
                        <div className="sm:col-span-2 sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                          <span className="sm:hidden font-label text-label-sm text-light-on-surface-variant">Subtotal:</span>
                          <span className="font-title text-title-md text-light-primary font-bold tabular-nums">
                            ₹{itemSubtotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Atelier Assurance Box */}
              <div className="p-6 rounded-xl border border-light-outline-variant bg-light-surface-container-lowest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-light-secondary-container text-champagne-gold flex items-center justify-center shrink-0">
                    <MaterialIcon name="card_giftcard" size={20} />
                  </div>
                  <div>
                    <h4 className="font-headline text-headline-sm text-light-on-surface text-[15px]">
                      Complimentary Handwritten Calligraphy Card
                    </h4>
                    <p className="font-body text-body-sm text-light-on-surface-variant">
                      Personalize your gift note and delivery preferences during checkout.
                    </p>
                  </div>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 font-label text-label-sm text-light-primary hover:underline shrink-0"
                >
                  <MaterialIcon name="arrow_back" size={16} />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="rounded-2xl border border-light-outline-variant bg-light-surface-container-lowest p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                <h2 className="font-headline text-headline-sm text-light-primary border-b border-light-outline-variant/60 pb-4">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-3 font-body text-body-md text-light-on-surface-variant">
                  <div className="flex items-center justify-between">
                    <span>Hampers Subtotal ({cart.totalCount} items)</span>
                    <span className="font-title text-title-sm text-light-on-surface tabular-nums">
                      ₹{cart.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Signature Keepsake Packaging</span>
                    <span className="font-label text-label-sm text-success font-bold">
                      Complimentary
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Express Climate-Controlled Delivery</span>
                    <span className="font-title text-title-sm tabular-nums">
                      {cart.deliveryCharge === 0 ? (
                        <span className="text-success font-bold font-label text-label-sm">FREE</span>
                      ) : (
                        `₹${cart.deliveryCharge.toLocaleString("en-IN")}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-light-outline-variant/60 pt-4 flex items-baseline justify-between">
                  <div className="flex flex-col">
                    <span className="font-headline text-headline-sm text-light-on-surface">Total Amount</span>
                    <span className="font-label text-[11px] text-light-on-surface-variant">Inclusive of all taxes</span>
                  </div>
                  <span className="font-title text-2xl font-bold text-light-primary tabular-nums">
                    ₹{cart.total.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  disabled={isLoading || cart.items.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-light-primary text-light-on-primary py-4 px-6 font-label text-label-lg transition-colors hover:bg-burgundy/90 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary disabled:opacity-75"
                >
                  <MaterialIcon name="lock" size={18} />
                  <span>Proceed to Checkout</span>
                </button>

                {/* Trust Guarantees */}
                <div className="border-t border-light-outline-variant/60 pt-4 flex flex-col gap-2.5 text-[12px] font-label text-light-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="verified_user" size={16} className="text-champagne-gold" />
                    <span>Bank-grade 256-bit encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="schedule" size={16} className="text-champagne-gold" />
                    <span>Dispatched in signature damage-proof gift packaging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="loyalty" size={16} className="text-champagne-gold" />
                    <span>Complimentary ribbon &amp; wax seal crest guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 11. Premium Footer */}
      <Footer />
    </div>
  );
}
