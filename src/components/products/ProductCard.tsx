"use client";

import { useState } from "react";
import MaterialIcon from "../MaterialIcon";
import { Product } from "@/data/products";
import { useCartWishlist } from "@/context/CartWishlistContext";

interface ProductCardProps {
  product: Product;
  onAddToBag?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToBag,
}: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlistIds } = useCartWishlist();
  const [btnText, setBtnText] = useState("Add to Bag");
  const [isAdding, setIsAdding] = useState(false);

  const isWishlisted = wishlistIds.has(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleAdd = async () => {
    setIsAdding(true);
    setBtnText("Added to Bag ✓");
    await addToCart(product.id, 1);
    if (onAddToBag) onAddToBag(product);
    setIsAdding(false);
    setTimeout(() => {
      setBtnText("Add to Bag");
    }, 1400);
  };

  const handleToggleWishlist = async () => {
    await toggleWishlist(product.id);
  };

  const badgeStyles: Record<string, string> = {
    bestseller:
      "bg-light-secondary-container text-light-on-secondary-container border border-champagne-gold/40",
    festive: "bg-light-primary text-light-on-primary",
    new: "bg-light-primary-container text-light-on-primary-container border border-light-outline-variant",
    popular:
      "bg-light-surface-container-high text-light-on-surface border border-light-outline-variant",
  };

  return (
    <article
      data-component-id="card-product"
      className="group h-full rounded-md bg-light-surface-container-lowest border border-light-outline-variant overflow-hidden shadow-sm transition-all duration-card-hover ease-card-hover hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
    >
      <div>
        {/* Product Image Area */}
        <div className="relative overflow-hidden bg-light-surface-container-low aspect-[4/3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.imageAlt}
            className="w-full h-full object-cover transition-transform duration-surface-enter ease-surface-enter group-hover:scale-105"
            loading="lazy"
          />

          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-3 left-3 inline-flex items-center rounded-full px-3 py-1 font-label text-label-sm uppercase tracking-wider shadow-xs ${
                badgeStyles[product.badgeType || "popular"] ||
                badgeStyles.popular
              }`}
            >
              {product.badge}
            </span>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            aria-label={`${isWishlisted ? "Remove from" : "Save to"} wishlist: ${product.name}`}
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-light-surface-container-lowest/90 backdrop-blur-xs border border-light-outline-variant transition-colors duration-state-change hover:text-light-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary ${
              isWishlisted ? "text-light-primary" : "text-light-on-surface"
            }`}
          >
            <MaterialIcon
              name="favorite"
              className="text-title-md"
              filled={isWishlisted}
            />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col gap-2.5">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between text-label-sm gap-2">
            <span className="font-label text-light-primary uppercase tracking-wider text-[11px] truncate">
              {product.category}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <MaterialIcon
                name="star"
                className="text-title-sm text-champagne-gold"
                filled
              />
              <span className="font-label text-light-on-surface tabular-nums">
                {product.rating.toFixed(1)} ({product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-headline text-headline-sm text-light-on-surface group-hover:text-light-primary transition-colors duration-state-change">
            {product.name}
          </h3>

          {/* Description */}
          <p className="font-body text-body-md text-light-on-surface-variant line-clamp-2">
            {product.description}
          </p>

          {/* Contents Pill List */}
          <div className="pt-1 flex flex-wrap gap-1.5">
            {product.contents.slice(0, 2).map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-0.5 rounded-sm bg-light-surface-container-low text-light-on-surface-variant text-[11px] font-body truncate max-w-full"
              >
                • {item}
              </span>
            ))}
            {product.contents.length > 2 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-light-surface-container-low text-light-primary text-[11px] font-label">
                +{product.contents.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Area with Pricing and CTA */}
      <footer className="px-5 pb-5 pt-3 border-t border-light-outline-variant/50 flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-title text-title-lg text-light-primary tabular-nums">
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
          onClick={handleAdd}
          disabled={isAdding}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-light-primary text-light-on-primary px-5 py-2.5 font-label text-label-lg transition-colors duration-state-change ease-state-change hover:bg-burgundy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2 disabled:opacity-80"
        >
          <MaterialIcon name="shopping_bag" className="text-title-md" />
          <span>{btnText}</span>
        </button>
      </footer>
    </article>
  );
}
