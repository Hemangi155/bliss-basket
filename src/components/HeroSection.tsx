import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "./MaterialIcon";

export default function HeroSection() {
  return (
    <section className="bg-light-surface py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Hero Copy */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6">
          <span
            data-component-id="badge-eyebrow"
            data-component-type="badge"
            data-component-variant="status"
            role="status"
            className="inline-flex items-center gap-2 rounded-full bg-light-primary-container text-light-on-primary-container px-4 py-1.5"
          >
            <MaterialIcon
              name="auto_awesome"
              className="text-title-md text-light-primary"
            />
            <span
              className="font-label text-label-sm uppercase"
              data-design-text-token="label-sm"
            >
              Curated Luxury Gifting Atelier
            </span>
          </span>

          <h1
            data-component-id="typography-display"
            data-component-type="typography"
            data-component-variant="display"
            data-design-text-token="display-lg"
            className="font-display text-display-lg-mobile lg:text-display-lg text-light-on-surface text-balance"
          >
            Make Every Moment Unforgettable.
          </h1>

          <p
            data-component-id="typography-body"
            data-component-type="typography"
            data-component-variant="body"
            data-design-text-token="body-lg"
            className="font-body text-body-lg text-light-on-surface-variant max-w-prose text-pretty"
          >
            Thoughtfully curated gifts that turn ordinary moments into beautiful
            memories. Hand-packed in keepsake linen boxes with artisanal Indian
            delicacies, botanical skincare, and wax-sealed notes.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/products"
              data-component-id="button-primary"
              data-component-type="button"
              data-component-variant="primary"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-light-primary text-light-on-primary px-7 py-3.5 shadow-sm transition-colors duration-state-change ease-state-change hover:bg-burgundy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2"
            >
              <span
                className="font-label text-label-lg"
                data-design-text-token="label-lg"
              >
                Explore Hampers
              </span>
              <MaterialIcon name="arrow_forward" className="text-title-md" />
            </Link>

            <a
              href="#build-your-hamper"
              data-component-id="button-secondary"
              data-component-type="button"
              data-component-variant="secondary"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-light-primary bg-light-surface-container-lowest text-light-primary px-7 py-3.5 transition-colors duration-state-change ease-state-change hover:bg-light-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2"
            >
              <MaterialIcon name="redeem" className="text-title-md" />
              <span
                className="font-label text-label-lg"
                data-design-text-token="label-lg"
              >
                Build Your Own
              </span>
            </a>
          </div>

          {/* Trust Micro-Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-light-outline-variant w-full">
            <div className="flex items-center gap-2.5">
              <MaterialIcon name="schedule" className="text-light-primary" />
              <span
                className="font-body text-body-md text-light-on-surface-variant"
                data-design-text-token="body-md"
              >
                Same-day Mumbai &amp; Delhi NCR
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <MaterialIcon name="edit_note" className="text-light-primary" />
              <span
                className="font-body text-body-md text-light-on-surface-variant"
                data-design-text-token="body-md"
              >
                Handwritten Note Included
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <MaterialIcon
                name="star"
                className="text-champagne-gold"
                filled
              />
              <span
                className="font-body text-body-md text-light-on-surface-variant tabular-nums"
                data-design-text-token="body-md"
              >
                4.9/5 from 4,200+ Gifts
              </span>
            </div>
          </div>
        </div>

        {/* Hero Editorial Image */}
        <div className="lg:col-span-6">
          {/* aspect-[4/3] on the wrapper gives the fill image a defined height */}
          <div className="relative rounded-xl overflow-hidden bg-light-surface-container-low border border-light-outline-variant shadow-md aspect-[4/3]">
            <Image
              src="/images/hero.jpg"
              alt="Luxury ivory linen Bliss Basket gift hamper tied with a burgundy silk ribbon containing Belgian chocolates, rosewater mist, and brass candle"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-light-surface-container-lowest/95 border border-light-outline-variant rounded-md px-5 py-3.5 shadow-sm flex items-center gap-4">
              <MaterialIcon
                name="workspace_premium"
                className="text-light-primary text-headline-md"
              />
              <div className="flex flex-col">
                <span
                  className="font-title text-title-md text-light-on-surface"
                  data-design-text-token="title-md"
                >
                  Signature Keepsake Packaging
                </span>
                <span
                  className="font-body text-body-md text-light-on-surface-variant"
                  data-design-text-token="body-md"
                >
                  Handcrafted linen boxes &amp; satin ribbons
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
