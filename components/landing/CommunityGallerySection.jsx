"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const floatingCards = [
  {
    caption: "You uploaded 59 photos to the Day Trip group",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=900&auto=format&fit=crop",
    className:
      "left-4 top-20 -rotate-6 sm:left-8 md:left-12 lg:left-16 lg:top-24",
    width: "w-44 sm:w-48 md:w-52",
    neon: "#7c3aed",
    glow: "rgba(124,58,237,0.18)",
    floatAmount: -10,
    floatDuration: 4.2,
  },
  {
    caption: "We've found new photos!",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=900&auto=format&fit=crop",
    className:
      "left-44 top-6 rotate-3 sm:left-56 md:left-72 lg:left-80 lg:top-8",
    width: "w-40 sm:w-44 md:w-48",
    neon: "#059669",
    glow: "rgba(5,150,105,0.18)",
    floatAmount: 9,
    floatDuration: 5.0,
  },
  {
    caption: "5 people have joined the Office group",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop",
    className:
      "left-1/2 top-44 -translate-x-1/2 -rotate-1 sm:top-40 md:top-48 lg:top-52",
    width: "w-48 sm:w-56 md:w-60",
    neon: "#2563eb",
    glow: "rgba(37,99,235,0.18)",
    floatAmount: -12,
    floatDuration: 4.6,
  },
  {
    caption: "Akshay has added 32 new photos to the Event group",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=900&auto=format&fit=crop",
    className:
      "right-36 top-20 rotate-[-5deg] sm:right-44 md:right-56 lg:right-72 lg:top-16",
    width: "w-40 sm:w-44 md:w-48",
    neon: "#db2777",
    glow: "rgba(219,39,119,0.18)",
    floatAmount: 8,
    floatDuration: 3.8,
  },
  {
    caption: "Jai created the Birthday group!",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop",
    className:
      "right-4 top-2 rotate-[7deg] sm:right-8 md:right-16 lg:right-20 lg:top-0",
    width: "w-36 sm:w-40 md:w-44",
    neon: "#ea580c",
    glow: "rgba(234,88,12,0.18)",
    floatAmount: -9,
    floatDuration: 4.0,
  },
  {
    caption: "We've found common photos of your group",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=900&auto=format&fit=crop",
    className:
      "right-2 top-40 rotate-[6deg] sm:right-6 md:right-10 lg:right-12 lg:top-48",
    width: "w-44 sm:w-48 md:w-52",
    neon: "#0891b2",
    glow: "rgba(8,145,178,0.18)",
    floatAmount: 11,
    floatDuration: 5.4,
  },
];

function MiniCard({ card, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="w-52 shrink-0 snap-start sm:w-56"
    >
      <div
        className="rounded-2xl p-[1.5px]"
        style={{
          background: `linear-gradient(135deg, ${card.neon}90, transparent 50%, ${card.neon}50)`,
        }}
      >
        <div
          className="rounded-2xl bg-white p-3"
          style={{
            boxShadow: `0 0 20px ${card.glow}, 0 16px 40px rgba(30,40,80,0.12)`,
          }}
        >
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src={card.image}
              alt={card.caption}
              width={400}
              height={160}
              className="h-28 w-full rounded-xl object-cover"
            />
            <div
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${card.neon}, transparent)`,
                opacity: 0.8,
              }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: card.neon }}
            />
            <p className="text-center text-[11px] font-semibold leading-5 text-zinc-700">
              {card.caption}
            </p>
          </div>
        </div>
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

        {/* ── Mobile: horizontal scroll strip (hidden on md+) ── */}
        <div className="mt-10 md:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {floatingCards.map((card, index) => (
              <MiniCard key={card.caption} card={card} index={index} />
            ))}
          </div>
          {/* Fade hint at right edge */}
          <div className="pointer-events-none relative -mt-16 flex justify-end pr-0">
            <div className="h-16 w-16 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>

        {/* ── Desktop: floating card arena (hidden on mobile) ── */}
        <div className="relative mt-16 hidden min-h-[560px] overflow-hidden rounded-2xl bg-[#eff1f5] px-3 py-8 md:block sm:px-6">

          {/* Subtle dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(rgba(100,116,139,0.35) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Soft vignette edges */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 50%, #eff1f5 95%)",
            }}
          />

          {/* Ambient color blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.18, 0.3, 0.18] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[20%] top-[45%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300 blur-[80px]"
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.14, 0.24, 0.14] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute left-[76%] top-[32%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 blur-[80px]"
            />
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.2, 0.12] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="absolute left-[50%] top-[70%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300 blur-[80px]"
            />
          </div>

          {/* Scan line */}
          <motion.div
            initial={{ top: "-2px" }}
            animate={{ top: "calc(100% + 2px)" }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
            className="pointer-events-none absolute inset-x-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.5) 35%, rgba(37,99,235,0.5) 65%, transparent 100%)",
              filter: "blur(1px)",
            }}
          />

          {/* Floating cards — staggered entry + continuous float */}
          {floatingCards.map((card, index) => (
            <motion.div
              key={card.caption}
              className={`absolute ${card.className} ${card.width}`}
              initial={{ opacity: 0, scale: 0.55, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{
                duration: 0.7,
                delay: index * 0.38,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                animate={{ y: [0, card.floatAmount, 0] }}
                transition={{
                  duration: card.floatDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4,
                }}
              >
                <div
                  className="rounded-2xl p-[1.5px]"
                  style={{
                    background: `linear-gradient(135deg, ${card.neon}90, transparent 50%, ${card.neon}50)`,
                  }}
                >
                  <div
                    className="rounded-2xl bg-white p-3"
                    style={{
                      boxShadow: `0 0 20px ${card.glow}, 0 16px 40px rgba(30,40,80,0.12)`,
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src={card.image}
                        alt={card.caption}
                        width={400}
                        height={160}
                        className="h-28 w-full rounded-xl object-cover sm:h-32 md:h-36"
                      />
                      <div
                        className="absolute inset-x-0 top-0 h-[2px]"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${card.neon}, transparent)`,
                          opacity: 0.8,
                        }}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-center gap-1.5">
                      <motion.span
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: card.neon }}
                      />
                      <p className="text-center text-[11px] font-semibold leading-5 text-zinc-700 sm:text-xs">
                        {card.caption}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
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
