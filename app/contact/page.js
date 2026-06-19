"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import PremiumFooter from "@/components/landing/PremiumFooter";
import PhotographerWordmarkSection from "@/components/landing/PhotographerWordmarkSection";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Heart,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const EVENT_TYPES = [
  "Wedding",
  "Corporate Event",
  "College Fest",
  "School Event",
  "Product Launch",
  "Concert / Show",
  "Other",
];

const GUEST_RANGES = [
  "Under 100",
  "100 – 500",
  "500 – 1,000",
  "1,000 – 5,000",
  "5,000+",
];

const STEPS = [
  {
    icon: Mail,
    label: "We review your enquiry",
    detail: "Usually within a few hours of receiving it.",
  },
  {
    icon: Phone,
    label: "Our team reaches out",
    detail: "Personalized call or message — no bots, no templates.",
  },
  {
    icon: CalendarCheck,
    label: "We design your event flow",
    detail: "QR setup, gallery experience, and delivery plan built together.",
  },
];

const TRUST_CARDS = [
  {
    icon: Zap,
    title: "Quick Response",
    description:
      "We respond to every enquiry within 24 hours — often much sooner.",
  },
  {
    icon: Heart,
    title: "Personal Attention",
    description:
      "Every event is different. You'll work with a real FaceDeliver team member.",
  },
  {
    icon: Users,
    title: "End-to-End Support",
    description:
      "From QR registration to guest gallery delivery — we're with you throughout.",
  },
];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  expectedGuests: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverMsg, setServerMsg] = useState("");

  function set(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Your name is required.";
    if (!form.email.trim()) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email.";
    if (!form.message.trim()) errs.message = "Tell us a bit about your event.";
    else if (form.message.trim().length < 10)
      errs.message = "Message should be at least 10 characters.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("success");
        setForm(EMPTY);
      }
    } catch {
      setServerMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder-zinc-400 focus:ring-2 focus:ring-zinc-900/10 ${
      errors[field]
        ? "border-red-300 focus:border-red-400"
        : "border-zinc-200 focus:border-zinc-400"
    }`;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <main className="px-4 pb-24 pt-4 sm:px-6 lg:px-8">

        {/* ── Two-Panel Hero ── */}
        <section className="mx-auto max-w-7xl overflow-hidden rounded-xl border border-zinc-100 lg:grid lg:grid-cols-[1fr_1.1fr]">

          {/* Left — Dark info panel */}
          <div className="relative overflow-hidden bg-zinc-950 px-8 py-14 sm:px-12 sm:py-16">
            {/* decorative rings */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border border-white/[0.06]" />
            <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full border border-white/[0.05]" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full border border-white/[0.05]" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                <Sparkles className="h-3.5 w-3.5 text-white" />
                Get in Touch
              </span>

              <h1 className="mt-7 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                Let's build your event
                <br />
                <span className="text-zinc-400">experience together.</span>
              </h1>

              <p className="mt-5 text-base leading-7 text-zinc-400">
                Tell us about your event. We'll design the right QR flow, AI
                matching setup, and guest gallery experience for you.
              </p>

              {/* Contact details */}
              <div className="mt-10 space-y-4">
                <a
                  href="mailto:connect@triplehash.in"
                  className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 px-5 py-4 transition hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Mail className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Email us
                    </p>
                    <p className="text-sm font-medium text-white">
                      hellobj16@gmail.com
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Clock className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Response time
                    </p>
                    <p className="text-sm font-medium text-white">
                      Within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <MapPin className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Serving
                    </p>
                    <p className="text-sm font-medium text-white">
                      Events across India
                    </p>
                  </div>
                </div>
              </div>

              {/* What happens next */}
              <div className="mt-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  What happens next
                </p>
                <ol className="mt-5 space-y-5">
                  {STEPS.map((step, i) => (
                    <li key={step.label} className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/8 text-xs font-bold text-zinc-300">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {step.label}
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-zinc-500">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Right — Form panel */}
          <div className="bg-white px-8 py-14 sm:px-12 sm:py-16">
            {status === "success" ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-950">
                  <CheckCircle2 className="h-9 w-9 text-white" />
                </div>
                <h2 className="mt-7 text-2xl font-semibold tracking-tight text-zinc-950">
                  Message received!
                </h2>
                <p className="mt-3 max-w-sm text-base leading-7 text-zinc-500">
                  Thank you for reaching out. We'll review your enquiry and get
                  back to you personally within 24 hours.
                </p>
                <p className="mt-3 text-sm text-zinc-400">
                  Check your inbox — we've sent you a confirmation.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-6 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    Contact Form
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                    Tell us about your event.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Fill in the details below and we'll take it from there.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Gautam Pandit"
                        value={form.name}
                        onChange={set("name")}
                        className={inputClass("name")}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={set("email")}
                        className={inputClass("email")}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone + Event Type */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 *****"
                        value={form.phone}
                        onChange={set("phone")}
                        className={inputClass("phone")}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                        Event Type
                      </label>
                      <select
                        value={form.eventType}
                        onChange={set("eventType")}
                        className={`${inputClass("eventType")} cursor-pointer`}
                      >
                        <option value="">Select event type</option>
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Expected Guests */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                      Expected Guests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {GUEST_RANGES.map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              expectedGuests:
                                prev.expectedGuests === range ? "" : range,
                            }))
                          }
                          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                            form.expectedGuests === range
                              ? "border-zinc-900 bg-zinc-950 text-white"
                              : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                      How can we help? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us about your event — date, location, what you're looking for..."
                      value={form.message}
                      onChange={set("message")}
                      className={`${inputClass("message")} resize-none`}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>
                    )}
                  </div>

                  {/* Server error */}
                  {status === "error" && serverMsg && (
                    <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {serverMsg}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Enquiry
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs leading-5 text-zinc-400">
                    We respect your privacy. Your details are never shared or sold.
                  </p>
                </form>
              </>
            )}
          </div>
        </section>

        {/* ── Trust Cards ── */}
        <section className="mx-auto mt-10 max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {TRUST_CARDS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-xl border border-zinc-100 bg-zinc-50 px-7 py-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-950">{title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-zinc-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="mx-auto mt-10 max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-zinc-100 bg-zinc-50 px-8 py-10 sm:flex-row sm:px-12">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                Ready to start?
              </p>
              <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-950">
                Or create your event directly.
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Set up an admin account and launch your first QR event in minutes.
              </p>
            </div>
            <a
              href="/register"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <PremiumFooter />
      <PhotographerWordmarkSection />
    </div>
  );
}
