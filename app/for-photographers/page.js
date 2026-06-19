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
  title: "FaceDeliver for Photographers – Automated Client Photo Delivery",
  description:
    "Stop sorting photos manually. FaceDeliver's AI face recognition delivers galleries to every client and guest automatically, so photographers save hours per event.",
  path: "/for-photographers",
});

export default function ForPhotographersPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div>
        <Navbar />
        <main className="pb-6">
          <StaticPageHero
            eyebrow="For Photographers"
            title="A cleaner delivery workflow for modern event teams"
            description="Photographers and studios can use FaceDeliver to reduce album chaos, speed up guest delivery, and offer a more premium service after the event."
            primaryHref="/services"
            primaryLabel="View Services"
            secondaryHref="/contact"
            secondaryLabel="Request Demo"
          />

          <StaticPageHighlights
            heading="Why photographers use FaceDeliver"
            items={[
              {
                title: "Post-Event Efficiency",
                description:
                  "Reduce the time spent manually organizing guest requests and sending images one by one.",
              },
              {
                title: "Premium Client Experience",
                description:
                  "Offer a branded, modern, high-end photo discovery flow to couples and event hosts.",
              },
              {
                title: "Operational Scale",
                description:
                  "Support large guest counts and big upload volumes with a cleaner backend process.",
              },
            ]}
          />

          <section className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Studios",
                  description:
                    "Run multiple events with more predictable delivery and fewer support requests.",
                },
                {
                  title: "Freelancers",
                  description:
                    "Add a polished AI delivery layer without building custom infrastructure.",
                },
                {
                  title: "Event Teams",
                  description:
                    "Coordinate guests, hosts, and albums in one system instead of scattered tools.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 p-7"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Use Case
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold text-zinc-900">{item.title}</h2>
                  <p className="mt-3 leading-7 text-zinc-600">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <StaticPageCallout
            title="Want to offer this as part of your event package?"
            description="Use FaceDeliver as a premium upsell for hosts who want a smoother and more personal photo delivery experience."
            ctaHref="/login"
            ctaLabel="Create Admin Account"
          />
        </main>
        <PremiumFooter />
        <PhotographerWordmarkSection />
      </div>
    </div>
  );
}
