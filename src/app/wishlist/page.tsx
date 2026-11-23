"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialIcon from "@/components/MaterialIcon";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { Product } from "@/data/products";

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist, addToCart, isLoading } = useCartWishlist();
  const [movingId, setMovingId] = useState<string | null>(null);

  const handleMoveToBag = async (product: Product) => {
    setMovingId(product.id);
    await addToCart(product.id, 1);
    setMovingId(null);
  };

  const badgeStyles: Record<string, string> = {
    bestseller: "bg-light-secondary-container text-light-on-secondary-container border border-champagne-gold/40",
    festive: "bg-light-primary text-light-on-primary",
    curator: "bg-burgundy text-light-on-primary border border-champagne-gold/50",
    new: "bg-light-primary-container text-light-on-primary-container border border-light-outline-variant",
    popular: "bg-light-surface-container-high text-light-on-surface border border-light-outline-variant",
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
          <span className="text-light-primary font-bold">Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-light-outline-variant pb-6 mb-10">
          <div>
            <span className="font-label text-label-sm uppercase tracking-widest text-light-primary font-bold">
              Saved Atelier Curations
            </span>
            <h1 className="font-headline text-headline-lg-mobile lg:text-headline-lg text-light-primary mt-1">
              Your Wishlist
            </h1>
          </div>
          <p className="font-label text-label-md text-light-on-surface-variant">
            {wishlistItems.length} {wishlistItems.length === 1 ? "hamper" : "hampers"} saved
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist State */
          <div className="rounded-2xl border border-light-outline-variant bg-light-surface-container-lowest p-12 lg:p-20 text-center flex flex-col items-center max-w-2xl mx-auto shadow-sm">
            <div className="h-20 w-20 rounded-full bg-light-primary-container/60 text-light-primary flex items-center justify-center mb-6">
              <MaterialIcon name="favorite_border" size={36} />
            </div>
            <h2 className="font-headline text-headline-md text-light-on-surface mb-3">
              Your wishlist is empty
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant max-w-md mb-8 leading-relaxed">
              Save your favorite luxury hampers, festive boxes, and artisanal keepsakes here 
              to curate your gifting moments with ease.
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
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {wishlistItems.map((product) => {
              const discountPercent = product.originalPrice
                ? Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )
                : 0;

              return (
                <article
                  key={product.id}
                  className="group relative bg-light-surface-container-lowest border border-light-outline-variant rounded-md overflow-hidden flex flex-col justify-between shadow-sm transition-all duration-card-hover ease-card-hover hover:-translate-y-1 hover:shadow-md"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative overflow-hidden bg-light-surface-container-low aspect-[4/3]">
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        className="object-cover transition-transform duration-surface-enter ease-surface-enter group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* Badge */}
                      {product.badge && (
                        <span
                          className={`absolute top-3 left-3 inline-flex items-center rounded-full px-3 py-1 font-label text-label-sm uppercase tracking-wider shadow-xs z-10 ${
                            badgeStyles[product.badgeType || "popular"] || badgeStyles.popular
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}

                      {/* Remove From Wishlist Button */}
                      <button
                        type="button"
                        aria-label={`Remove ${product.name} from wishlist`}
                        onClick={() => toggleWishlist(product.id)}
                        disabled={isLoading}
                        className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-light-surface-container-lowest/90 backdrop-blur-xs border border-light-outline-variant text-light-primary hover:text-light-error transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary"
                      >
                        <MaterialIcon name="favorite" size={20} filled />
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-label-sm gap-2">
                        <span className="font-label text-light-primary uppercase tracking-wider text-[11px] truncate">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <MaterialIcon
                            name="star"
                            className="text-title-sm text-champagne-gold"
                            size={16}
                            filled
                          />
                          <span className="font-label text-light-on-surface tabular-nums">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-headline text-headline-sm text-light-on-surface group-hover:text-light-primary transition-colors">
                        {product.name}
                      </h3>

                      <p className="font-body text-body-md text-light-on-surface-variant line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <footer className="px-5 pb-5 pt-3 border-t border-light-outline-variant/60 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-title text-title-lg text-light-primary tabular-nums font-bold">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        {product.originalPrice && (
                          <span className="font-body text-body-sm text-light-on-surface-variant/70 line-through tabular-nums">
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      {discountPercent > 0 && (
                        <span className="font-label text-[11px] uppercase px-2 py-0.5 rounded-sm bg-success/15 text-success font-bold">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMoveToBag(product)}
                      disabled={isLoading || movingId === product.id}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-light-primary text-light-on-primary py-2.5 px-4 font-label text-label-md transition-colors hover:bg-burgundy/90 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary disabled:opacity-80"
                    >
                      <MaterialIcon name="shopping_bag" size={18} />
                      <span>{movingId === product.id ? "Adding..." : "Add to Bag"}</span>
                    </button>
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* 11. Premium Footer */}
      <Footer />
    </div>
  );
}
