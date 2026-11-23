import MaterialIcon from "./MaterialIcon";

const testimonials = [
  {
    quote:
      '"The Royal Festive Box arrived wrapped in burgundy satin with a handwritten note. My parents in Pune were genuinely moved by the presentation."',
    author: "Ananya Deshmukh",
    city: "Mumbai",
  },
  {
    quote:
      '"We ordered 65 bespoke wedding welcome hampers using the builder. Every box had our monogram in gold foil and arrived on schedule in Udaipur."',
    author: "Rohan & Meera",
    city: "New Delhi",
  },
  {
    quote:
      '"The Self-Care Sanctuary hamper smells heavenly and the rosewater mist is my sister\'s new favourite. Bliss Basket never disappoints."',
    author: "Kavya Nair",
    city: "Bengaluru",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-light-surface-container-low py-16 lg:py-20 border-y border-light-outline-variant">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span
            className="font-label text-label-sm uppercase text-light-primary"
            data-design-text-token="label-sm"
          >
            Words of Warmth
          </span>
          <h2
            className="font-headline text-headline-lg-mobile lg:text-headline-lg text-light-on-surface"
            data-design-text-token="headline-lg"
          >
            Loved Across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {testimonials.map((item) => (
            <article
              key={item.author}
              data-component-id="card-elevated"
              data-component-type="card"
              data-component-variant="elevated"
              className="h-full rounded-md bg-light-surface-container-lowest border border-light-outline-variant p-6 shadow-sm flex flex-col justify-between gap-5"
            >
              <div className="flex flex-col gap-3">
                <div
                  className="flex items-center gap-1 text-champagne-gold"
                  aria-label="5 out of 5 stars"
                >
                  {[...Array(5)].map((_, i) => (
                    <MaterialIcon
                      key={i}
                      name="star"
                      className="text-title-md"
                      filled
                    />
                  ))}
                </div>
                <p
                  className="font-body text-body-md text-light-on-surface-variant text-pretty"
                  data-design-text-token="body-md"
                >
                  {item.quote}
                </p>
              </div>
              <header className="flex items-center justify-between gap-4 pt-3 border-t border-light-outline-variant">
                <h3
                  className="font-headline text-headline-sm text-light-on-surface"
                  data-design-text-token="headline-sm"
                >
                  {item.author}
                </h3>
                <p
                  className="font-label text-label-sm text-light-on-surface-variant"
                  data-design-text-token="label-sm"
                >
                  {item.city}
                </p>
              </header>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
