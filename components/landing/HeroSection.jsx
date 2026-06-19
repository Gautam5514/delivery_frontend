"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const heroSlides = [
  {
    title: "AI Event Photo Delivery with Face Recognition",
    description:
      "FaceDeliver instantly delivers every guest their own photos using AI face matching. High-end galleries, QR-code access, and precise photo delivery in one polished platform.",
    image: "/images/hero_wedding.webp",
  },
  {
    title: "Instant Wedding & Event Photo Sharing",
    description:
      "From camera-first event coverage to private guest galleries, deliver every moment with a refined, premium presentation.",
    image: "/images/hero_photography.webp",
  },
  {
    title: "QR-Code Photo Galleries for Every Guest",
    description:
      "Turn thousands of event shots into an elegant viewing flow with AI search, face matching, and effortless sharing.",
    image: "/images/hero_corporate.webp",
  },
  {
    title: "Automated Photo Delivery for Photographers",
    description:
      "Showcase cameras, creators, and final memories in a polished interface designed for studios, photographers, and guests.",
    image: "/images/hero_birthday.webp",
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveSlide((c) => (c + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const goToPrevious = () =>
    setActiveSlide((c) => (c === 0 ? heroSlides.length - 1 : c - 1));
  const goToNext = () =>
    setActiveSlide((c) => (c + 1) % heroSlides.length);

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <Image
          key={slide.image}
          src={slide.image}
          alt={slide.title}
          fill
          sizes="100vw"
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.5)_42%,rgba(255,255,255,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.22)_0%,rgba(15,23,42,0.08)_28%,rgba(255,255,255,0.02)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_44%,rgba(255,255,255,0.16),transparent_34%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/80 to-transparent" />

      <button
        aria-label="Previous slide"
        onClick={goToPrevious}
        className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-zinc-300/70 bg-white/72 p-2 text-zinc-700 shadow-lg shadow-zinc-900/10 backdrop-blur-md transition hover:bg-white hover:text-zinc-900 sm:left-8 sm:block"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        aria-label="Next slide"
        onClick={goToNext}
        className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-zinc-300/70 bg-white/72 p-2 text-zinc-700 shadow-lg shadow-zinc-900/10 backdrop-blur-md transition hover:bg-white hover:text-zinc-900 sm:right-8 sm:block"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 pt-24 pb-12 sm:px-6 sm:pt-16 sm:pb-16 lg:px-8">
        <div className="w-full md:ml-auto md:max-w-xl lg:max-w-2xl">
          <motion.h1
            key={heroSlides[activeSlide].title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {heroSlides[activeSlide].title}
          </motion.h1>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 180, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-5 h-[2px] bg-zinc-900 sm:mt-7"
          />

          <motion.p
            key={heroSlides[activeSlide].description}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-4 max-w-xl text-sm leading-7 text-zinc-700 sm:mt-8 sm:text-base sm:leading-8 lg:text-lg"
          >
            {heroSlides[activeSlide].description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4"
          >
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-900/90 bg-zinc-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-black"
            >
              Start as Guest
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-900 transition hover:bg-zinc-100"
            >
              Create Event
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-zinc-600 sm:mt-10 sm:gap-5 sm:text-xs"
          >
            <span>Premium Visual Theme</span>
            <span className="h-1 w-1 rounded-full bg-zinc-500/60" />
            <span>Event-Ready Experience</span>
            <span className="h-1 w-1 rounded-full bg-zinc-500/60" />
            <span>{String(activeSlide + 1).padStart(2, "0")} / 04</span>
          </motion.div>

          <div className="mt-7 flex items-center gap-4 sm:mt-8">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={goToPrevious}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300/80 bg-white/80 text-zinc-700 shadow-sm backdrop-blur-md transition hover:bg-white hover:text-zinc-900 active:scale-95 sm:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeSlide
                      ? "w-10 bg-zinc-900"
                      : "w-2.5 bg-zinc-400/60 hover:bg-zinc-500/80"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next slide"
              onClick={goToNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300/80 bg-white/80 text-zinc-700 shadow-sm backdrop-blur-md transition hover:bg-white hover:text-zinc-900 active:scale-95 sm:hidden"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
