"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function FinalCtaSection() {
    return (
        <section className="relative py-20 sm:py-32 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-96 rounded-full bg-zinc-200/70 blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-4xl px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-zinc-100 border border-zinc-200 mb-8 shadow-2xl shadow-white/20">
                        <Sparkles className="h-8 w-8 text-zinc-700" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 text-zinc-900">
                        Ready to upgrade your event?
                    </h2>

                    <p className="text-lg sm:text-xl text-zinc-600 mb-10 max-w-2xl mx-auto">
                        Stop sharing generic Google Drive links. Start delivering a magical, personalized photo experience today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/admin"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-zinc-900 px-8 py-4 text-base font-bold text-white transition-all hover:scale-105 hover:bg-black shadow-[0_0_40px_-10px_rgba(24,24,27,0.2)]"
                        >
                            Host Dashboard
                        </Link>
                        <Link
                            href="/register"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-zinc-300 bg-white px-8 py-4 text-base font-semibold text-zinc-900 transition hover:bg-zinc-100"
                        >
                            Guest Registration
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
