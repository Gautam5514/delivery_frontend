"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck2, Images, ScanFace } from "lucide-react";

const quickSteps = [
  {
    title: "Sign Up",
    desc: "Sign up using phone number or email ID and register your face by clicking a quick selfie.",
    icon: ScanFace,
  },
  {
    title: "Join and Create Groups",
    desc: "Create private or public event groups and upload photos for everyone present there.",
    icon: CalendarCheck2,
  },
  {
    title: "Share Memories",
    desc: "Upload from multiple sources and let AI find shared moments with your friends and family.",
    icon: Images,
  },
];

export default function AdvancedShowcaseSection() {
  return (
    <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12 p-6 text-[#20242b] sm:p-10 lg:p-14">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="relative"
          >
            <div className="absolute -left-10 -top-9 h-40 w-40 rounded-full bg-zinc-300 blur-[1px] sm:h-52 sm:w-52" />
            <div className="relative overflow-hidden rounded-[1.7rem] border border-[#d4dbe3] bg-white shadow-[0_20px_40px_rgba(26,38,62,0.12)]">
              <div className="relative h-[360px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=1300&auto=format&fit=crop"
                  alt="AI face recognition in street crowd"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-x-6 bottom-6 rounded-xl bg-[#5d738cae] px-4 py-3 text-sm font-medium leading-6 text-white">
                Facial recognition that helps people discover every photo they
                appear in.
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-600">
              How Gopo Works?
            </p>
            <h2 className="mt-3 text-xl font-semibold leading-tight sm:text-5xl">
              Get Started with Gopo
            </h2>
            <div className="mt-3 h-1 w-35 rounded-full bg-zinc-700" />

            <div className="mt-9 space-y-6">
              {quickSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="grid h-17 w-17 shrink-0 place-items-center rounded-full border border-[#d8dfe8] bg-white shadow-[0_8px_20px_rgba(31,50,80,0.08)]">
                      <Icon className="h-9 w-9 text-zinc-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold leading-tight text-[#2a2e35] sm:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-lg text-sm leading-8 text-[#4a4f58] sm:text-xl">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-600">
              For Our Professionals
            </p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#191d24] sm:text-5xl">
              Smartly Deliver Photos to your Clients
            </h3>
            <div className="mt-7 h-1 w-28 rounded-full bg-zinc-700" />
            <p className="mt-8 max-w-3xl text-lg leading-9 text-[#454a53]">
              Clicking photos is one half of the task. The second half is
              delivering them to your clients. Choose the modern way of
              delivering photos smartly using AI.
            </p>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-[#454a53]">
              With paid plans, unlock premium features to grow your brand and
              client reach with gallery templates, flexible downloads, and more.
            </p>
            <a
              href="#features"
              className="mt-7 inline-flex items-center gap-3 text-xl font-semibold text-zinc-800 underline decoration-zinc-700/40 underline-offset-8 transition hover:text-zinc-900"
            >
              <ArrowRight className="h-6 w-6" />
              Know More
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.07 }}
            className="relative mx-auto w-full max-w-[700px]"
          >
            <div className="absolute inset-0 rounded-full bg-zinc-300" />
            <div className="relative z-10 h-[420px] w-full sm:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1400&auto=format&fit=crop"
                alt="Professional photographer using camera"
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="rounded-full object-cover shadow-[0_20px_50px_rgba(14,23,41,0.22)]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
