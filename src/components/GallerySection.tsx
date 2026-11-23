"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import MaterialIcon from "./MaterialIcon";

const galleryImages = [
  {
    src: "/images/gallery-1.jpg",
    alt: "Hands tying a burgundy silk ribbon on an ivory Bliss Basket box",
  },
  {
    src: "/images/gallery-2.jpg",
    alt: "Romantic wedding venue garden with floral arrangements and outdoor décor",
  },
  {
    src: "/images/gallery-3.jpg",
    alt: "Open gift hamper with lit soy candle and thank you note",
  },
  {
    src: "/images/gallery-4.jpg",
    alt: "Curated corporate Diwali hampers ready for dispatch",
  },
];

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  /** Lock body scroll and wire Escape key while lightbox is open */
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, closeLightbox]);

  return (
    <section className="bg-light-surface py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span
              className="font-label text-label-sm uppercase text-light-primary"
              data-design-text-token="label-sm"
            >
              @blissbasket.in
            </span>
            <h2
              className="font-headline text-headline-lg-mobile lg:text-headline-lg text-light-on-surface"
              data-design-text-token="headline-lg"
            >
              Moments Unboxed
            </h2>
          </div>
          <p
            className="font-body text-body-md text-light-on-surface-variant"
            data-design-text-token="body-md"
          >
            Share your celebrations with #GiftsThatFeelLikeHappiness
          </p>
        </div>

        {/* Gallery grid — each image is a button that opens the lightbox */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              aria-label={`View photo: ${img.alt}`}
              className="rounded-md overflow-hidden border border-light-outline-variant bg-light-surface-container-low group cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-surface-enter group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(41,35,41,0.92)" }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close image viewer"
            className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-light-surface text-light-on-surface shadow-md hover:bg-light-primary-container hover:text-light-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary"
          >
            <MaterialIcon name="close" className="text-title-lg" />
          </button>

          {/* Image — stop click bubbling so clicking the image doesn't close */}
          <div
            className="relative w-full max-w-3xl max-h-[85vh] aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>

          {/* Caption */}
          <p className="absolute bottom-6 left-0 right-0 text-center font-body text-body-md text-white/80 px-8 pointer-events-none">
            {galleryImages[lightboxIndex].alt}
          </p>
        </div>
      )}
    </section>
  );
}
