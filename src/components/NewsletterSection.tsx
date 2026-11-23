"use client";

import { useState, FormEvent } from "react";
import MaterialIcon from "./MaterialIcon";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setFeedback("Welcome to the Bliss Circle! Use code BLISS10 at checkout.");
  };

  return (
    <section className="bg-light-primary-container py-16">
      <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-6">
        <span
          className="font-label text-label-sm uppercase text-light-on-primary-container"
          data-design-text-token="label-sm"
        >
          The Bliss Circle
        </span>
        <h2
          className="font-headline text-headline-lg-mobile lg:text-headline-lg text-light-on-surface text-balance"
          data-design-text-token="headline-lg"
        >
          Receive Festive Previews &amp; 10% Off Your First Gift
        </h2>
        <p
          className="font-body text-body-md text-light-on-surface-variant max-w-prose"
          data-design-text-token="body-md"
        >
          Join 18,000+ thoughtful gifters across India for early access to Diwali, Rakhi, and limited-edition seasonal hampers.
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email Address
          </label>
          <div className="relative flex-1 flex items-center">
            <MaterialIcon
              name="mail"
              className="absolute left-4 text-light-outline"
            />
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full rounded-full border border-light-outline-variant bg-light-surface-container-lowest pl-11 pr-4 py-3.5 font-body text-body-md text-light-on-surface placeholder:text-light-outline focus:border-light-primary focus:outline-none focus:ring-1 focus:ring-light-primary"
            />
          </div>
          <button
            data-component-id="button-primary"
            data-component-type="button"
            data-component-variant="primary"
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-light-primary text-light-on-primary px-7 py-3.5 shadow-sm transition-colors duration-state-change ease-state-change hover:bg-burgundy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2 shrink-0"
          >
            <span
              className="font-label text-label-lg"
              data-design-text-token="label-lg"
            >
              Join the Circle
            </span>
          </button>
        </form>

        {feedback && (
          <p
            id="newsletter-feedback"
            className="font-body text-body-md text-light-primary font-bold"
            role="status"
          >
            {feedback}
          </p>
        )}
      </div>
    </section>
  );
}
