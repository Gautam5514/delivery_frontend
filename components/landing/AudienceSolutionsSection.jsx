"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const solutions = [
  {
    title: "Event Planners",
    bg: "from-zinc-700 to-zinc-500",
    image:
      "https://plus.unsplash.com/premium_photo-1661389748409-0a8f74602f34?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Photographers",
    bg: "from-zinc-700 to-zinc-500",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Individual Hosts",
    bg: "from-zinc-700 to-zinc-500",
    image:
      "https://plus.unsplash.com/premium_photo-1674389878263-3713072a4f33?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Organisations",
    bg: "from-zinc-700 to-zinc-500",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=900&auto=format&fit=crop",
  },
];

export default function AudienceSolutionsSection() {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl p-8 text-zinc-900 sm:p-10 lg:p-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          className="mb-12 flex items-center justify-center gap-3 text-center text-2xl font-semibold sm:text-4xl"
        >
          <Sparkles className="h-7 w-7" />
          <h2>One Gopo - Many Solutions</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {solutions.map((solution, index) => (
            <motion.article
              key={solution.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative flex flex-col items-center"
            >
              {index > 0 && (
                <span className="absolute -left-4 top-20 hidden h-40 border-l border-dashed border-zinc-400 lg:block" />
              )}

              <div
                className={`relative h-72 w-56 overflow-hidden rounded-t-[7rem] bg-gradient-to-br ${solution.bg}`}
              >
                <Image
                  src={solution.image}
                  alt={solution.title}
                  fill
                  sizes="224px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="mt-5 rounded-xl bg-zinc-900 px-7 py-3 text-center text-lg font-medium text-white shadow-lg">
                {solution.title}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
