"use client";

import Image from "next/image";
import { useState } from "react";
import { FolderTree, ScanFace, Sparkles, Layers } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    title: "Facial Recognition",
    description:
      "Gopo uses facial recognition to find photos of just you! It curates individual collections of people present.",
    icon: ScanFace,
  },
  {
    id: 2,
    title: "Quality Retention",
    description:
      "No quality loss while sharing and downloading photos. Keep your memories in full resolution.",
    icon: Sparkles,
  },
  {
    id: 3,
    title: "Unlimited Event Groups",
    description:
      "You can create multiple event groups for easy browsing and organized curation.",
    icon: Layers,
  },
  {
    id: 4,
    title: "One Shot Upload",
    description:
      "Upload multiple folders at once, hassle free! Sub-folders inside parent folder created automatically.",
    icon: FolderTree,
  },
];

export default function WhyChooseUsSection() {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  return (
    <section className="w-full bg-white py-10 px-4 sm:py-12 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-[1200px]">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 items-start">

          {/* ── Left: illustration + heading ── */}
          <div className="flex flex-col gap-5 sm:gap-6">
            <div className="relative w-full h-[260px] sm:h-[320px] mx-auto lg:mx-0 max-w-[400px] sm:max-w-[450px]">
              <GraphicIllustration />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-0 text-left sm:mt-2"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-slate-500 block mb-2">
                Why Choose Us?
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight sm:text-3xl sm:leading-tight md:text-4xl mb-4">
                Gopo segregates thousands of photographs from an event so you
                <span className="relative inline-block ml-2 z-0">
                  don&apos;t have to!
                  <span className="absolute -bottom-1 left-0 h-2 w-full bg-zinc-300 -z-10 rounded-sm" />
                </span>
              </h2>
            </motion.div>
          </div>

          {/* ── Right: feature cards grid ── */}
          <div className="border border-zinc-300 rounded-sm bg-white grid grid-cols-1 sm:grid-cols-2">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                index={index}
                isActive={hoveredIndex === index}
                onHover={() => setHoveredIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index, isActive, onHover }) {
  let borderClass = "border-zinc-300";
  if (index === 0) borderClass += " sm:border-r sm:border-b border-b";
  if (index === 1) borderClass += " sm:border-b border-b sm:border-r-0";
  if (index === 2) borderClass += " sm:border-r border-b sm:border-b-0";

  const Icon = feature.icon;

  return (
    <div
      onMouseEnter={onHover}
      className={`relative p-5 sm:p-8 transition-all duration-300 cursor-pointer flex flex-col justify-center min-h-[160px] sm:min-h-[200px] ${borderClass} ${
        isActive
          ? "bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-10 scale-[1.02] sm:scale-[1.03]"
          : "bg-transparent hover:bg-slate-50"
      }`}
    >
      <div className="mb-3 sm:mb-4">
        <Icon size={28} className="text-slate-700 sm:h-9 sm:w-9" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1.5 sm:text-xl sm:mb-2">
        {feature.title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-500">{feature.description}</p>
    </div>
  );
}

function GraphicIllustration() {
  return (
    <div className="relative w-full h-full">
      <motion.div
        initial={{ scale: 0.9, rotate: -5 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="absolute top-[10%] left-[20%] w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] z-0"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-zinc-300 drop-shadow-lg">
          <path d="M50 5 L95 90 L5 90 Z" fill="currentColor" />
        </svg>
      </motion.div>

      <div className="absolute top-0 left-0 w-[180px] h-[260px] bg-zinc-300 rounded-t-full rounded-b-3xl -rotate-3 z-10 shadow-md transform origin-bottom-left sm:w-[240px] sm:h-[320px]" />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-[30px] left-[22px] w-[150px] z-20 sm:top-[40px] sm:left-[30px] sm:w-[200px]"
      >
        <div className="relative rounded-[24px] border-[5px] border-slate-900 bg-slate-900 overflow-hidden shadow-2xl rotate-[-3deg]">
          <div className="relative w-full" style={{ aspectRatio: "9/18" }}>
            <Image
              src="/images/feat_ai_match.png"
              alt="Gallery App"
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-3 bottom-10 w-10 h-16 bg-zinc-300 rounded-l-full z-30 opacity-90 shadow-sm sm:-right-4 sm:bottom-12 sm:w-12 sm:h-20" />
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="absolute top-[12px] left-[115px] w-[160px] bg-white p-2.5 rounded-lg shadow-xl z-30 border border-slate-100 sm:top-[15px] sm:left-[150px] sm:w-[220px] sm:p-3"
      >
        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 relative bg-slate-200 sm:w-8 sm:h-8">
            <Image
              src="/images/card_wedding.png"
              alt="Event"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-zinc-800 text-xs">JWS Meet</h4>
            <p className="text-[10px] text-slate-400">271 Photos</p>
          </div>
        </div>
        <p className="text-[10px] font-semibold text-slate-700 leading-tight sm:text-[11px]">
          We&apos;ve found <span className="text-zinc-700">3 new photos</span> of you!
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute bottom-[15px] left-[120px] w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden z-30 bg-slate-200 sm:bottom-[20px] sm:left-[150px] sm:w-24 sm:h-24"
      >
        <Image
          src="/images/feat_selfie.png"
          alt="User"
          fill
          sizes="96px"
          className="object-cover"
        />
      </motion.div>

      <div className="absolute bottom-[70px] left-[50px] w-10 h-10 z-20 pointer-events-none sm:bottom-[80px] sm:left-[60px] sm:w-12 sm:h-12">
        <svg viewBox="0 0 50 50" className="w-full h-full text-white drop-shadow-md transform -rotate-12">
          <path d="M40 10 C 40 30, 20 40, 5 35" stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrow-w)" />
          <defs>
            <marker id="arrow-w" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="white" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="absolute top-[100px] right-[16px] w-12 h-20 z-10 pointer-events-none sm:top-[120px] sm:right-[20px] sm:w-16 sm:h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full text-zinc-600">
          <path d="M50 80 C 80 80, 80 40, 60 20" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" markerEnd="url(#arrow-b)" />
          <defs>
            <marker id="arrow-b" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="rgb(113, 113, 122)" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}
