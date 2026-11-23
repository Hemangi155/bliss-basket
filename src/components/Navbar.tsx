"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MaterialIcon from "./MaterialIcon";
import { createClient } from "@/lib/supabase/client";
import { useCartWishlist } from "@/context/CartWishlistContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Occasions", href: "/#occasions" },
  { label: "Build Your Hamper", href: "/#build-your-hamper" },
  { label: "About Us", href: "/#personalized" },
];

/** Sections on the homepage that map to nav links */
const HASH_SECTIONS = ["occasions", "build-your-hamper", "personalized"] as const;
const SECTION_HREF: Record<string, string> = {
  occasions: "/#occasions",
  "build-your-hamper": "/#build-your-hamper",
  personalized: "/#personalized",
};

interface NavbarProps {
  bagCount?: number;
}

export default function Navbar({ bagCount: explicitBagCount }: NavbarProps) {
  const { cart, wishlistIds, openDrawer } = useCartWishlist();
  const currentBagCount = explicitBagCount !== undefined ? explicitBagCount : cart.totalCount;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const pathname = usePathname();

  /**
   * Monitor customer auth state for account links and badges
   */
  useEffect(() => {
    let isMounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    try {
      const supabase = createClient();

      supabase.auth
        .getUser()
        .then(({ data, error }) => {
          if (isMounted && !error && data?.user) {
            setIsAuthenticated(true);
          } else if (isMounted) {
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsAuthenticated(false);
          }
        });

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (isMounted) {
          setIsAuthenticated(Boolean(session?.user));
        }
      });

      if (data?.subscription) {
        authSubscription = data.subscription;
      }
    } catch {
      // Supabase initialization error: defaults to unauthenticated
    }

    return () => {
      isMounted = false;
      authSubscription?.unsubscribe();
    };
  }, []);

  /**
   * IntersectionObserver — tracks which homepage sections are scrolled
   * into the middle band of the viewport so the matching nav link highlights.
   * rootMargin: top -20% / bottom -65% = the section must occupy the top-ish
   * 15% of the viewport to be "active", preventing all sections firing at once.
   */
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              next.add(entry.target.id);
            } else {
              next.delete(entry.target.id);
            }
          });
          return next;
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );

    HASH_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  /**
   * Derive which nav href is currently "active":
   * — On non-home pages, use the pathname.
   * — On the homepage, use the first visible section (document order),
   *   or "/" if no section is intersecting (user is at the top).
   */
  const activeHref = (() => {
    if (pathname !== "/") return pathname;
    for (const id of HASH_SECTIONS) {
      if (visibleSections.has(id)) return SECTION_HREF[id];
    }
    return "/";
  })();

  const isLinkActive = (href: string): boolean => {
    if (href === "/") return pathname === "/" && activeHref === "/";
    if (!href.startsWith("/#")) return pathname.startsWith(href);
    return activeHref === href;
  };

  return (
    <header className="sticky top-0 z-40 bg-light-surface border-b border-light-outline-variant">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex flex-col shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary rounded-sm"
        >
          <span
            className="font-headline text-headline-md text-light-primary tracking-wide"
            data-design-text-token="headline-md"
          >
            BLISS BASKET
          </span>
          <span
            className="font-label text-label-sm text-light-on-surface-variant"
            data-design-text-token="label-sm"
          >
            Gifts That Feel Like Happiness.
          </span>
        </Link>

        {/* Primary Navigation — Desktop */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-8"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              data-design-text-token="label-lg"
              className={`font-label text-label-lg pb-1 transition-colors duration-state-change ease-state-change ${
                isLinkActive(link.href)
                  ? "text-light-primary border-b-2 border-light-primary"
                  : "text-light-on-surface hover:text-light-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Utility Icons */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle — hidden on desktop */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-light-surface-container-lowest text-light-on-surface border border-light-outline-variant transition-colors duration-state-change ease-state-change hover:bg-light-primary-container hover:text-light-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary"
          >
            <MaterialIcon
              name={mobileMenuOpen ? "close" : "menu"}
              className="text-title-lg"
            />
          </button>

          {/* Search — links to Products page (search + filter UX lives there) */}
          <Link
            href="/products"
            aria-label="Search hampers"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-light-surface-container-lowest text-light-on-surface border border-light-outline-variant transition-colors duration-state-change ease-state-change hover:bg-light-primary-container hover:text-light-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary"
          >
            <MaterialIcon name="search" className="text-title-lg" />
          </Link>

          {/* Account — links to /account if authenticated, /login if guest */}
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            aria-label={isAuthenticated ? "My Account (Active Session)" : "Sign In to Bliss Basket"}
            title={isAuthenticated ? "My Account" : "Sign In"}
            className="hidden sm:inline-flex relative h-10 w-10 items-center justify-center rounded-full bg-light-surface-container-lowest text-light-on-surface border border-light-outline-variant transition-colors duration-state-change ease-state-change hover:bg-light-primary-container hover:text-light-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary"
          >
            <MaterialIcon name="person" className="text-title-lg" />
            {isAuthenticated && (
              <span
                className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-light-primary border-2 border-white"
                aria-hidden="true"
              />
            )}
          </Link>

          {/* Wishlist — links to /wishlist */}
          <Link
            href="/wishlist"
            aria-label={`Wishlist with ${wishlistIds.size} saved items`}
            className="hidden sm:inline-flex relative h-10 w-10 items-center justify-center rounded-full bg-light-surface-container-lowest text-light-on-surface border border-light-outline-variant transition-colors duration-state-change ease-state-change hover:bg-light-primary-container hover:text-light-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary"
          >
            <MaterialIcon
              name="favorite"
              className="text-title-lg"
              filled={wishlistIds.size > 0}
            />
            {wishlistIds.size > 0 && (
              <span
                id="wishlist-count-badge"
                aria-hidden="true"
                className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne-gold text-dark-text px-1 text-[10px] font-bold font-label tabular-nums shadow-xs"
              >
                {wishlistIds.size}
              </span>
            )}
          </Link>

          {/* Shopping Bag with count badge & opens Drawer */}
          <button
            type="button"
            onClick={openDrawer}
            data-component-id="button-icon"
            data-component-type="button"
            data-component-variant="icon"
            aria-label={`Shopping bag with ${currentBagCount} items`}
            id="header-bag-btn"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-light-surface-container-lowest text-light-on-surface border border-light-outline-variant transition-colors duration-state-change ease-state-change hover:bg-light-primary-container hover:text-light-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary cursor-pointer"
          >
            <MaterialIcon name="shopping_bag" className="text-title-lg" />
            <span
              id="bag-count-badge"
              data-component-id="badge-numeric"
              data-component-type="badge"
              data-component-variant="numeric"
              aria-hidden="true"
              className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-light-primary text-light-on-primary px-1.5 tabular-nums shadow-xs"
            >
              <span
                className="font-label text-label-sm"
                data-design-text-token="label-sm"
              >
                {currentBagCount}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden border-t border-light-outline-variant bg-light-surface px-6 py-4"
        >
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block font-label text-label-lg py-2 transition-colors duration-state-change ${
                    isLinkActive(link.href)
                      ? "text-light-primary font-bold"
                      : "text-light-on-surface hover:text-light-primary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-light-outline-variant flex flex-col gap-2">
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between font-label text-label-lg py-2 text-light-on-surface hover:text-light-primary"
              >
                <span className="flex items-center gap-2">
                  <MaterialIcon name="favorite" size={20} filled={wishlistIds.size > 0} />
                  <span>My Wishlist</span>
                </span>
                {wishlistIds.size > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-champagne-gold text-dark-text text-xs font-bold tabular-nums">
                    {wishlistIds.size}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openDrawer();
                }}
                className="flex items-center justify-between font-label text-label-lg py-2 text-light-on-surface hover:text-light-primary text-left"
              >
                <span className="flex items-center gap-2">
                  <MaterialIcon name="shopping_bag" size={20} />
                  <span>Gift Bag</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-light-primary text-light-on-primary text-xs font-bold tabular-nums">
                  {currentBagCount}
                </span>
              </button>

              {isAuthenticated ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 font-label text-label-lg py-2 text-light-primary font-bold"
                >
                  <MaterialIcon name="person" size={20} />
                  <span>My Account</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 font-label text-label-lg py-2 text-light-primary font-bold"
                >
                  <MaterialIcon name="person" size={20} />
                  <span>Sign In / Register</span>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
