import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "./MaterialIcon";

const features = [
  {
    icon: "font_download",
    title: "Gold Foil Initials",
    desc: "Embossed on box lid",
  },
  {
    icon: "verified",
    title: "Brass Wax Seal",
    desc: "Burgundy or gold crest",
  },
  {
    icon: "history_edu",
    title: "Calligraphy Card",
    desc: "Your heartfelt message",
  },
];

export default function PersonalizedSection() {
  return (
    <section
      id="personalized"
      className="bg-light-primary-container py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-6">
          {/* aspect-[4/3] on wrapper; fill Image inside */}
          <div className="relative rounded-lg overflow-hidden border border-light-outline-variant shadow-md bg-light-surface-container-lowest aspect-[4/3]">
            <Image
              src="/images/personalized.jpg"
              alt="Gold foil monogrammed ivory gift box with burgundy wax seal and calligraphy note"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col items-start gap-6">
          <span
            className="font-label text-label-sm uppercase text-light-on-primary-container"
            data-design-text-token="label-sm"
          >
            Bespoke Atelier Touches
          </span>
          <h2
            className="font-headline text-display-md-mobile lg:text-display-md text-light-on-surface text-balance"
            data-design-text-token="display-md"
          >
            Personalized to Their Name, Sealed with Care.
          </h2>
          <p
            className="font-body text-body-lg text-light-on-surface-variant max-w-prose text-pretty"
            data-design-text-token="body-lg"
          >
            Elevate every keepsake box with gold-foil monogramming, custom
            burgundy wax seals, and handwritten cotton-paper notes crafted by
            our Mumbai studio calligraphers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-2">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-md bg-light-surface-container-lowest p-4 border border-light-outline-variant flex flex-col gap-1.5"
              >
                <MaterialIcon
                  name={item.icon}
                  className="text-light-primary"
                />
                <span
                  className="font-title text-title-md text-light-on-surface"
                  data-design-text-token="title-md"
                >
                  {item.title}
                </span>
                <span
                  className="font-body text-body-md text-light-on-surface-variant"
                  data-design-text-token="body-md"
                >
                  {item.desc}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/products?category=personalized-hampers"
            data-component-id="button-primary"
            data-component-type="button"
            data-component-variant="primary"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-light-primary text-light-on-primary px-7 py-3.5 shadow-sm transition-colors duration-state-change ease-state-change hover:bg-burgundy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2"
          >
            <span
              className="font-label text-label-lg"
              data-design-text-token="label-lg"
            >
              Explore Personalized Gifts
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
