"use client";

import { useEffect, useState } from "react";
import MaterialIcon from "../MaterialIcon";
import { Product } from "@/data/products";
import { useCartWishlist } from "@/context/CartWishlistContext";

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToBag?: (product: Product, quantity: number) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

export default function ProductQuickView({
  product,
  onClose,
  onAddToBag,
  onToggleWishlist,
  isWishlisted: isWishlistedProp,
}: ProductQuickViewProps) {
  const { addToCart, toggleWishlist, wishlistIds } = useCartWishlist();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [btnText, setBtnText] = useState<string>("Add to Bag");
  const [isAdding, setIsAdding] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const isWishlisted =
    isWishlistedProp !== undefined
      ? isWishlistedProp
      : wishlistIds.has(product.id);

  const activeImage = selectedImage || product.image;

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleAdd = async () => {
    setIsAdding(true);
    setBtnText("Added to Bag ✓");
    await addToCart(product.id, quantity);
    if (onAddToBag) onAddToBag(product, quantity);
    setIsAdding(false);
    setTimeout(() => {
      setBtnText("Add to Bag");
      onClose();
    }, 1000);
  };

  const handleToggleWishlist = async () => {
    if (onToggleWishlist) {
      onToggleWishlist(product);
    } else {
      await toggleWishlist(product.id);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-dark-text/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-light-surface-container-lowest rounded-xl border border-light-outline-variant shadow-2xl grid grid-cols-1 md:grid-cols-12 text-light-on-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-light-surface-container-lowest/90 text-light-on-surface border border-light-outline-variant hover:bg-light-primary hover:text-light-on-primary transition-colors shadow-xs"
        >
          <MaterialIcon name="close" size={20} />
        </button>

        {/* Left: Product Imagery with Dual Views */}
        <div className="md:col-span-6 p-6 sm:p-8 bg-light-surface-container-low flex flex-col justify-between gap-4 border-b md:border-b-0 md:border-r border-light-outline-variant">
          <div className="relative aspect-[4/3] sm:aspect-square rounded-lg overflow-hidden border border-light-outline-variant bg-light-surface-container-lowest shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.imageAlt}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-light-primary text-light-on-primary font-label text-label-sm uppercase tracking-wider shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Dual Image Thumbnails */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedImage(product.image)}
              className={`relative flex-1 aspect-[4/3] rounded-md overflow-hidden border transition-all ${
                activeImage === product.image
                  ? "border-light-primary ring-2 ring-light-primary/30"
                  : "border-light-outline-variant opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt="Keepsake packaging"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded-xs bg-dark-text/70 text-light-on-primary text-[10px] font-label">
                Keepsake Box
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedImage(product.hoverImage)}
              className={`relative flex-1 aspect-[4/3] rounded-md overflow-hidden border transition-all ${
                activeImage === product.hoverImage
                  ? "border-light-primary ring-2 ring-light-primary/30"
                  : "border-light-outline-variant opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.hoverImage}
                alt="Open hamper view"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded-xs bg-dark-text/70 text-light-on-primary text-[10px] font-label">
                Open Hamper
              </span>
            </button>
          </div>

          {/* Keepsake Packaging Note */}
          <div className="rounded-md bg-light-surface-container-lowest p-3 border border-light-outline-variant/60 flex items-start gap-2.5">
            <MaterialIcon
              name="workspace_premium"
              className="text-light-primary shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex flex-col text-body-sm">
              <span className="font-title text-title-sm text-light-on-surface">
                Signature Packaging
              </span>
              <span className="text-light-on-surface-variant text-[12px]">
                {product.keepsakePackaging}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Editorial Narrative & Shopping Actions */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            {/* Edition & Emotion Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-light-outline-variant/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-mono-sm text-light-primary font-bold tracking-wider">
                  {product.editionNumber}
                </span>
                <span className="text-light-outline">•</span>
                <span className="font-label text-label-sm uppercase text-light-on-surface-variant tracking-wider">
                  {product.category}
                </span>
              </div>
              <span className="font-label text-[11px] text-champagne-gold bg-light-secondary-container px-2.5 py-0.5 rounded-full font-bold">
                {product.emotionalCollection}
              </span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h2
                id="quick-view-title"
                className="font-headline text-headline-lg-mobile lg:text-headline-md text-light-on-surface"
              >
                {product.name}
              </h2>
              <p className="font-label text-label-sm text-light-primary italic mt-0.5">
                &ldquo;{product.tagline}&rdquo;
              </p>
            </div>

            {/* Rating Row */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-champagne-gold">
                {[...Array(5)].map((_, i) => (
                  <MaterialIcon
                    key={i}
                    name="star"
                    size={16}
                    filled
                  />
                ))}
              </div>
              <span className="font-label text-label-sm text-light-on-surface font-bold tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-light-on-surface-variant text-body-sm">
                ({product.reviewsCount} verified reviews)
              </span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-title text-2xl font-bold text-light-primary tabular-nums">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="font-body text-body-md text-light-on-surface-variant/70 line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="font-label text-label-sm px-2.5 py-0.5 rounded-full bg-success/15 text-success font-bold">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Editorial Story */}
            <p className="font-body text-body-md text-light-on-surface-variant leading-relaxed text-pretty">
              {product.story}
            </p>

            {/* What's Inside Contents Box */}
            <div className="rounded-md bg-light-surface-container-low border border-light-outline-variant p-4 flex flex-col gap-2">
              <span className="font-title text-title-sm text-light-on-surface uppercase tracking-wider text-[12px]">
                Hamper Contents ({product.contents.length} Items)
              </span>
              <ul className="flex flex-col gap-1.5 text-body-sm text-light-on-surface-variant">
                {product.contents.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-champagne-gold font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions: Quantity + Add to Cart + Wishlist */}
          <div className="flex flex-col gap-3 pt-4 border-t border-light-outline-variant/60">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="inline-flex items-center rounded-full border border-light-outline-variant bg-light-surface-container-lowest px-2 py-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-light-primary-container text-light-on-surface"
                >
                  -
                </button>
                <span className="px-3 font-title text-title-md tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-light-primary-container text-light-on-surface"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={isAdding}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-light-primary text-light-on-primary py-3.5 px-6 font-label text-label-lg transition-colors duration-state-change hover:bg-burgundy/90 shadow-sm disabled:opacity-80"
              >
                <MaterialIcon name="shopping_bag" size={20} />
                <span>{btnText}</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                aria-label={`${isWishlisted ? "Remove from" : "Save to"} wishlist`}
                onClick={handleToggleWishlist}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full border border-light-outline-variant bg-light-surface-container-lowest transition-colors ${
                  isWishlisted
                    ? "text-light-primary bg-light-primary-container border-light-primary"
                    : "text-light-on-surface hover:text-light-primary hover:bg-light-primary-container"
                }`}
              >
                <MaterialIcon
                  name="favorite"
                  size={20}
                  filled={isWishlisted}
                />
              </button>
            </div>

            {/* Micro Delivery Notice */}
            <div className="flex items-center justify-center gap-2 text-label-sm text-light-on-surface-variant pt-1">
              <MaterialIcon
                name="local_shipping"
                className="text-champagne-gold"
                size={18}
              />
              <span>Dispatches within 24 hours in gift-ready keepsake box</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
