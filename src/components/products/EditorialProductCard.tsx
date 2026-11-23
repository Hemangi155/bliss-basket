"use client";

import { useState } from "react";
import MaterialIcon from "../MaterialIcon";
import { Product } from "@/data/products";
import { useCartWishlist } from "@/context/CartWishlistContext";

interface EditorialProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToBag?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  layoutVariant?: "portrait-tall" | "landscape-wide" | "standard";
}

export default function EditorialProductCard({
  product,
  onQuickView,
  onAddToBag,
  onToggleWishlist,
  isWishlisted: isWishlistedProp,
  layoutVariant = "standard",
}: EditorialProductCardProps) {
  const { addToCart, toggleWishlist, wishlistIds } = useCartWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [btnText, setBtnText] = useState("Add to Bag");
  const [isAdding, setIsAdding] = useState(false);

  const isWishlisted = isWishlistedProp !== undefined ? isWishlistedProp : wishlistIds.has(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    setBtnText("Added ✓");
    await addToCart(product.id, 1);
    if (onAddToBag) onAddToBag(product);
    setIsAdding(false);
    setTimeout(() => {
      setBtnText("Add to Bag");
    }, 1200);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    } else {
      await toggleWishlist(product.id);
    }
  };

  const badgeStyles: Record<string, string> = {
    bestseller: "bg-light-secondary-container text-light-on-secondary-container border border-champagne-gold/40",
    festive: "bg-light-primary text-light-on-primary",
    curator: "bg-burgundy text-light-on-primary border border-champagne-gold/50",
    new: "bg-light-primary-container text-light-on-primary-container border border-light-outline-variant",
    popular: "bg-light-surface-container-high text-light-on-surface border border-light-outline-variant",
  };

  // Asymmetric aspect ratio depending on variant
  const aspectClass =
    layoutVariant === "portrait-tall"
      ? "aspect-[3/4]"
      : layoutVariant === "landscape-wide"
      ? "aspect-[16/10]"
      : "aspect-[4/3]";

  return (
    <article
      data-component-id="editorial-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-light-surface-container-lowest border border-light-outline-variant rounded-md overflow-hidden flex flex-col justify-between transition-all duration-card-hover ease-card-hover hover:-translate-y-1 hover:shadow-lg"
    >
      <div>
        {/* Editorial Header Strip inside Card */}
        <div className="px-4 py-2.5 bg-light-surface-container-low border-b border-light-outline-variant/60 flex items-center justify-between text-label-sm">
          <span className="font-mono text-mono-sm text-light-primary tracking-wider font-semibold">
            {product.editionNumber}
          </span>
          <span className="font-label text-[11px] uppercase tracking-wider text-light-on-surface-variant truncate max-w-[140px]">
            {product.emotionalCollection}
          </span>
        </div>

        {/* Dual-Image Photography Container with Smooth Hover Reveal */}
        <div
          className={`relative w-full ${aspectClass} overflow-hidden bg-light-surface-container-low cursor-pointer`}
          onClick={() => onQuickView(product)}
        >
          {/* Base Image (Packaging / Closed Box) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.imageAlt}
            className={`w-full h-full object-cover transition-all duration-surface-enter ease-surface-enter ${
              isHovered && product.hoverImage
                ? "opacity-0 scale-105"
                : "opacity-100 scale-100"
            }`}
            loading="lazy"
          />

          {/* Secondary Hover Image (Open Hamper / Treats Revealed) */}
          {product.hoverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.hoverImage}
              alt={`${product.name} open view`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-surface-enter ease-surface-enter ${
                isHovered
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
              loading="lazy"
            />
          )}

          {/* Top Left: Badge */}
          {product.badge && (
            <span
              className={`absolute top-3 left-3 inline-flex items-center rounded-full px-3 py-1 font-label text-label-sm uppercase tracking-wider shadow-sm z-10 ${
                badgeStyles[product.badgeType || "popular"] ||
                badgeStyles.popular
              }`}
            >
              {product.badge}
            </span>
          )}

          {/* Top Right: Wishlist Toggle */}
          <button
            type="button"
            aria-label={`${isWishlisted ? "Remove from" : "Save to"} wishlist: ${product.name}`}
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-light-surface-container-lowest/90 backdrop-blur-xs border border-light-outline-variant transition-colors duration-state-change hover:text-light-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary ${
              isWishlisted ? "text-light-primary" : "text-light-on-surface"
            }`}
          >
            <MaterialIcon
              name="favorite"
              size="1.15em"
              filled={isWishlisted}
            />
          </button>

          {/* Hover Overlay Quick-View Pill Button */}
          <div
            className={`absolute inset-x-0 bottom-3 flex justify-center px-4 transition-all duration-state-change z-10 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0 pointer-events-none"
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-light-surface-container-lowest/95 backdrop-blur-xs text-light-primary border border-light-primary/30 font-label text-label-sm shadow-md hover:bg-light-primary hover:text-light-on-primary transition-all duration-state-change"
            >
              <MaterialIcon name="auto_awesome" size="1em" />
              <span>Quick View &amp; Contents</span>
            </button>
          </div>

          {/* Image Hover Prompt Badge */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-xs bg-dark-text/60 text-light-on-primary font-mono text-[9px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            Hover to unbox
          </div>
        </div>

        {/* Editorial Body Content */}
        <div className="p-5 flex flex-col gap-2.5">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-label-sm gap-2">
            <span className="font-label text-light-primary uppercase tracking-wider text-[11px] truncate">
              {product.category}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <MaterialIcon
                name="star"
                className="text-champagne-gold"
                size="1em"
                filled
              />
              <span className="font-label text-light-on-surface tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-light-on-surface-variant text-[11px]">
                ({product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="flex flex-col cursor-pointer" onClick={() => onQuickView(product)}>
            <h3 className="font-headline text-headline-sm text-light-on-surface group-hover:text-light-primary transition-colors duration-state-change">
              {product.name}
            </h3>
            <span className="font-label text-[12px] text-light-on-surface-variant/80 italic line-clamp-1">
              &ldquo;{product.tagline}&rdquo;
            </span>
          </div>

          {/* Description */}
          <p className="font-body text-body-md text-light-on-surface-variant line-clamp-2">
            {product.description}
          </p>

          {/* Contents Preview Pills */}
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
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-light-primary-container text-light-primary text-[11px] font-label hover:underline"
              >
                +{product.contents.length - 2} treats
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Area with Price & Actions */}
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

        <div className="flex items-center gap-2">
          {/* Quick View Button */}
          <button
            type="button"
            aria-label={`View details for ${product.name}`}
            onClick={() => onQuickView(product)}
            className="px-3 py-2 rounded-full border border-light-outline-variant bg-light-surface-container-lowest text-light-on-surface font-label text-label-sm hover:bg-light-primary-container hover:text-light-primary transition-colors duration-state-change shrink-0"
          >
            Details
          </button>

          {/* Add to Bag Button */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-light-primary text-light-on-primary py-2.5 px-4 font-label text-label-md transition-colors duration-state-change ease-state-change hover:bg-burgundy/90 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary disabled:opacity-80"
          >
            <MaterialIcon name="shopping_bag" size="1.1em" />
            <span>{btnText}</span>
          </button>
        </div>
      </footer>
    </article>
  );
}
