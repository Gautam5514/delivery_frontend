import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import PremiumFooter from "@/components/landing/PremiumFooter";
import PhotographerWordmarkSection from "@/components/landing/PhotographerWordmarkSection";
import { ArrowLeft, ArrowRight, CheckCircle2, Image as ImageIcon, Mail, QrCode } from "lucide-react";
import { eventServices, serviceWorkflow } from "../serviceData";
import { buildMetadata } from "../../seo.config";

export function generateStaticParams() {
  return eventServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = eventServices.find((item) => item.slug === slug);
  if (!service) {
    return buildMetadata({
      title: "Event Photo Delivery Services",
      description: "FaceDeliver event photo delivery services.",
      path: "/services",
    });
  }
  return buildMetadata({
    title: `${service.title} Photo Delivery – AI Face Matching`,
    description: service.description,
    path: `/services/${service.slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailsPage({ params }) {
  const { slug } = await params;
  const service = eventServices.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <main>
        <section className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
            <div className="flex flex-col justify-center">
              <Link
                href="/services"
                className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 transition hover:text-zinc-950"
              >
                <ArrowLeft className="h-4 w-4" />
                All Services
              </Link>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
                {service.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
                {service.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/admin"
                  className="rounded bg-zinc-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black"
                >
                  Create Event
                </Link>
                <Link
                  href="/contact"
                  className="rounded border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-900 transition hover:bg-zinc-100"
                >
                  Talk To Team
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_0.68fr]">
              <div className="relative min-h-[430px] overflow-hidden rounded-xl bg-zinc-900">
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                    {service.shortText}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">{service.title}</p>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="relative min-h-[205px] overflow-hidden rounded-xl bg-zinc-900">
                  <img
                    src={service.accentImage}
                    alt={`${service.title} gallery`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/24" />
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Best For
                  </p>
                  <div className="mt-5 grid gap-3">
                    {service.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-zinc-900" />
                        <span className="text-sm font-medium text-zinc-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            <FeatureCard
              icon={QrCode}
              title="QR registration"
              text="Guests scan once, submit their details, and join the event gallery flow."
            />
            <FeatureCard
              icon={ImageIcon}
              title="AI matching"
              text="Uploaded event photos are matched against registered guests automatically."
            />
            <FeatureCard
              icon={Mail}
              title="Private delivery"
              text="Guests get notified and open a private gallery with their matched photos."
            />
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 rounded-xl border border-zinc-200 bg-zinc-950 p-7 text-white sm:p-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Delivery Flow
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Built for fast event turnaround.
              </h2>
              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white"
              >
                Explore all services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {serviceWorkflow.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-zinc-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PremiumFooter />
      <PhotographerWordmarkSection />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-7 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{text}</p>
    </article>
  );
}
