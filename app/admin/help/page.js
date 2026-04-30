"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Lightbulb,
  Mail,
  MessageCircle,
  QrCode,
  RefreshCw,
  Sparkles,
  SunMedium,
  Users,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Step card ────────────────────────────────────────────────────────────────

const Step = ({ number, icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: number * 0.08 }}
    className="relative rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
  >
    <div className="flex items-start gap-4">
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-zinc-900 ring-2 ring-zinc-200">
          {number}
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-black text-zinc-950">{title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-zinc-500">{description}</p>
      </div>
    </div>
  </motion.div>
);

// ─── FAQ accordion ────────────────────────────────────────────────────────────

const FAQ = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-zinc-100 last:border-none">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-bold text-zinc-900">{question}</span>
        <span className="mt-0.5 shrink-0 text-zinc-400">
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm leading-7 text-zinc-500">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Tip card ─────────────────────────────────────────────────────────────────

const Tip = ({ icon: Icon, title, body }) => (
  <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="mt-4 text-base font-black text-zinc-950">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
  </div>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const steps = [
  {
    icon: QrCode,
    title: "Create an event and get your QR code",
    description:
      'Go to Events → Create Event. Give it a name and a short unique code. You\'ll instantly get a QR code and a shareable registration link.',
  },
  {
    icon: Users,
    title: "Guests scan and register",
    description:
      "Display the QR code at your venue or share the link in advance. Guests enter their name, email, and take a quick selfie — that's all they need to do.",
  },
  {
    icon: ImageIcon,
    title: "Upload your event photos",
    description:
      "After the event, go to the event detail page and upload photos in batches. Face detection and matching run automatically in the background.",
  },
  {
    icon: Sparkles,
    title: "Guests receive their personal gallery",
    description:
      "Once matching completes, every guest is emailed a link to their own gallery — only the photos they appear in. They can download individually or as a ZIP.",
  },
];

const faqs = [
  {
    question: "How does face matching work?",
    answer:
      "When a guest registers, we extract a 128-dimensional face descriptor from their selfie using TensorFlow.js. When you upload event photos, we detect every face in every photo and compare it against all registered guest descriptors. If the distance between two faces is below our threshold, it's a match.",
  },
  {
    question: "Why didn't a guest receive their photos?",
    answer:
      "The most common reasons are: (1) the guest's selfie was too blurry, too dark, or not a frontal face; (2) the guest's face in event photos was obscured, at an extreme angle, or too small; (3) the guest registered after you uploaded photos — try re-running matching from the event detail page using the 'Start Matching' button.",
  },
  {
    question: "Can I re-run face matching after adding more guests?",
    answer:
      "Yes. Open the event detail page and use the manual matching trigger. It will re-process all unmatched photos against current registered guests. This is useful when guests register late.",
  },
  {
    question: "What photo formats are supported?",
    answer:
      "JPEG, PNG, and WebP are all supported. Photos are automatically compressed to 1600px max-dimension and 85% JPEG quality before upload to save quota and processing time. RAW and HEIC formats are not supported — export to JPEG first.",
  },
  {
    question: "How long is guest data stored?",
    answer:
      "Guest selfies and face descriptors are automatically deleted 10 days after event creation. Photo URLs and match records are retained until you delete the event. Guests are informed of this retention period during registration.",
  },
  {
    question: "What's the difference between Basic, Pro, and Premium plans?",
    answer:
      "Plans differ in the number of photo uploads allowed per billing cycle: Starter (500), Pro (2,000), and Premium (10,000). All plans support unlimited events and guests. Upgrade at any time from the Billing page — quota resets at the start of each new billing period.",
  },
  {
    question: "Why are some photos taking a long time to process?",
    answer:
      "Face detection is CPU-intensive. Photos are processed in a background queue — typically 10–30 seconds per photo depending on server load. The event detail page shows how many photos are still pending. Guests will be emailed automatically once all processing and matching is complete.",
  },
  {
    question: "Can guests download their photos without registering?",
    answer:
      "No. Guests must register with a selfie to receive matched photos. This is intentional: the selfie is how we identify which photos belong to them. Guests who miss registration cannot be matched to existing photos unless they register and you re-run matching.",
  },
];

const tips = [
  {
    icon: SunMedium,
    title: "Lighting matters most",
    body: "Ask guests to take their selfie facing a light source, not with a window or lamp behind them. Backlit selfies are the #1 cause of failed matches.",
  },
  {
    icon: Camera,
    title: "Encourage early registration",
    body: "Share the registration link in the event invite, not just at the door. Guests who pre-register with a good selfie have a much higher match rate.",
  },
  {
    icon: Zap,
    title: "Upload in batches under 100",
    body: "Uploading 50–100 photos at a time gives faster feedback and more reliable processing than a single 300-photo batch. Each batch is queued independently.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HelpPage() {
  return (
    <div className="space-y-10">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-950">Help &amp; Support</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Guides, FAQs, and tips for getting the best results from Gopo.
          </p>
        </div>
        <a
          href="mailto:support@hellobj.me"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
        >
          <Mail className="h-4 w-4" />
          Email Support
        </a>
      </div>

      {/* ── Getting started ── */}
      <section>
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">
            Quick Start
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-950">
            From zero to delivered gallery in 4 steps.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step, i) => (
            <Step key={step.title} number={i + 1} {...step} />
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-2">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">
            FAQ
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-950">
            Frequently asked questions.
          </h2>
        </div>
        <div className="mt-4">
          {faqs.map((faq) => (
            <FAQ key={faq.question} {...faq} />
          ))}
        </div>
      </section>

      {/* ── Tips ── */}
      <section>
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">
            Pro Tips
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-950">
            Get better match rates.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {tips.map((tip) => (
            <Tip key={tip.title} {...tip} />
          ))}
        </div>
      </section>

      {/* ── Still need help ── */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">
            Contact
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-950">
            Still need help?
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="mailto:support@hellobj.me"
            className="group flex items-start gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition hover:border-zinc-300 hover:bg-white"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-md">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-zinc-900">Email us</p>
              <p className="mt-1 text-sm text-zinc-500">
                support@hellobj.me — we respond within 24 hours on business days.
              </p>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-zinc-900">Quick actions</p>
              <div className="mt-2 flex flex-col gap-1.5">
                <Link
                  href="/admin/events"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  View your events
                </Link>
                <Link
                  href="/admin/billing"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Upgrade your plan
                </Link>
                <Link
                  href="/admin/analytics"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  Check analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
