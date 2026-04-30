"use client";

import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AudienceSolutionsSection from "./AudienceSolutionsSection";

// Below-fold sections — code-split and lazy-loaded
const CommunityGallerySection = dynamic(() => import("./CommunityGallerySection"));
const AdvancedShowcaseSection = dynamic(() => import("./AdvancedShowcaseSection"));
const WhyChooseUsSection = dynamic(() => import("./WhyChooseUsSection"));
const HowItWorksSection = dynamic(() => import("./HowItWorksSection"));
const TestimonialsSection = dynamic(() => import("./TestimonialsSection"));
const FaqSection = dynamic(() => import("./FaqSection"));
const FinalCtaSection = dynamic(() => import("./FinalCtaSection"));
const PremiumFooter = dynamic(() => import("./PremiumFooter"));
const PhotographerWordmarkSection = dynamic(() => import("./PhotographerWordmarkSection"));

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-200">
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 h-[800px] w-[800px] rounded-full bg-zinc-200/70 blur-[120px]" />
        <div className="absolute top-[60%] right-[-10%] h-[600px] w-[600px] rounded-full bg-zinc-300/60 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <AudienceSolutionsSection />
          <CommunityGallerySection />
          <AdvancedShowcaseSection />
          <WhyChooseUsSection />
          <HowItWorksSection />
          {/* <FeaturesSection /> */}
          <TestimonialsSection />
          <FaqSection />
          <FinalCtaSection />
        </main>
        <PremiumFooter />
        <PhotographerWordmarkSection />
      </div>
    </div>
  );
}
