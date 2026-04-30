import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import PremiumFooter from "@/components/landing/PremiumFooter";
import PhotographerWordmarkSection from "@/components/landing/PhotographerWordmarkSection";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { eventServices, serviceWorkflow } from "./serviceData";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <main>
        <section className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
            <div className="flex flex-col justify-center">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                <Sparkles className="h-4 w-4 text-zinc-800" />
                All Services
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
                Event photo delivery for every kind of crowd.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
                Explore ready-made workflows for weddings, schools, colleges, corporate
                events, birthdays, and community gatherings.
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
                  Request Demo
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {eventServices.slice(0, 4).map((service) => (
                <div
                  key={service.slug}
                  className="relative min-h-[190px] overflow-hidden rounded-xl border border-white bg-zinc-900"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-74"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-lg font-semibold text-white">{service.title}</p>
                    <p className="mt-1 text-sm text-white/72">{service.shortText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Event Types
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                  Choose the workflow that fits your event.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-zinc-600">
                Each service page includes a dedicated visual layout, use cases, and dummy
                content you can replace with final business copy later.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {eventServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md "
                >
                  <div className="relative h-56 overflow-hidden bg-zinc-900">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-900 backdrop-blur">
                      Service
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                      {service.description}
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-zinc-950">
                      View Details
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 rounded-xl border border-zinc-200 bg-zinc-950 p-7 text-white sm:p-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Workflow
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                One flow from registration to delivery.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {serviceWorkflow.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-white" />
                  <span className="text-sm font-medium text-zinc-200">{item}</span>
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
