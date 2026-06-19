import Navbar from "@/components/landing/Navbar";
import PremiumFooter from "@/components/landing/PremiumFooter";
import PhotographerWordmarkSection from "@/components/landing/PhotographerWordmarkSection";
import {
  StaticPageHero,
  StaticPageHighlights,
  StaticPageCallout,
} from "@/components/landing/StaticPageSections";
import { buildMetadata } from "../seo.config";

export const metadata = buildMetadata({
  title: "How It Works – AI Face Matching & QR Photo Delivery",
  description:
    "See how FaceDeliver works: upload event photos, guests scan a QR code and upload a selfie, and AI face recognition delivers each guest their own photos in seconds.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div>
        <Navbar />
        <main className="pb-6">
          <StaticPageHero
            eyebrow="How It Works"
            title="From selfie registration to a personal event gallery"
            description="FaceDeliver turns a large event photo collection into a clean guest experience. Register once, match fast, and deliver private galleries without manual sorting."
            primaryHref="/register"
            primaryLabel="Try Registration"
            secondaryHref="/about"
            secondaryLabel="About FaceDeliver"
          />

          <StaticPageHighlights
            heading="The full workflow"
            items={[
              {
                title: "1. Guest Registration",
                description:
                  "Guests scan a QR code or open a link, enter their details, and upload or capture a selfie in a mobile-friendly flow.",
              },
              {
                title: "2. Photo Processing",
                description:
                  "Admins upload event photos in bulk. FaceDeliver indexes them and prepares them for fast face-matching operations.",
              },
              {
                title: "3. Private Delivery",
                description:
                  "Each guest receives only their matched images in a clean personal gallery, ready for download and sharing.",
              },
            ]}
          />

          <section className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Why Teams Like It
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                  Less manual sorting. Better guest satisfaction.
                </h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "Fast onboarding for large events",
                    "Cleaner handoff for photographers",
                    "Private galleries for each guest",
                    "Premium experience on mobile and desktop",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-zinc-200 bg-white p-5 text-zinc-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Best Fit
                </p>
                <div className="mt-6 space-y-5">
                  {[
                    {
                      title: "Events",
                      description:
                        "Personal guest delivery for high-volume celebration albums.",
                    },
                    {
                      title: "Private Events",
                      description:
                        "A polished guest-facing flow for premium hosted experiences.",
                    },
                    {
                      title: "Photo Teams",
                      description:
                        "Useful for photographers who want faster, cleaner album distribution.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl bg-zinc-50 p-5">
                      <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
                      <p className="mt-2 leading-7 text-zinc-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <StaticPageCallout
            title="Want to see the workflow on a live event?"
            description="Create an admin account, set up an event, and test the full registration-to-gallery experience."
            ctaHref="/login"
            ctaLabel="Get Started"
          />
        </main>
        <PremiumFooter />
        <PhotographerWordmarkSection />
      </div>
    </div>
  );
}
