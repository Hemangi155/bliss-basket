import Link from "next/link";
import MaterialIcon from "./MaterialIcon";

const occasions = [
  {
    icon: "cake",
    title: "Birthday",
    desc: "Joyful surprises",
    href: "/products?category=birthday-hampers",
  },
  {
    icon: "favorite",
    title: "Anniversary",
    desc: "Romantic keepsakes",
    href: "/products?category=anniversary-gifts",
  },
  {
    icon: "diamond",
    title: "Wedding",
    desc: "Trousseau & favours",
    href: "/products?category=wedding-hampers",
  },
  {
    icon: "celebration",
    title: "Festive",
    desc: "Diwali & Rakhi edits",
    href: "/products?category=festival-gifts",
  },
  {
    icon: "business_center",
    title: "Corporate",
    desc: "Client & team gifting",
    href: "/products?category=corporate-gifts",
  },
  {
    icon: "spa",
    title: "Just Because",
    desc: "Thoughtful gestures",
    href: "/products?category=self-care-hampers",
  },
];

export default function OccasionsSection() {
  return (
    <section
      id="occasions"
      className="bg-light-surface-container-low py-16 lg:py-20 border-y border-light-outline-variant"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span
              className="font-label text-label-sm uppercase text-light-primary"
              data-design-text-token="label-sm"
            >
              Celebrate Every Milestone
            </span>
            <h2
              className="font-headline text-headline-lg-mobile lg:text-headline-lg text-light-on-surface"
              data-design-text-token="headline-lg"
            >
              Shop by Occasion
            </h2>
          </div>
          <p
            className="font-body text-body-md text-light-on-surface-variant max-w-md"
            data-design-text-token="body-md"
          >
            From intimate birthdays to grand Indian weddings and executive
            milestones, discover hampers tailored to the moment.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 items-stretch">
          {occasions.map((occ) => (
            <Link
              key={occ.title}
              href={occ.href}
              data-component-id="card-interactive"
              data-component-type="card"
              data-component-variant="interactive"
              className="h-full rounded-md bg-light-surface-container-lowest border border-light-outline-variant p-5 transition-all duration-card-hover ease-card-hover hover:bg-light-primary-container hover:-translate-y-0.5 flex flex-col justify-between gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center">
                <MaterialIcon name={occ.icon} className="text-headline-md" />
              </div>
              <div className="flex flex-col gap-1">
                <h3
                  className="font-headline text-headline-sm text-light-on-surface"
                  data-design-text-token="headline-sm"
                >
                  {occ.title}
                </h3>
                <p
                  className="font-body text-body-md text-light-on-surface-variant"
                  data-design-text-token="body-md"
                >
                  {occ.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
