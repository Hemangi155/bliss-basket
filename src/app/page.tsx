import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OccasionsSection from "@/components/OccasionsSection";
import BestsellersSection from "@/components/BestsellersSection";
import PersonalizedSection from "@/components/PersonalizedSection";
import BuildHamperSection from "@/components/BuildHamperSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import GallerySection from "@/components/GallerySection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-[1024px] flex flex-col">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Premium Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main id="top" className="flex-1">
        {/* 3. Large Editorial Hero Section */}
        <HeroSection />

        {/* 4. Shop by Occasion Section */}
        <OccasionsSection />

        {/* 5. Bestselling Hampers Product Grid */}
        <BestsellersSection />

        {/* 6. Exclusive Personalized Gifting Section */}
        <PersonalizedSection />

        {/* 7. Build Your Own Hamper Promotional Section */}
        <BuildHamperSection />

        {/* 8. Customer Testimonials & Ratings */}
        <TestimonialsSection />

        {/* 9. Instagram-Inspired Gallery */}
        <GallerySection />

        {/* 10. Newsletter Subscription Section */}
        <NewsletterSection />
      </main>

      {/* 11. Premium Footer */}
      <Footer />
    </div>
  );
}
