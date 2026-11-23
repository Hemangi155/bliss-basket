import Link from "next/link";
import MaterialIcon from "./MaterialIcon";

export default function Footer() {
  return (
    <footer className="bg-light-on-surface text-light-surface pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-light-surface/15">
        {/* Brand Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Link href="/" className="flex flex-col">
            <span
              className="font-headline text-headline-md text-light-surface"
              data-design-text-token="headline-md"
            >
              BLISS BASKET
            </span>
            <span
              className="font-label text-label-sm text-champagne-gold"
              data-design-text-token="label-sm"
            >
              Gifts That Feel Like Happiness.
            </span>
          </Link>
          <p
            className="font-body text-body-md text-light-surface/80 max-w-sm text-pretty"
            data-design-text-token="body-md"
          >
            Handcrafted luxury gift hampers celebrating Indian warmth, artisanal craft, and thoughtful moments—delivered across 19,000+ PIN codes.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="#top"
              aria-label="Instagram"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-light-surface/25 text-light-surface hover:border-champagne-gold hover:text-champagne-gold transition-colors"
            >
              <MaterialIcon name="photo_camera" className="text-title-md" />
            </a>
            <a
              href="#top"
              aria-label="WhatsApp Concierge"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-light-surface/25 text-light-surface hover:border-champagne-gold hover:text-champagne-gold transition-colors"
            >
              <MaterialIcon name="chat" className="text-title-md" />
            </a>
            <a
              href="#top"
              aria-label="Email Us"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-light-surface/25 text-light-surface hover:border-champagne-gold hover:text-champagne-gold transition-colors"
            >
              <MaterialIcon name="mail" className="text-title-md" />
            </a>
          </div>
        </div>

        {/* Shop & Occasions */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h3
            className="font-title text-title-md text-champagne-gold"
            data-design-text-token="title-md"
          >
            Curations
          </h3>
          <ul className="flex flex-col gap-2.5 font-body text-body-md text-light-surface/80">
            <li>
              <Link href="/products" className="hover:text-light-surface transition-colors">
                Bestselling Hampers
              </Link>
            </li>
            <li>
              <Link href="/#build-your-hamper" className="hover:text-light-surface transition-colors">
                Build Your Hamper
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=wedding-hampers"
                className="hover:text-light-surface transition-colors"
              >
                Wedding &amp; Trousseau
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=corporate-gifts"
                className="hover:text-light-surface transition-colors"
              >
                Corporate Gifting
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=personalized-hampers"
                className="hover:text-light-surface transition-colors"
              >
                Personalized Boxes
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies & Support */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <h3
            className="font-title text-title-md text-champagne-gold"
            data-design-text-token="title-md"
          >
            Customer Care &amp; Policies
          </h3>
          <ul className="flex flex-col gap-2.5 font-body text-body-md text-light-surface/80">
            <li>
              <a href="#top" className="hover:text-light-surface transition-colors">
                Track Your Order
              </a>
            </li>
            <li>
              <a href="#top" className="hover:text-light-surface transition-colors">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="#top" className="hover:text-light-surface transition-colors">
                Return &amp; Refund Policy
              </a>
            </li>
            <li>
              <a href="#top" className="hover:text-light-surface transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#top" className="hover:text-light-surface transition-colors">
                Terms &amp; Conditions
              </a>
            </li>
            <li>
              <a href="#top" className="hover:text-light-surface transition-colors">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <h3
            className="font-title text-title-md text-champagne-gold"
            data-design-text-token="title-md"
          >
            Gifting Concierge
          </h3>
          <div className="flex flex-col gap-2.5 font-body text-body-md text-light-surface/80">
            <p className="flex items-start gap-2">
              <MaterialIcon
                name="location_on"
                className="text-title-md text-champagne-gold shrink-0 mt-0.5"
              />
              <span>14, Rope Walk Lane, Kala Ghoda, Fort, Mumbai 400001</span>
            </p>
            <p className="flex items-center gap-2">
              <MaterialIcon
                name="call"
                className="text-title-md text-champagne-gold shrink-0"
              />
              <span className="tabular-nums">+91 22 4890 2100</span>
            </p>
            <p className="flex items-center gap-2">
              <MaterialIcon
                name="mail"
                className="text-title-md text-champagne-gold shrink-0"
              />
              <span>concierge@blissbasket.in</span>
            </p>
            <p className="font-label text-label-sm text-light-surface/60 pt-1">
              Mon – Sat · 10:00 AM – 7:30 PM IST
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-body-md text-light-surface/60">
        <p>© 2026 Bliss Basket Luxury Gifting Pvt. Ltd. All rights reserved.</p>
        <p>Payments: UPI · Cards · Net Banking · Wallets</p>
      </div>
    </footer>
  );
}
