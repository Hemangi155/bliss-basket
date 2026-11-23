"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialIcon from "@/components/MaterialIcon";
import EditorialProductCard from "@/components/products/EditorialProductCard";
import ProductQuickView from "@/components/products/ProductQuickView";
import { useCartWishlist } from "@/context/CartWishlistContext";
import {
  CATEGORIES,
  EMOTIONAL_COLLECTIONS,
  SAMPLE_PRODUCTS,
  Product,
} from "@/data/products";

function CatalogueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Directly derive from URL query params
  const activeCategory = searchParams.get("category") || "all";
  const activeEmotion = searchParams.get("emotion") || "all";

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [maxPrice, setMaxPrice] = useState<number>(7500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const { addToCart, toggleWishlist, wishlistIds, showToast } = useCartWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const handleSelectCategory = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug === "all") {
      params.delete("category");
    } else {
      params.set("category", categorySlug);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
    setMobileFilterOpen(false);
  };

  const handleSelectEmotion = (emotionSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (emotionSlug === "all") {
      params.delete("emotion");
    } else {
      params.set("emotion", emotionSlug);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortBy("featured");
    setMaxPrice(7500);
    setInStockOnly(false);
    router.push("/products", { scroll: false });
  };

  const handleAddToBag = async (product: Product, quantity = 1) => {
    await addToCart(product.id, quantity);
    showToast(
      `Added to Bag (${quantity})`,
      `${product.name} has been added to your gifting bag.`,
      "success"
    );
  };

  const handleToggleWishlist = async (product: Product) => {
    await toggleWishlist(product.id);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...SAMPLE_PRODUCTS];

    // Filter by Category
    if (activeCategory !== "all") {
      result = result.filter((p) => p.categorySlug === activeCategory);
    }

    // Filter by Emotional Collection
    if (activeEmotion !== "all") {
      const matchedEmotion = EMOTIONAL_COLLECTIONS.find((e) => e.slug === activeEmotion);
      if (matchedEmotion) {
        result = result.filter((p) => p.emotionalCollection === matchedEmotion.name);
      }
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.contents.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Filter by Price Range
    result = result.filter((p) => p.price <= maxPrice);

    // Filter by In-Stock
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sort Results
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      case "featured":
      default:
        break;
    }

    return result;
  }, [activeCategory, activeEmotion, searchQuery, maxPrice, inStockOnly, sortBy]);

  // Featured icon hamper for the top editorial showcase
  const featuredHamper = SAMPLE_PRODUCTS[0]; // The Love Letter Box

  return (
    <div className="min-h-screen flex flex-col bg-light-surface text-light-on-surface">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Navigation Bar */}
      <Navbar />

      {/* 3. Luxury Editorial Introduction Header */}
      <section className="relative overflow-hidden bg-light-surface-container-low border-b border-light-outline-variant pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-10">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-label text-label-sm text-light-on-surface-variant"
          >
            <Link href="/" className="hover:text-light-primary transition-colors">
              Home
            </Link>
            <span className="text-light-outline">/</span>
            <Link
              href="/products"
              onClick={() => handleResetFilters()}
              className="hover:text-light-primary transition-colors"
            >
              The Atelier
            </Link>
            {activeCategory !== "all" && (
              <>
                <span className="text-light-outline">/</span>
                <span className="text-light-primary font-bold">
                  {CATEGORIES.find((c) => c.slug === activeCategory)?.name}
                </span>
              </>
            )}
          </nav>

          {/* Large Editorial Headline & Brand Description */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <span className="font-mono text-mono-sm uppercase text-light-primary tracking-widest">
                BLISS BASKET · AUTUMN / FESTIVE ATELIER
              </span>
              <h1 className="font-display text-display-md-mobile lg:text-display-lg text-light-on-surface text-balance">
                Gifts Crafted to Feel Like Pure Happiness.
              </h1>
              <p className="font-body text-body-lg text-light-on-surface-variant max-w-2xl text-pretty">
                Each bespoke hamper is thoughtfully assembled by hand in our Mumbai studio—wrapped in artisanal linen, adorned with wax-sealed calligraphic letters, and packed with botanical treats.
              </p>
            </div>

            {/* Micro Boutique Metrics */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 p-5 rounded-lg bg-light-surface-container-lowest border border-light-outline-variant shadow-xs">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center shrink-0">
                  <MaterialIcon name="auto_awesome" size="1.2em" />
                </span>
                <div>
                  <span className="font-title text-title-md text-light-on-surface block">
                    100% Keepsake Linen
                  </span>
                  <span className="font-body text-body-sm text-light-on-surface-variant">
                    Reusable artisanal boxes &amp; silk ribbons
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-light-outline-variant/60">
                <span className="h-10 w-10 rounded-full bg-light-secondary-container text-light-on-secondary-container flex items-center justify-center shrink-0">
                  <MaterialIcon name="schedule" size="1.2em" />
                </span>
                <div>
                  <span className="font-title text-title-md text-light-on-surface block">
                    Same-Day Courier
                  </span>
                  <span className="font-body text-body-sm text-light-on-surface-variant">
                    Mumbai &amp; Delhi NCR express dispatch
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Asymmetric Featured Hero Showcase Block */}
          {activeCategory === "all" && activeEmotion === "all" && !searchQuery && (
            <div className="rounded-xl overflow-hidden bg-light-surface-container-lowest border border-light-outline-variant p-6 sm:p-8 lg:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-4">
              <div className="lg:col-span-6 flex flex-col items-start gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-light-primary text-light-on-primary font-mono text-[11px] uppercase tracking-widest">
                  Featured Atelier Edition · 01
                </div>
                <h2 className="font-headline text-headline-lg-mobile lg:text-headline-lg text-light-on-surface">
                  {featuredHamper.name}
                </h2>
                <p className="font-label text-title-md text-light-primary italic">
                  &ldquo;{featuredHamper.tagline}&rdquo;
                </p>
                <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
                  {featuredHamper.story}
                </p>
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="font-title text-2xl font-bold text-light-primary tabular-nums">
                    ₹{featuredHamper.price.toLocaleString("en-IN")}
                  </span>
                  <span className="font-body text-body-md text-light-on-surface-variant/70 line-through tabular-nums">
                    ₹{featuredHamper.originalPrice?.toLocaleString("en-IN")}
                  </span>
                  <span className="font-label text-label-sm px-2 py-0.5 rounded-sm bg-success/15 text-success font-bold">
                    Curator&rsquo;s Selection
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleAddToBag(featuredHamper)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-light-primary text-light-on-primary px-6 py-3 font-label text-label-md hover:bg-burgundy/90 transition-colors shadow-sm"
                  >
                    <MaterialIcon name="shopping_bag" size="1.1em" />
                    <span>Add to Bag</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(featuredHamper)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-light-primary text-light-primary px-6 py-3 font-label text-label-md bg-light-surface-container-lowest hover:bg-light-primary-container transition-colors"
                  >
                    <MaterialIcon name="auto_awesome" size="1.1em" />
                    <span>View Contents ({featuredHamper.contents.length} items)</span>
                  </button>
                </div>
              </div>

              {/* Dual Visual Showcase on Right */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-3">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-light-outline-variant shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredHamper.image}
                    alt={featuredHamper.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-xs bg-dark-text/75 text-light-on-primary font-label text-[10px]">
                    Keepsake Box
                  </span>
                </div>
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-light-outline-variant shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredHamper.hoverImage}
                    alt="Open hamper view"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-xs bg-dark-text/75 text-light-on-primary font-label text-[10px]">
                    Open Atelier View
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Emotional Collections Shopping Ribbon */}
      <section className="bg-light-surface border-b border-light-outline-variant py-4 px-6 lg:px-12 sticky top-20 z-30 backdrop-blur-md bg-light-surface/95">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-[11px] uppercase tracking-wider text-light-primary font-bold pr-2 border-r border-light-outline-variant">
              SHOP BY FEELING:
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {EMOTIONAL_COLLECTIONS.map((emo) => {
              const isSelected = activeEmotion === emo.slug;
              return (
                <button
                  key={emo.id}
                  type="button"
                  onClick={() => handleSelectEmotion(emo.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-label-sm font-label whitespace-nowrap transition-all duration-state-change ${
                    isSelected
                      ? "bg-light-primary text-light-on-primary shadow-xs font-bold"
                      : "bg-light-surface-container-low text-light-on-surface-variant hover:text-light-primary hover:bg-light-primary-container"
                  }`}
                >
                  {emo.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Main Catalogue Spread */}
      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full">
        {/* Mobile Filter Toggle & Search Bar */}
        <div className="flex lg:hidden flex-col gap-3 pb-6 mb-6 border-b border-light-outline-variant">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-light-primary text-light-primary font-label text-label-sm bg-light-surface-container-lowest hover:bg-light-primary-container transition-colors shadow-xs"
            >
              <MaterialIcon name="palette" size="1.1em" />
              <span>Filter &amp; Sort Curations</span>
            </button>
            <span className="font-body text-body-sm text-light-on-surface-variant">
              {filteredProducts.length} Editions Available
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative flex items-center">
            <MaterialIcon
              name="search"
              className="absolute left-3.5 text-light-outline"
              size="1em"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by treat, occasion, or item..."
              className="w-full rounded-full border border-light-outline-variant bg-light-surface-container-low pl-10 pr-4 py-2 font-body text-body-sm text-light-on-surface placeholder:text-light-outline focus:outline-none focus:border-light-primary"
            />
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden mb-8 p-6 bg-light-surface-container-lowest border border-light-outline-variant rounded-xl shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-light-outline-variant">
              <h3 className="font-title text-title-md text-light-on-surface">
                Refine Atelier Collections
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="text-light-on-surface hover:text-light-primary p-1"
              >
                <MaterialIcon name="close" size="1.2em" />
              </button>
            </div>

            {/* Occasion Categories */}
            <div className="flex flex-col gap-2 mb-6">
              <span className="font-label text-label-sm uppercase text-light-primary tracking-wider">
                Occasion Category
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.slug)}
                    className={`text-left px-3 py-2 rounded-sm text-body-md transition-colors flex items-center justify-between ${
                      activeCategory === cat.slug
                        ? "bg-light-primary text-light-on-primary font-bold"
                        : "hover:bg-light-primary-container text-light-on-surface"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <MaterialIcon name={cat.icon} size="1em" />
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max Slider */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex justify-between items-center text-label-sm font-label">
                <span>Maximum Price</span>
                <span className="text-light-primary font-bold tabular-nums">
                  Up to ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="2500"
                max="7500"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-light-primary cursor-pointer"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex flex-col gap-2 mb-4">
              <span className="font-label text-label-sm uppercase text-light-primary tracking-wider">
                Sort Order
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-md border border-light-outline-variant bg-light-surface-container-low px-3 py-2 text-body-md text-light-on-surface"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated (★ 5.0)</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>

            {/* In-Stock Filter */}
            <label className="flex items-center justify-between py-2 cursor-pointer border-t border-light-outline-variant/60">
              <span className="font-body text-body-md text-light-on-surface">
                In-Stock Hampers Only
              </span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded border-light-outline text-light-primary focus:ring-light-primary"
              />
            </label>

            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full mt-4 py-2.5 rounded-full border border-light-primary text-light-primary font-label text-label-sm hover:bg-light-primary-container transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-36 flex flex-col gap-6">
            {/* Search Input */}
            <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-4 shadow-xs">
              <label
                htmlFor="sidebar-search"
                className="font-label text-label-sm uppercase text-light-primary block mb-2 tracking-wider"
              >
                Search Hamper Editions
              </label>
              <div className="relative flex items-center">
                <MaterialIcon
                  name="search"
                  className="absolute left-3 text-light-outline"
                  size="1.1em"
                />
                <input
                  id="sidebar-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Kashmiri, Truffles, Coffee..."
                  className="w-full rounded-full border border-light-outline-variant bg-light-surface-container-low pl-9 pr-8 py-2 font-body text-body-sm text-light-on-surface placeholder:text-light-outline focus:border-light-primary focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 text-light-outline hover:text-light-primary"
                  >
                    <MaterialIcon name="close" size="0.9em" />
                  </button>
                )}
              </div>
            </div>

            {/* Occasion Categories */}
            <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-5 shadow-xs flex flex-col gap-3">
              <h3 className="font-title text-title-md text-light-on-surface border-b border-light-outline-variant/60 pb-2">
                Occasion Categories
              </h3>
              <nav aria-label="Occasion list" className="flex flex-col gap-1">
                {CATEGORIES.map((cat) => {
                  const isSelected = activeCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-sm text-body-md transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-light-primary text-light-on-primary font-bold shadow-xs"
                          : "text-light-on-surface hover:bg-light-primary-container hover:text-light-primary"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <MaterialIcon
                          name={cat.icon}
                          size="1em"
                          className={isSelected ? "text-light-on-primary" : "text-light-primary"}
                        />
                        <span className="truncate">{cat.name}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Price Filter Slider */}
            <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-5 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-title text-title-md text-light-on-surface">
                  Filter by Price
                </h3>
                <span className="font-label text-label-sm text-light-primary tabular-nums font-bold">
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="2500"
                max="7500"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-light-primary cursor-pointer"
              />
              <div className="flex justify-between text-body-sm text-light-on-surface-variant tabular-nums">
                <span>₹2,500</span>
                <span>₹7,500</span>
              </div>
            </div>

            {/* Sort & In-Stock */}
            <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-5 shadow-xs flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="sidebar-sort"
                  className="font-title text-title-md text-light-on-surface"
                >
                  Sort Curations
                </label>
                <select
                  id="sidebar-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-md border border-light-outline-variant bg-light-surface-container-low px-3 py-2 font-body text-body-sm text-light-on-surface"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated (★ 5.0)</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-light-outline-variant/60">
                <span className="font-body text-body-sm text-light-on-surface">
                  In-Stock Hampers Only
                </span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-light-outline text-light-primary focus:ring-light-primary"
                />
              </label>

              {(activeCategory !== "all" ||
                activeEmotion !== "all" ||
                searchQuery ||
                maxPrice < 7500 ||
                inStockOnly) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full py-2 rounded-full border border-light-outline text-light-primary font-label text-label-sm hover:bg-light-primary-container transition-colors"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            {/* Atelier Concierge Note */}
            <div className="rounded-md bg-light-surface-container-low border border-light-outline-variant p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-light-primary font-title text-title-md">
                <MaterialIcon name="verified" size="1.2em" />
                <span>Bespoke Concierge</span>
              </div>
              <p className="font-body text-body-sm text-light-on-surface-variant">
                Need 20+ hampers for a wedding or corporate celebration? Connect directly with our Mumbai design studio.
              </p>
              <a
                href="#top"
                className="font-label text-label-sm text-light-primary underline pt-1"
              >
                Inquire With Concierge →
              </a>
            </div>
          </aside>

          {/* Right: Asymmetric Editorial Gallery Grid */}
          <div className="lg:col-span-9 flex flex-col gap-8">
            {/* Top Results Headline Strip */}
            <div className="flex items-baseline justify-between pb-4 border-b border-light-outline-variant gap-4">
              <div>
                <span className="font-mono text-mono-sm uppercase text-light-primary">
                  {CATEGORIES.find((c) => c.slug === activeCategory)?.editorialSubtitle ||
                    "Curated Hampers"}
                </span>
                <h2 className="font-headline text-headline-md text-light-on-surface">
                  {activeCategory === "all"
                    ? "Handcrafted Keepsakes"
                    : CATEGORIES.find((c) => c.slug === activeCategory)?.name}
                </h2>
              </div>

              <span className="font-body text-body-sm text-light-on-surface-variant shrink-0 tabular-nums">
                Showing {filteredProducts.length} of {SAMPLE_PRODUCTS.length} Edits
              </span>
            </div>

            {/* Asymmetric Editorial Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                {filteredProducts.map((product, index) => {
                  const variant =
                    index === 0
                      ? "portrait-tall"
                      : index === 3
                      ? "landscape-wide"
                      : "standard";

                  return (
                    <EditorialProductCard
                      key={product.id}
                      product={product}
                      layoutVariant={variant}
                      onQuickView={setQuickViewProduct}
                      onAddToBag={handleAddToBag}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlistIds.has(product.id)}
                    />
                  );
                })}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="rounded-xl border border-dashed border-light-outline-variant bg-light-surface-container-lowest p-12 text-center flex flex-col items-center gap-4 my-8">
                <div className="h-16 w-16 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center">
                  <MaterialIcon name="redeem" size="1.8em" />
                </div>
                <h3 className="font-headline text-headline-sm text-light-on-surface">
                  No Hampers Match This Selection
                </h3>
                <p className="font-body text-body-md text-light-on-surface-variant max-w-md">
                  We could not find any hamper editions matching your search query or filter thresholds. Reset your filters to browse the full atelier collection.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-light-primary text-light-on-primary px-6 py-2.5 font-label text-label-md hover:bg-burgundy/90 transition-colors shadow-sm"
                >
                  <MaterialIcon name="auto_awesome" size="1em" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

            {/* Sample Catalog Disclosure Banner */}
            <div className="rounded-lg bg-light-surface-container-low border border-light-outline-variant p-5 text-center mt-6">
              <span className="font-mono text-mono-sm text-light-primary uppercase tracking-wider block mb-1">
                Atelier Portfolio Note
              </span>
              <p className="font-body text-body-sm text-light-on-surface-variant max-w-2xl mx-auto">
                All hamper editions presented above are demonstration sample curations designed for BLISS BASKET. Custom packaging, corporate monogramming, and bespoke contents can be customized upon request with our atelier team.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 6. Quick View Modal Overlay */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToBag={handleAddToBag}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.has(quickViewProduct.id) : false}
      />

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-light-surface text-light-primary">
          <div className="flex flex-col items-center gap-3">
            <span className="font-headline text-headline-md tracking-wider animate-pulse">
              BLISS BASKET
            </span>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Preparing the Atelier Catalogue...
            </span>
          </div>
        </div>
      }
    >
      <CatalogueContent />
    </Suspense>
  );
}
