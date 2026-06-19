"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const solutions = [
  {
    title: "Event Planners",
    bg: "from-zinc-700 to-zinc-500",
    image: "/images/card_wedding.webp",
  },
  {
    title: "Photographers",
    bg: "from-zinc-700 to-zinc-500",
    image: "/images/feat_camera_pro.webp",
  },
  {
    title: "Individual Hosts",
    bg: "from-zinc-700 to-zinc-500",
    image: "/images/hero_birthday.webp",
  },
  {
    title: "Organisations",
    bg: "from-zinc-700 to-zinc-500",
    image: "/images/hero_corporate.webp",
  },
];

export default function AudienceSolutionsSection() {
  return (
    <section className="relative z-10 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 sm:py-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          className="mb-10 flex items-center justify-center gap-3 text-center text-xl font-semibold sm:mb-12 sm:text-2xl md:text-4xl"
        >
          <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
          <h2>One FaceDeliver - Many Solutions</h2>
        </motion.div>

        {/* 2-col grid on mobile/tablet → 4-col on lg */}
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4 lg:gap-8">
          {solutions.map((solution, index) => (
            <motion.article
              key={solution.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative flex flex-col items-center"
            >
              {/* Vertical divider (lg+ only between cards) */}
              {index > 0 && (
                <span className="absolute -left-4 top-16 hidden h-36 border-l border-dashed border-zinc-400 lg:block" />
              )}

              {/* Portrait image */}
              <div
                className={`relative h-56 w-40 overflow-hidden rounded-t-[5.5rem] bg-gradient-to-br ${solution.bg} sm:h-64 sm:w-48 md:h-72 md:w-52 lg:w-56`}
              >
                <Image
                  src={solution.image}
                  alt={solution.title}
                  fill
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Label pill */}
              <div className="mt-4 rounded-xl bg-zinc-900 px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg sm:px-6 sm:py-3 sm:text-base lg:rounded-xl lg:px-7">
                {solution.title}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
