"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, ScanFace, Image as ImageIcon } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-4 sm:text-3xl md:text-5xl">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-base text-zinc-600 sm:text-lg">
            A premium photo delivery experience backed by powerful technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Feature 1 (Large, takes 2 cols on md) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 rounded-[2rem] border border-zinc-200 bg-white p-8 relative overflow-hidden group hover:border-zinc-300 transition-colors"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] group-hover:text-zinc-700 transition-all duration-500 text-zinc-900">
              <ScanFace className="h-48 w-48" />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-300 text-zinc-900 flex items-center justify-center mb-6 group-hover:bg-zinc-100 group-hover:text-zinc-700 group-hover:border-zinc-300 transition-colors">
              <ScanFace className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-zinc-900">AI Face Recognition Core</h3>
            <p className="text-zinc-600 max-w-md leading-relaxed">
              Our advanced AI detects and matches faces across hundreds of photos in milliseconds. It handles different angles, lighting conditions, and groups with 99.8% accuracy.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-[2rem] border border-zinc-200 bg-white p-8 relative overflow-hidden group hover:border-zinc-300 transition-colors"
          >
            <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-300 text-zinc-900 flex items-center justify-center mb-6 group-hover:bg-zinc-100 group-hover:text-zinc-700 group-hover:border-zinc-300 transition-colors">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-zinc-900">Privacy First</h3>
            <p className="text-zinc-600 leading-relaxed max-w-sm">
              Guests only see photos they are explicitly in. No one else can browse their private moments.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-[2rem] border border-zinc-200 bg-white p-8 relative overflow-hidden group hover:border-zinc-300 transition-colors"
          >
            <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-300 text-zinc-900 flex items-center justify-center mb-6 group-hover:bg-zinc-100 group-hover:text-zinc-700 group-hover:border-zinc-300 transition-colors">
              <ImageIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-zinc-900">Zero Compression</h3>
            <p className="text-zinc-600 leading-relaxed max-w-sm">
              Deliver photos in flawless high resolution. Perfect for printing or posting straight to social media.
            </p>
          </motion.div>

          {/* Feature 4 (Large, takes 2 cols on md) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 rounded-[2rem] border border-zinc-200 bg-white p-8 relative overflow-hidden group hover:border-zinc-300 transition-colors"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] group-hover:text-zinc-700 transition-all duration-500 text-zinc-900">
              <Zap className="h-48 w-48" />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-300 text-zinc-900 flex items-center justify-center mb-6 group-hover:bg-zinc-100 group-hover:text-zinc-700 group-hover:border-zinc-300 transition-colors">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-zinc-900">Lightning Fast Delivery</h3>
            <p className="text-zinc-600 max-w-md leading-relaxed">
              No more waiting. As soon as the admin uploads the album, our servers process and send automated email alerts to every guest letting them know their photos are ready to download.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
