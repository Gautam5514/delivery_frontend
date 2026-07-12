"use client";

import Link from "next/link";
import ArcGalleryHero from "@/components/ui/arc-gallery-hero";
import NeuralBackground from "@/components/ui/flow-field-background";

const arcImages = [
  "/images/hero_wedding.webp",
  "/images/card_birthday.webp",
  "/images/feat_camera_pro.webp",
  "/images/hero_corporate.webp",
  "/images/card_festival.webp",
  "/images/hero_photography.webp",
  "/images/card_wedding.webp",
  "/images/hero_birthday.webp",
  "/images/card_college.webp",
  "/images/feat_selfie.webp",
  "/images/hero_college.webp",
  "/images/card_corporate.webp",
];

export default function HeroSection() {
  return (
    <ArcGalleryHero
      images={arcImages}
      background={
        <NeuralBackground
          className="h-full w-full"
          color="#818cf8"
          backgroundColor="#09090b"
          trailOpacity={0.1}
          particleCount={500}
          speed={0.8}
        />
      }
    >
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
        AI Event Photo Delivery with Face Recognition
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
        FaceDeliver instantly delivers every guest their own photos using AI
        face matching. High-end galleries, QR-code access, and precise photo
        delivery in one polished platform.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/register"
          className="inline-flex w-full items-center justify-center rounded-xl border border-white bg-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-900 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-xl sm:w-auto"
        >
          Start as Guest
        </Link>
        <Link
          href="/admin"
          className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/5 px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15 sm:w-auto"
        >
          Create Event
        </Link>
      </div>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400 sm:gap-5 sm:text-xs">
        <span>Premium Visual Theme</span>
        <span className="h-1 w-1 rounded-full bg-zinc-500/70" />
        <span>Event-Ready Experience</span>
        <span className="h-1 w-1 rounded-full bg-zinc-500/70" />
        <span>AI Face Matching</span>
      </div>
    </ArcGalleryHero>
  );
}
