"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const tiles = [
  {
    tag: "Uploads",
    caption: "You uploaded 59 photos to the Day Trip group",
    image: "/images/card_festival.webp",
    accent: "#a78bfa",
    className: "col-span-2 row-span-2",
  },
  {
    tag: "AI Match",
    caption: "We've found new photos!",
    image: "/images/feat_selfie.webp",
    accent: "#34d399",
    className: "col-span-1",
  },
  {
    tag: "Groups",
    caption: "5 people have joined the Office group",
    image: "/images/card_corporate.webp",
    accent: "#60a5fa",
    className: "col-span-1",
  },
  {
    tag: "Activity",
    caption: "Akshay has added 32 new photos to the Event group",
    image: "/images/hero_corporate.webp",
    accent: "#f472b6",
    className: "col-span-2",
  },
  {
    tag: "New group",
    caption: "Jai created the Birthday group!",
    image: "/images/card_birthday.webp",
    accent: "#fb923c",
    className: "col-span-1 lg:col-span-2",
  },
  {
    tag: "Shared",
    caption: "We've found common photos of your group",
    image: "/images/card_college.webp",
    accent: "#22d3ee",
    className: "col-span-1 lg:col-span-2",
  },
];

function BentoTile({ tile, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex flex-col rounded-[28px] bg-white p-2 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] ring-1 ring-zinc-200/70 transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_40px_-16px_rgba(15,23,42,0.22)] ${tile.className}`}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[22px] bg-zinc-100">
        <Image
          src={tile.image}
          alt={tile.caption}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="px-3 pb-2 pt-3.5">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: tile.accent }}
          />
          {tile.tag}
        </p>
        <p className="mt-1.5 text-sm font-medium leading-snug text-zinc-900">
          {tile.caption}
        </p>
      </div>
    </motion.div>
  );
}

export default function CommunityGallerySection() {
  return (
    <section className="relative z-10 px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 md:py-16">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-4xl text-center text-[#1d1f23]"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Join Our Community
          </p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Create your own AI-powered Photo Galleries
          </h2>
          <div className="mx-auto mt-7 h-1 w-24 rounded-full bg-zinc-700" />
        </motion.div>

        {/* Bento grid */}
        <div className="mt-12 grid auto-rows-[250px] grid-cols-2 gap-3 sm:auto-rows-[280px] sm:gap-4 lg:auto-rows-[270px] lg:grid-cols-4">
          {tiles.map((tile, index) => (
            <BentoTile key={tile.caption} tile={tile} index={index} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          className="mx-auto mt-10 max-w-4xl text-center text-lg leading-8 text-zinc-700 md:mt-12 md:text-xl md:leading-9"
        >
          Create groups for every occasion and let face recognition organize
          everyone&apos;s moments into one smart, elegant photo experience.
        </motion.p>
      </div>
    </section>
  );
}
