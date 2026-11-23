"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "./MaterialIcon";
import { useCartWishlist } from "@/context/CartWishlistContext";

interface Product {
  id: number;
  productId: string;
  name: string;
  desc: string;
  price: string;
  rating: string;
  reviews: number;
  badge: string;
  badgeComponentId: string;
  badgeClass: string;
  image: string;
  imageAlt: string;
}

const products: Product[] = [
  {
    id: 1,
    productId: "BB-ED06",
    name: "Velvet Rose Edit",
    desc: "Rosewater mist, Belgian dark truffles & hand-poured soy candle.",
    price: "₹3,499",
    rating: "4.9",
    reviews: 128,
    badge: "Bestseller",
    badgeComponentId: "badge-status",
    badgeClass: "bg-light-secondary-container text-light-on-secondary-container",
    image: "/images/velvet-rose.jpg",
    imageAlt: "The Velvet Rose Edit gift hamper",
  },
  {
    id: 2,
    productId: "BB-ED04",
    name: "Royal Festive Box",
    desc: "Kashmiri saffron kahwa, brass tealight diya & roasted almonds.",
    price: "₹5,200",
    rating: "5.0",
    reviews: 94,
    badge: "Festive Edit",
    badgeComponentId: "badge-festive",
    badgeClass: "bg-light-primary text-light-on-primary",
    image: "/images/royal-festive.jpg",
    imageAlt: "Royal Festive Box gift hamper",
  },
  {
    id: 3,
    productId: "BB-ED02",
    name: "Gentleman's Reserve",
    desc: "Nilgiri single-origin roast, linen journal & 70% cacao bar.",
    price: "₹4,500",
    rating: "4.8",
    reviews: 76,
    badge: "Corporate Fav",
    badgeComponentId: "badge-status",
    badgeClass: "bg-light-secondary-container text-light-on-secondary-container",
    image: "/images/gentlemans-reserve.jpg",
    imageAlt: "Gentleman's Reserve gift hamper",
  },
  {
    id: 4,
    productId: "BB-ED03",
    name: "Self-Care Sanctuary",
    desc: "Chamomile bath salts, rose petal soap, silk mask & ceramic mug.",
    price: "₹3,200",
    rating: "4.9",
    reviews: 112,
    badge: "New Arrival",
    badgeComponentId: "badge-new",
    badgeClass: "bg-light-primary-container text-light-on-primary-container",
    image: "/images/self-care.jpg",
    imageAlt: "Self-Care Sanctuary gift hamper",
  },
];

function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlistIds } = useCartWishlist();
  const [btnLabel, setBtnLabel] = useState("Add to Bag");
  const [isAdding, setIsAdding] = useState(false);

  const isWishlisted = wishlistIds.has(product.productId);

  const handleAdd = async () => {
    setIsAdding(true);
    setBtnLabel("Added to Bag ✓");
    await addToCart(product.productId, 1);
    setIsAdding(false);
    setTimeout(() => {
      setBtnLabel("Add to Bag");
    }, 1400);
  };

  const handleToggleWishlist = async () => {
    await toggleWishlist(product.productId);
  };

  return (
    <article
      data-component-id="card-action"
      data-component-type="card"
      data-component-variant="action"
      className="h-full rounded-md bg-light-surface-container-lowest border border-light-outline-variant overflow-hidden shadow-sm transition-transform duration-card-hover ease-card-hover hover:-translate-y-0.5 flex flex-col justify-between"
    >
      <div>
        {/* Image container: aspect-[4/3] defines height so fill Image works */}
        <div className="relative overflow-hidden bg-light-surface-container-low aspect-[4/3]">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* z-10 ensures badge sits above the fill image */}
          <span
            data-component-id={product.badgeComponentId}
            data-component-type="badge"
            data-component-variant="status"
            className={`absolute top-3 left-3 z-10 inline-flex items-center rounded-full px-3 py-1 ${product.badgeClass}`}
          >
            <span
              className="font-label text-label-sm uppercase"
              data-design-text-token="label-sm"
            >
              {product.badge}
            </span>
          </span>
          {/* z-10 ensures wishlist button sits above the fill image */}
          <button
            type="button"
            aria-label={`${isWishlisted ? "Remove from" : "Save to"} wishlist: ${product.name}`}
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-light-surface-container-lowest/90 border border-light-outline-variant transition-colors duration-state-change hover:text-light-primary ${
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
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <MaterialIcon
              name="star"
              className="text-title-md text-champagne-gold"
              filled
            />
            <span
              className="font-label text-label-sm text-light-on-surface tabular-nums"
              data-design-text-token="label-sm"
            >
              {product.rating} ({product.reviews})
            </span>
          </div>
          <h3
            className="font-headline text-headline-sm text-light-on-surface"
            data-design-text-token="headline-sm"
          >
            {product.name}
          </h3>
          <p
            className="font-body text-body-md text-light-on-surface-variant"
            data-design-text-token="body-md"
          >
            {product.desc}
          </p>
        </div>
      </div>
      <footer className="px-5 pb-5 pt-2 flex flex-col gap-3">
        <p
          className="font-title text-title-lg text-light-primary tabular-nums"
          data-design-text-token="title-lg"
        >
          {product.price}
        </p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isAdding}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-light-primary text-light-on-primary px-5 py-2.5 transition-colors duration-state-change ease-state-change hover:bg-burgundy/90 disabled:opacity-80"
        >
          <MaterialIcon name="shopping_bag" className="text-title-md" />
          <span
            className="font-label text-label-lg"
            data-design-text-token="label-lg"
          >
            {btnLabel}
          </span>
        </button>
      </footer>
    </article>
  );
}

export default function BestsellersSection() {
  return (
    <section id="bestsellers" className="bg-light-surface py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span
              className="font-label text-label-sm uppercase text-light-primary"
              data-design-text-token="label-sm"
            >
              Most Loved Curations
            </span>
            <h2
              className="font-headline text-headline-lg-mobile lg:text-headline-lg text-light-on-surface"
              data-design-text-token="headline-lg"
            >
              Bestselling Hampers
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 font-label text-label-lg text-light-primary hover:underline"
          >
            <span data-design-text-token="label-lg">View All Collections</span>
            <MaterialIcon name="arrow_forward" className="text-title-md" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
