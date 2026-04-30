import Navbar from "@/components/landing/Navbar";
import AboutMissionSection from "@/components/landing/AboutMissionSection";
import PremiumFooter from "@/components/landing/PremiumFooter";
import PhotographerWordmarkSection from "@/components/landing/PhotographerWordmarkSection";
import {
  StaticPageHero,
  StaticPageHighlights,
  StaticPageCallout,
} from "@/components/landing/StaticPageSections";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div>
        <Navbar />
        <AboutMissionSection />
        <main className="pb-6">
          
          <StaticPageHero
            eyebrow="About"
            title="Building smarter photo experiences for every event"
            description="Kwikpic helps hosts, guests, and photographers discover and deliver memories with fast AI face matching and private sharing."
            primaryHref="/register"
            primaryLabel="Join Now"
            secondaryHref="/services"
            secondaryLabel="View Services"
          />
          <StaticPageHighlights
            heading="What defines us"
            items={[
              {
                title: "Privacy First",
                description:
                  "Each guest gets only their matched photos with secure access controls.",
              },
              {
                title: "Production Ready",
                description:
                  "Built for high-volume events and events with reliable workflows.",
              },
              {
                title: "Elegant Experience",
                description:
                  "Clean premium UI for hosts and guests across desktop and mobile.",
              },
            ]}
          />
          
          <StaticPageCallout
            title="Let us power your next event album"
            description="From onboarding to delivery, we keep your photo workflow smooth, fast, and professional."
            ctaHref="/contact"
            ctaLabel="Talk To Team"
          />
        </main>
        <PremiumFooter />
        <PhotographerWordmarkSection />
      </div>
    </div>
  );
}
