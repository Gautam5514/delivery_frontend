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
    <section className="relative z-10 px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12 p-4 text-[#20242b] sm:p-8 lg:p-14">

        {/* ── Row 1: AI showcase image + steps ── */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="relative"
          >
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-zinc-300 blur-[1px] sm:-left-10 sm:-top-9 sm:h-52 sm:w-52" />
            <div className="relative overflow-hidden rounded-[1.7rem] border border-[#d4dbe3] bg-white shadow-[0_20px_40px_rgba(26,38,62,0.12)]">
              <div className="relative h-[260px] w-full sm:h-[320px] md:h-[360px]">
                <Image
                  src="/images/feat_ai_match.webp"
                  alt="AI face recognition in street crowd"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-x-4 bottom-4 rounded-xl bg-[#5d738cae] px-4 py-3 text-sm font-medium leading-6 text-white sm:inset-x-6 sm:bottom-6">
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
              How FaceDeliver Works?
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl lg:text-5xl">
              Get Started with FaceDeliver
            </h2>
            <div className="mt-3 h-1 w-28 rounded-full bg-zinc-700 sm:w-35" />

            <div className="mt-8 space-y-5 sm:mt-9 sm:space-y-6">
              {quickSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#d8dfe8] bg-white shadow-[0_8px_20px_rgba(31,50,80,0.08)] sm:h-16 sm:w-16">
                      <Icon className="h-7 w-7 text-zinc-700 sm:h-8 sm:w-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold leading-tight text-[#2a2e35] sm:text-xl lg:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-lg text-sm leading-7 text-[#4a4f58] sm:text-base lg:text-lg lg:leading-8">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── Row 2: professionals copy + round image ── */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-600">
              For Our Professionals
            </p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#191d24] sm:text-3xl lg:text-5xl">
              Smartly Deliver Photos to your Clients
            </h3>
            <div className="mt-5 h-1 w-24 rounded-full bg-zinc-700 sm:mt-7 sm:w-28" />
            <p className="mt-6 max-w-3xl text-base leading-7 text-[#454a53] sm:mt-8 sm:text-lg sm:leading-9">
              Clicking photos is one half of the task. The second half is
              delivering them to your clients. Choose the modern way of
              delivering photos smartly using AI.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#454a53] sm:mt-6 sm:text-lg sm:leading-9">
              With paid plans, unlock premium features to grow your brand and
              client reach with gallery templates, flexible downloads, and more.
            </p>
            <a
              href="#features"
              className="mt-6 inline-flex items-center gap-3 text-lg font-semibold text-zinc-800 underline decoration-zinc-700/40 underline-offset-8 transition hover:text-zinc-900 sm:mt-7 sm:text-xl"
            >
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              Know More
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.07 }}
            className="relative mx-auto w-full max-w-[500px] lg:max-w-[700px]"
          >
            <div className="absolute inset-0 rounded-full bg-zinc-300" />
            <div className="relative z-10 h-[320px] w-full sm:h-[400px] lg:h-[500px]">
              <Image
                src="/images/feat_camera_pro.webp"
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
