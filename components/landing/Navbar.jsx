"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { eventServices } from "@/app/services/serviceData";

const mobileNavLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/showcase-gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [showOfferBanner, setShowOfferBanner] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const offerText =
    "All-time 50% offer: Get 50% off on all plans and launch your event with premium QR photo delivery today.";

  return (
    <>
      {/* Sticky (not fixed) so the page content offset always matches the real
          header height — no hardcoded spacer that drifts across breakpoints */}
      <header className="sticky inset-x-0 top-0 z-50 border-b border-zinc-200/80 bg-white/88 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        {/* ── Offer banner ── */}
        {showOfferBanner ? (
          <div className="border-b border-zinc-200 bg-zinc-950 text-white">
            <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4 py-2 sm:px-6 lg:px-8">
              <span className="shrink-0 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80 sm:px-3">
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

        {/* ── Main nav bar ── */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.webp"
              alt="FaceDeliver logo"
              width={36}
              height={36}
              className="h-8 w-8 rounded-lg object-cover sm:h-9 sm:w-9"
            />
            <span className="text-sm font-semibold tracking-[0.12em] text-zinc-900 sm:text-lg sm:tracking-[0.2em]">
              FACEDELIVER
            </span>
          </Link>

          {/* ── Desktop nav (md+) ── */}
          <nav className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700 md:flex lg:gap-8">
            <Link className="transition hover:text-zinc-900" href="/">
              Home
            </Link>
            <Link className="transition hover:text-zinc-900" href="/about">
              About
            </Link>

            {/* Services dropdown */}
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
                        src="/images/hero_photography.webp"
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
                          className="group/card relative min-h-[100px] overflow-hidden rounded border border-white/55 bg-white/50 p-3 transition hover:bg-white/72"
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

          {/* ── Right side actions ── */}
          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="hidden rounded border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-700 transition hover:bg-zinc-100 md:inline-flex"
            >
              Login
            </a>
            <a
              href="/admin"
              className="whitespace-nowrap rounded border border-zinc-900/90 bg-zinc-900 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-black sm:px-4 sm:text-xs sm:tracking-[0.15em]"
            >
              Create Event
            </a>
            {/* Mobile hamburger (md-) */}
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-zinc-900/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[85vw] max-w-[320px] flex-col bg-white shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <Image
                    src="/logo.webp"
                    alt="FaceDeliver logo"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                  <span className="text-base font-semibold tracking-[0.2em] text-zinc-900">
                    FACEDELIVER
                  </span>
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-5">
                <div className="space-y-1">
                  {mobileNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center rounded-xl px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Services sub-links */}
                <div className="mt-6">
                  <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                    Our Services
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {eventServices.map((service) => (
                      <Link
                        key={service.title}
                        href={`/services/${service.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="relative overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 p-3 transition hover:bg-zinc-100"
                      >
                        <p className="text-xs font-semibold text-zinc-900 leading-snug">
                          {service.title}
                        </p>
                        <p className="mt-0.5 text-[10px] text-zinc-400 leading-tight line-clamp-2">
                          {service.shortText}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>

              {/* CTA buttons */}
              <div className="space-y-2.5 border-t border-zinc-100 px-4 py-5">
                <a
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 transition hover:bg-zinc-100"
                >
                  Login
                </a>
                <a
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black"
                >
                  Create Event
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
