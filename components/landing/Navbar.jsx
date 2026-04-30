"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { eventServices } from "@/app/services/serviceData";

export default function Navbar() {
  const [showOfferBanner, setShowOfferBanner] = useState(true);
  const headerOffsetClass = showOfferBanner ? "h-[112px]" : "h-[72px]";

  const offerText =
    "All-time 50% offer: Get 50% off on all plans and launch your event with premium QR photo delivery today.";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/80 bg-white/88 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        {showOfferBanner ? (
          <div className="border-b border-zinc-200 bg-zinc-950 text-white">
            <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4 py-2 sm:px-6 lg:px-8">
              <span className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">
                50% Offer
              </span>
              <div className="relative h-5 flex-1 overflow-hidden">
                <motion.div
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 16, ease: "linear", repeat: Infinity }}
                  className="absolute left-0 top-0 flex min-w-max items-center gap-8 whitespace-nowrap text-xs font-medium tracking-[0.12em] text-white/90"
                >
                  <span>{offerText}</span>
                  <span>{offerText}</span>
                  <span>{offerText}</span>
                </motion.div>
              </div>
              <button
                type="button"
                aria-label="Dismiss offer banner"
                onClick={() => setShowOfferBanner(false)}
                className="shrink-0 rounded-full border border-white/15 p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Image
              src="/G.png"
              alt="Gopo logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-cover"
            />
            <span className="text-lg font-semibold tracking-[0.2em] text-zinc-900">
              GOPO
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700 md:flex">
            <Link className="transition hover:text-zinc-900" href="/">
              Home
            </Link>
            <Link className="transition hover:text-zinc-900" href="/about">
              About
            </Link>
            {/* <Link className="transition hover:text-zinc-900" href="/how-it-works">
              How It Works
            </Link> */}
            <div className="group relative">
              <Link
                className="inline-flex items-center gap-1.5 py-2 transition hover:text-zinc-900"
                href="/services"
              >
                Services
                <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
              </Link>

              <div className="invisible absolute left-1/2 top-full w-[660px] -translate-x-1/2 translate-y-3 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="overflow-hidden rounded border border-white/60 bg-white/58 p-2.5 text-zinc-900 shadow-[0_24px_70px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
                  <div className="grid grid-cols-[0.76fr_1.24fr] gap-2.5">
                    <div className="relative overflow-hidden rounded border border-white/50 bg-zinc-950 p-5 text-white shadow-inner">
                      <img
                        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=900&auto=format&fit=crop"
                        alt="Event photography"
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/26 to-black/10" />
                      <div className="relative flex min-h-[230px] flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                            Services
                          </p>
                          <h3 className="mt-3 text-2xl font-semibold normal-case tracking-tight text-white">
                            Event photo delivery.
                          </h3>
                        </div>
                        <Link
                          href="/services"
                          className="inline-flex w-fit items-center gap-2 rounded bg-white/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-950 transition hover:bg-white"
                        >
                          Explore
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {eventServices.map((service) => (
                        <Link
                          key={service.title}
                          href={`/services/${service.slug}`}
                          className="group/card relative min-h-[100px] overflow-hidden rounded border border-white/55 bg-white/50 p-3  transition  hover:bg-white/72 "
                        >
                          <img
                            src={service.image}
                            alt={service.title}
                            className="absolute inset-0 h-full w-full object-cover opacity-54 saturate-125 transition group-hover/card:scale-105 group-hover/card:opacity-68"
                          />
                          <span className="absolute inset-0 bg-gradient-to-t from-white/96 via-white/72 to-white/18" />
                          <span className="relative flex h-full min-w-0 flex-col justify-end">
                            <span className="text-sm font-semibold normal-case tracking-normal text-zinc-950">
                              {service.title}
                            </span>
                            <span className="mt-1 text-xs font-medium normal-case leading-5 tracking-normal text-zinc-500">
                              {service.shortText}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link className="transition hover:text-zinc-900" href="/showcase-gallery">
              Gallery
            </Link>
            <Link className="transition hover:text-zinc-900" href="/blog">
              Blog
            </Link>
            <Link className="transition hover:text-zinc-900" href="/contact">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="hidden rounded border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-700 transition hover:bg-zinc-100 md:inline-flex"
            >
              Login
            </a>
            <a
              href="/admin"
              className="rounded border border-zinc-900/90 bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black"
            >
              Create Event
            </a>
          </div>
        </div>
      </header>

      <div
        className={`transition-[height] duration-300 ease-out ${headerOffsetClass}`}
        aria-hidden="true"
      />
    </>
  );
}
