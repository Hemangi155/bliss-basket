import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "./MaterialIcon";

const steps = [
  { step: "STEP 1", title: "Choose Box" },
  { step: "STEP 2", title: "Add Treats" },
  { step: "STEP 3", title: "Pick Ribbon" },
  { step: "STEP 4", title: "Note & Date" },
];

export default function BuildHamperSection() {
  return (
    <section id="build-your-hamper" className="bg-light-surface py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 rounded-xl bg-light-surface-container-lowest border border-light-outline-variant p-8 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 flex flex-col items-start gap-6">
          <span
            data-component-id="badge-signature"
            data-component-type="badge"
            data-component-variant="status"
            className="inline-flex items-center gap-1.5 rounded-full bg-light-secondary-container text-light-on-secondary-container px-3.5 py-1"
          >
            <MaterialIcon name="palette" className="text-title-md" />
            <span
              className="font-label text-label-sm uppercase"
              data-design-text-token="label-sm"
            >
              Signature Experience
            </span>
          </span>

          <h2
            className="font-headline text-display-md-mobile lg:text-display-md text-light-on-surface text-balance"
            data-design-text-token="display-md"
          >
            Build Your Own Hamper
          </h2>
          <p
            className="font-body text-body-lg text-light-on-surface-variant max-w-prose text-pretty"
            data-design-text-token="body-lg"
          >
            Become the curator. Pick a keepsake box, hand-select artisanal
            chocolates, candles, skincare, and florals, choose your ribbon, and
            watch your bespoke hamper come together live.
          </p>

          {/* 4-Step Visual Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded bg-light-surface-container-low border border-light-outline-variant p-3.5 flex flex-col gap-1"
              >
                <span
                  className="font-mono text-mono-sm text-light-primary"
                  data-design-text-token="mono-sm"
                >
                  {item.step}
                </span>
                <span
                  className="font-title text-title-md text-light-on-surface"
                  data-design-text-token="title-md"
                >
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          {/* CTA — links to the products/shop page (build-your-hamper page is a future feature) */}
          <Link
            href="/products"
            data-component-id="button-with-icon"
            data-component-type="button"
            data-component-variant="with-icon"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-light-primary text-light-on-primary px-7 py-3.5 shadow-sm transition-colors duration-state-change ease-state-change hover:bg-burgundy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2"
          >
            <MaterialIcon name="redeem" className="text-title-md" />
            <span
              className="font-label text-label-lg"
              data-design-text-token="label-lg"
            >
              Start Building Your Hamper
            </span>
          </Link>
        </div>

        <div className="lg:col-span-6">
          {/* aspect-[4/3] on wrapper; fill Image inside */}
          <div className="relative rounded-lg overflow-hidden border border-light-outline-variant aspect-[4/3]">
            <Image
              src="/images/build-hamper.jpg"
              alt="Flatlay of keepsake gift boxes, satin ribbons, chocolates, botanical skincare, and dried florals"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
