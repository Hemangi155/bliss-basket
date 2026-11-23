"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialIcon from "@/components/MaterialIcon";
import { useCartWishlist } from "@/context/CartWishlistContext";

export default function CheckoutPage() {
  const { cart } = useCartWishlist();
  const [placedOrder, setPlacedOrder] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    giftNote: "",
    paymentMethod: "online",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNumber = `BB-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrder(orderNumber);
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-surface text-light-on-surface">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 lg:py-16">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-label text-label-sm text-light-on-surface-variant mb-8"
        >
          <Link href="/" className="hover:text-light-primary transition-colors">
            Home
          </Link>
          <span className="text-light-outline">/</span>
          <Link href="/cart" className="hover:text-light-primary transition-colors">
            Shopping Bag
          </Link>
          <span className="text-light-outline">/</span>
          <span className="text-light-primary font-bold">Checkout</span>
        </nav>

        {placedOrder ? (
          /* Order Confirmation View */
          <div className="rounded-2xl border border-light-outline-variant bg-light-surface-container-lowest p-12 lg:p-20 text-center flex flex-col items-center max-w-2xl mx-auto shadow-sm">
            <div className="h-20 w-20 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center mb-6">
              <MaterialIcon name="check_circle" size={44} />
            </div>
            <span className="font-label text-label-sm uppercase tracking-widest text-light-primary font-bold mb-2">
              Order Confirmed
            </span>
            <h1 className="font-headline text-headline-lg text-light-primary mb-3">
              Thank You for Your Order
            </h1>
            <p className="font-body text-body-md text-light-on-surface-variant mb-6 leading-relaxed">
              Your bespoke hamper order <strong className="text-light-on-surface">{placedOrder}</strong> has been
              received and is being carefully assembled in our studio with handwritten calligraphy and signature ribbon seals.
            </p>
            <div className="p-4 rounded-xl bg-light-surface-container-low border border-light-outline-variant text-label-sm text-light-on-surface-variant w-full max-w-md mb-8">
              A confirmation with tracking details will be sent to <strong>{formData.email || "your email"}</strong> once dispatched.
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-light-primary text-light-on-primary px-8 py-3.5 font-label text-label-lg hover:bg-burgundy/90 transition-colors shadow-sm"
            >
              <span>Return to Atelier Home</span>
              <MaterialIcon name="arrow_forward" size={18} />
            </Link>
          </div>
        ) : cart.items.length === 0 ? (
          /* Empty Bag Redirect prompt */
          <div className="rounded-2xl border border-light-outline-variant bg-light-surface-container-lowest p-12 text-center flex flex-col items-center max-w-lg mx-auto">
            <MaterialIcon name="shopping_bag" size={40} className="text-light-primary mb-4" />
            <h2 className="font-headline text-headline-sm mb-2">No items in your bag</h2>
            <p className="font-body text-body-md text-light-on-surface-variant mb-6">
              Please add hampers to your shopping bag before proceeding to checkout.
            </p>
            <Link
              href="/products"
              className="rounded-full bg-light-primary text-light-on-primary px-6 py-3 font-label text-label-md"
            >
              Explore Hampers
            </Link>
          </div>
        ) : (
          /* Checkout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Form: Delivery & Gifting details */}
            <form onSubmit={handlePlaceOrder} className="lg:col-span-7 flex flex-col gap-8">
              {/* Delivery Address Section */}
              <div className="rounded-2xl border border-light-outline-variant bg-light-surface-container-lowest p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-light-outline-variant/60 pb-4">
                  <div className="h-8 w-8 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h2 className="font-headline text-headline-sm text-light-primary">
                    Delivery Address &amp; Contact
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-label text-label-sm text-light-on-surface mb-1.5">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Aanya Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-light-outline-variant bg-light-surface px-4 py-2.5 font-body text-body-md focus:border-light-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-label-sm text-light-on-surface mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-light-outline-variant bg-light-surface px-4 py-2.5 font-body text-body-md focus:border-light-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-label-sm text-light-on-surface mb-1.5">
                      Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-light-outline-variant bg-light-surface px-4 py-2.5 font-body text-body-md focus:border-light-primary focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-label text-label-sm text-light-on-surface mb-1.5">
                      Street Address &amp; Apartment / Landmark *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="Apartment, Studio, Street name"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-light-outline-variant bg-light-surface px-4 py-2.5 font-body text-body-md focus:border-light-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-label-sm text-light-on-surface mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-light-outline-variant bg-light-surface px-4 py-2.5 font-body text-body-md focus:border-light-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-label-sm text-light-on-surface mb-1.5">
                      Postal Code (PIN) *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      placeholder="400001"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-light-outline-variant bg-light-surface px-4 py-2.5 font-body text-body-md focus:border-light-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Complimentary Handwritten Calligraphy Note */}
              <div className="rounded-2xl border border-light-outline-variant bg-light-surface-container-lowest p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-light-outline-variant/60 pb-4">
                  <div className="h-8 w-8 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="font-headline text-headline-sm text-light-primary">
                      Complimentary Handwritten Calligraphy Letter
                    </h2>
                    <p className="font-label text-[12px] text-light-on-surface-variant">
                      Inscribed on handmade cotton rag paper and sealed with burgundy wax.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block font-label text-label-sm text-light-on-surface mb-1.5">
                    Your Personal Message (Optional)
                  </label>
                  <textarea
                    name="giftNote"
                    rows={3}
                    placeholder="Write a heartfelt note for the recipient. Our studio calligrapher will handwrite this message word for word..."
                    value={formData.giftNote}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-light-outline-variant bg-light-surface px-4 py-2.5 font-body text-body-md focus:border-light-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="rounded-2xl border border-light-outline-variant bg-light-surface-container-lowest p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-light-outline-variant/60 pb-4">
                  <div className="h-8 w-8 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h2 className="font-headline text-headline-sm text-light-primary">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === "online"
                        ? "border-light-primary bg-light-primary-container/20 ring-1 ring-light-primary"
                        : "border-light-outline-variant bg-light-surface"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === "online"}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-label text-label-md font-bold text-light-on-surface block">
                        UPI / Cards / Net Banking
                      </span>
                      <span className="font-body text-body-sm text-light-on-surface-variant block mt-0.5">
                        Instant secure checkout with Google Pay, PhonePe, Cards
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === "cod"
                        ? "border-light-primary bg-light-primary-container/20 ring-1 ring-light-primary"
                        : "border-light-outline-variant bg-light-surface"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-label text-label-md font-bold text-light-on-surface block">
                        Cash on Delivery
                      </span>
                      <span className="font-body text-body-sm text-light-on-surface-variant block mt-0.5">
                        Pay upon doorstep arrival in tamper-evident packaging
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-light-primary text-light-on-primary py-4 px-6 font-label text-label-lg hover:bg-burgundy/90 transition-colors shadow-md"
              >
                <MaterialIcon name="lock" size={18} />
                <span>Place Gifting Order (₹{cart.total.toLocaleString("en-IN")})</span>
              </button>
            </form>

            {/* Right Summary Sidebar */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="rounded-2xl border border-light-outline-variant bg-light-surface-container-lowest p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                <h3 className="font-headline text-headline-sm text-light-primary border-b border-light-outline-variant/60 pb-3">
                  Order Summary ({cart.totalCount} items)
                </h3>

                <div className="divide-y divide-light-outline-variant/60 max-h-72 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-light-surface-container-low shrink-0 border border-light-outline-variant">
                          <Image
                            src={item.image || "/images/velvet-rose.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-headline text-[14px] text-light-on-surface truncate">
                            {item.name}
                          </p>
                          <p className="font-label text-[12px] text-light-on-surface-variant">
                            Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <span className="font-title text-title-sm text-light-primary tabular-nums shrink-0 font-bold">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-light-outline-variant/60 pt-4 flex flex-col gap-2 font-body text-body-sm text-light-on-surface-variant">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-title text-light-on-surface tabular-nums">
                      ₹{cart.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Signature Packaging</span>
                    <span className="font-label text-success font-bold">Complimentary</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Express Delivery</span>
                    <span className="font-title tabular-nums">
                      {cart.deliveryCharge === 0 ? (
                        <span className="text-success font-bold font-label">FREE</span>
                      ) : (
                        `₹${cart.deliveryCharge.toLocaleString("en-IN")}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-light-outline-variant/60 pt-4 flex items-baseline justify-between">
                  <span className="font-headline text-headline-sm text-light-on-surface">Total</span>
                  <span className="font-title text-2xl font-bold text-light-primary tabular-nums">
                    ₹{cart.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
