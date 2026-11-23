"use client";

import MaterialIcon from "../MaterialIcon";
import { Category } from "@/data/products";

interface ProductFiltersProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  onResetFilters: () => void;
  categoryCounts: Record<string, number>;
}

export default function ProductFilters({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  inStockOnly,
  onToggleInStock,
  onResetFilters,
  categoryCounts,
}: ProductFiltersProps) {
  const hasActiveFilters =
    activeCategory !== "all" || searchQuery.trim() !== "" || inStockOnly;

  return (
    <aside className="flex flex-col gap-6">
      {/* Search Input Box */}
      <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-4 shadow-xs">
        <label
          htmlFor="catalog-search"
          className="font-label text-label-sm uppercase text-light-primary block mb-2"
        >
          Search Hampers
        </label>
        <div className="relative flex items-center">
          <MaterialIcon
            name="search"
            className="absolute left-3.5 text-light-outline"
            size="1.1em"
          />
          <input
            id="catalog-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search treats, occasions, teas..."
            className="w-full rounded-full border border-light-outline-variant bg-light-surface-container-low pl-10 pr-9 py-2.5 font-body text-body-md text-light-on-surface placeholder:text-light-outline focus:border-light-primary focus:outline-none focus:ring-1 focus:ring-light-primary"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
              className="absolute right-3 text-light-outline hover:text-light-primary"
            >
              <MaterialIcon name="close" size="1em" />
            </button>
          )}
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-light-outline-variant/60">
          <h3 className="font-title text-title-md text-light-on-surface">
            Hamper Categories
          </h3>
          <span className="font-label text-label-sm text-light-on-surface-variant">
            {categories.length - 1} Edits
          </span>
        </div>

        <nav aria-label="Hamper categories" className="flex flex-col gap-1.5">
          {categories.map((cat) => {
            const count = categoryCounts[cat.slug] ?? 0;
            const isSelected = activeCategory === cat.slug;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full text-left px-3 py-2.5 rounded-sm transition-all duration-state-change flex items-center justify-between gap-3 text-body-md ${
                  isSelected
                    ? "bg-light-primary text-light-on-primary font-bold shadow-xs"
                    : "text-light-on-surface hover:bg-light-primary-container hover:text-light-primary"
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <MaterialIcon
                    name={cat.icon}
                    size="1.1em"
                    className={
                      isSelected
                        ? "text-light-on-primary"
                        : "text-light-primary"
                    }
                  />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span
                  className={`text-label-sm tabular-nums px-2 py-0.5 rounded-full text-[11px] ${
                    isSelected
                      ? "bg-light-on-primary/20 text-light-on-primary"
                      : "bg-light-surface-container-low text-light-on-surface-variant"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sorting & Availability Filter */}
      <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="catalog-sort"
            className="font-title text-title-md text-light-on-surface"
          >
            Sort Curations
          </label>
          <select
            id="catalog-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full rounded-md border border-light-outline-variant bg-light-surface-container-low px-3 py-2.5 font-body text-body-md text-light-on-surface focus:border-light-primary focus:outline-none focus:ring-1 focus:ring-light-primary"
          >
            <option value="featured">Featured Curations</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated (★ 5.0)</option>
            <option value="reviews">Most Reviewed</option>
          </select>
        </div>

        {/* Availability Toggle */}
        <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-light-outline-variant/60">
          <span className="font-body text-body-md text-light-on-surface">
            In-Stock Hampers Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="h-4 w-4 rounded border-light-outline text-light-primary focus:ring-light-primary"
          />
        </label>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full mt-2 py-2 px-3 rounded-full border border-light-outline text-light-primary font-label text-label-sm hover:bg-light-primary-container transition-colors text-center"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Atelier Guarantee Card */}
      <div className="rounded-md bg-light-surface-container-low border border-light-outline-variant p-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-light-primary font-title text-title-md">
          <MaterialIcon name="verified" size="1.2em" />
          <span>The Atelier Guarantee</span>
        </div>
        <p className="font-body text-body-sm text-light-on-surface-variant">
          Hand-tied satin ribbons, handwritten cotton rag cards, and temperature-controlled transit across India.
        </p>
      </div>
    </aside>
  );
}
