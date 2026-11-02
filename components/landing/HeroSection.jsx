"use client";

import Link from "next/link";
import TiltedGridHero from "@/components/ui/tilted-grid-hero";

const images = [
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
].map((src) => ({ src, alt: "" }));

export default function HeroSection() {
  return (
    <TiltedGridHero
      images={images}
      axis={60}
      speed={6}
      tileHeight={30}
      className="min-h-[680px] h-[calc(100vh-4rem)] w-full bg-[#09090b]"
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 pb-12 pt-10 text-center sm:pt-12">
        <div>
      <h1 className="mx-auto max-w-5xl text-balance text-3xl font-medium leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">
        Every Guest. Every Photo.{" "}
        <span className="text-zinc-500">Delivered in Seconds.</span>
      </h1>

      <p className="mx-auto mt-5 max-w-3xl text-balance text-sm leading-6 text-zinc-400 sm:text-base">
        FaceDeliver uses AI face recognition to hand every guest their own event
        photos instantly, with a single QR scan.
      </p>
        </div>

        <div>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/register"
          className="inline-flex w-full items-center justify-center rounded-full border border-white bg-white px-6 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-zinc-900 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-xl sm:w-auto"
        >
          Start as Guest
        </Link>
        <Link
          href="/admin"
          className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15 sm:w-auto"
        >
          Create Event
        </Link>
      </div>

        </div>
      </div>
    </TiltedGridHero>
  );
}
