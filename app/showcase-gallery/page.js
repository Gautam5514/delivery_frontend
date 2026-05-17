"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import PremiumFooter from "@/components/landing/PremiumFooter";
import PhotographerWordmarkSection from "@/components/landing/PhotographerWordmarkSection";
import {
  ArrowRight,
  Camera,
  Check,
  Crown,
  Download,
  Eye,
  Image as ImageIcon,
  Lock,
  QrCode,
  Scan,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

// ── Gallery data ──────────────────────────────────────────────────────────────
const GALLERY_ITEMS = [
  {
    id: 1,
    category: "Wedding",
    event: "Sharma Wedding — Jaipur",
    photos: 2840,
    guests: 412,
    cover: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1400&auto=format&fit=crop",
    aspect: "tall",
  },
  {
    id: 2,
    category: "Corporate",
    event: "TechSummit 2026 — Delhi",
    photos: 1560,
    guests: 890,
    cover: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1400&auto=format&fit=crop",
    aspect: "wide",
  },
  {
    id: 3,
    category: "College",
    event: "Farewell Night — IIT Bombay",
    photos: 3200,
    guests: 1100,
    cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1400&auto=format&fit=crop",
    aspect: "square",
  },
  {
    id: 4,
    category: "Wedding",
    event: "Mehta & Priya — Udaipur Palace",
    photos: 4100,
    guests: 680,
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop",
    aspect: "tall",
  },
  {
    id: 5,
    category: "Social",
    event: "Annual Gala — Mumbai",
    photos: 980,
    guests: 320,
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1400&auto=format&fit=crop",
    aspect: "wide",
  },
  {
    id: 6,
    category: "Corporate",
    event: "Product Launch — Bangalore",
    photos: 740,
    guests: 220,
    cover: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1400&auto=format&fit=crop",
    aspect: "square",
  },
  {
    id: 7,
    category: "School",
    event: "Annual Day — DPS Vasant Kunj",
    photos: 1890,
    guests: 540,
    cover: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1400&auto=format&fit=crop",
    aspect: "wide",
  },
  {
    id: 8,
    category: "College",
    event: "Cultural Fest — NIT Trichy",
    photos: 2600,
    guests: 1400,
    cover: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=1400&auto=format&fit=crop",
    aspect: "tall",
  },
  {
    id: 9,
    category: "Social",
    event: "Award Night — Hyderabad",
    photos: 1120,
    guests: 280,
    cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1400&auto=format&fit=crop",
    aspect: "square",
  },
];

const CATEGORY_TABS = ["All", "Wedding", "Corporate", "College", "School", "Social"];

// ── Event category showcase ───────────────────────────────────────────────────
const EVENT_CATEGORIES = [
  {
    label: "Weddings",
    tagline: "Every moment, every guest.",
    description:
      "From haldi to reception — every frame delivered privately to each guest within hours. No shared albums, no chaos.",
    cover: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop",
    stat: "4,000+ photos · 98% match rate",
  },
  {
    label: "Corporate",
    tagline: "On-brand. On-time.",
    description:
      "Conferences, award nights, and product launches — delivered with clean UI that matches your company's standards.",
    cover: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
    stat: "500–5,000 guests · Same-day delivery",
  },
  {
    label: "College & School",
    tagline: "Memories for everyone.",
    description:
      "Fests, farewells, annual days — students and parents get personal galleries without sorting through thousands of shots.",
    cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    stat: "1,000–5,000 attendees · QR check-in",
  },
];

// ── Plans ─────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: "Starter",
    price: "₹999",
    period: "/ month",
    tagline: "For individual photographers",
    uploadLimit: "1,500 photos",
    features: [
      "1,500 photos / month",
      "AI face matching",
      "Private guest galleries",
      "QR registration",
      "Basic analytics",
      "Email support",
    ],
    cta: "Get Started",
    highlight: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "₹2,999",
    period: "/ month",
    tagline: "For growing studios",
    uploadLimit: "6,000 photos",
    features: [
      "6,000 photos / month",
      "AI face matching",
      "Private guest galleries",
      "QR registration",
      "Advanced analytics",
      "Download all as ZIP",
      "Priority support",
      "Custom event branding",
    ],
    cta: "Start Pro",
    highlight: false,
    badge: "Most Popular",
  },
  {
    name: "Studio",
    price: "₹7,999",
    period: "/ month",
    tagline: "For large-scale events",
    uploadLimit: "20,000 photos",
    features: [
      "20,000 photos / month",
      "AI face matching",
      "Private guest galleries",
      "QR registration",
      "Full delivery analytics",
      "Download all as ZIP",
      "Dedicated account manager",
      "Custom event branding",
      "Multi-event management",
      "SLA-backed response",
    ],
    cta: "Go Studio",
    highlight: true,
    badge: "Best Value",
  },
];

// ── How it works steps ────────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    icon: QrCode,
    step: "01",
    title: "Guests scan QR",
    detail:
      "A unique QR code is placed at the venue. Guests scan it and register with a quick selfie — takes under 30 seconds.",
  },
  {
    icon: Scan,
    step: "02",
    title: "AI scans every photo",
    detail:
      "Our engine scans the full event album, matches every face against registered selfies, and builds personal galleries automatically.",
  },
  {
    icon: ImageIcon,
    step: "03",
    title: "Private gallery delivered",
    detail:
      "Each guest receives a private, password-free gallery link — only their photos, beautifully presented and ready to download.",
  },
];

const STATS = [
  { value: "500+", label: "Events delivered" },
  { value: "2M+", label: "Photos matched" },
  { value: "98%", label: "Match accuracy" },
  { value: "< 2 hrs", label: "Average delivery" },
];

export default function ShowcaseGalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((g) => g.category === activeCategory);

  // Build 3 masonry columns
  const cols = [[], [], []];
  filtered.forEach((item, i) => cols[i % 3].push(item));

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <main className="pb-24">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-zinc-950 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-white/[0.03]" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-white/[0.02]" />

          {/* Floating photo strips — decorative */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute left-4 top-24 flex flex-col gap-3 -rotate-6">
              {["photo-1519741497674-611481863552", "photo-1511285560929-80b456fea0bc", "photo-1541339907198-e08756dedf3f"].map((id) => (
                <img key={id} src={`https://images.unsplash.com/${id}?q=60&w=160&auto=format&fit=crop`} alt="" className="h-28 w-24 rounded-xl object-cover" />
              ))}
            </div>
            <div className="absolute right-4 top-12 flex flex-col gap-3 rotate-6">
              {["photo-1511578314322-379afb476865", "photo-1540575467063-178a50c2df87", "photo-1492684223066-81342ee5ff30"].map((id) => (
                <img key={id} src={`https://images.unsplash.com/${id}?q=60&w=160&auto=format&fit=crop`} alt="" className="h-28 w-24 rounded-xl object-cover" />
              ))}
            </div>
          </div>

          <div className="relative mx-auto max-w-4xl pt-16 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              Gopo Gallery Showcase
            </span>

            <h1 className="mt-7 text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Premium galleries for
              <br />
              <span className="text-zinc-400">every event, every guest.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
              See how Gopo delivers AI-matched, private photo galleries for weddings,
              corporate events, college fests, and more — all from a single QR scan.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                Start Your Event
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/12"
              >
                Talk to Us
              </Link>
            </div>

            {/* Stats strip */}
            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-white/[0.04] px-6 py-5 text-center">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Gallery Grid ─────────────────────────────────────────────── */}
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-400">
                Event Gallery
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                Real events. Real results.
              </h2>
            </div>
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {CATEGORY_TABS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                    activeCategory === cat
                      ? "bg-zinc-950 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry */}
          <div className="mt-8 flex gap-5">
            {cols.map((col, ci) => (
              <div key={ci} className="flex flex-1 flex-col gap-5">
                {col.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-xl bg-zinc-100"
                    style={{
                      aspectRatio:
                        item.aspect === "tall"
                          ? "3/4"
                          : item.aspect === "wide"
                          ? "4/3"
                          : "1/1",
                    }}
                  >
                    <img
                      src={item.cover}
                      alt={item.event}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Category badge — always visible */}
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-900 shadow-sm">
                      {item.category}
                    </span>

                    {/* Hover info */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-sm font-semibold leading-tight">{item.event}</p>
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-white/70">
                        <span className="flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          {item.photos.toLocaleString()} photos
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {item.guests.toLocaleString()} guests
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold backdrop-blur-sm">
                          <Eye className="h-3 w-3" /> View Gallery
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold backdrop-blur-sm">
                          <Download className="h-3 w-3" /> Download All
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-zinc-400">
              No galleries in this category yet.
            </div>
          )}
        </section>

        {/* ── Event Categories ─────────────────────────────────────────── */}
        <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-400">
              Event Types
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              A gallery for every occasion.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-500">
              Whether it's an intimate wedding or a 5,000-person conference, Gopo
              handles the entire photo delivery pipeline automatically.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {EVENT_CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="group relative overflow-hidden rounded-xl bg-zinc-900"
              >
                <img
                  src={cat.cover}
                  alt={cat.label}
                  className="h-72 w-full object-cover opacity-60 transition duration-700 group-hover:opacity-75 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/50">
                    {cat.stat}
                  </span>
                  <h3 className="mt-1.5 text-2xl font-semibold">{cat.label}</h3>
                  <p className="mt-1 text-sm italic text-white/60">{cat.tagline}</p>
                  <p className="mt-3 text-sm leading-6 text-white/70">{cat.description}</p>
                  <Link
                    href="/register"
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    Launch this type <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 px-8 py-14 sm:px-14">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-400">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
                From QR scan to personal gallery.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-500">
                Gopo handles everything automatically — your guests just scan once and
                receive their private gallery within hours.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {HOW_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="relative rounded-xl border border-zinc-200 bg-white p-7"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950">
                      <step.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-4xl font-bold text-zinc-100">{step.step}</span>
                  </div>
                  <h3 className="text-base font-semibold text-zinc-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{step.detail}</p>
                </div>
              ))}
            </div>

            {/* Mini feature chips */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                { icon: Lock, text: "Private access — no shared albums" },
                { icon: Zap, text: "AI matching in real-time" },
                { icon: Download, text: "One-click download for every guest" },
                { icon: TrendingUp, text: "Admin delivery analytics" },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-600"
                >
                  <Icon className="h-3.5 w-3.5 text-zinc-500" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Guest experience mockup ───────────────────────────────────── */}
        <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-400">
                Guest Experience
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                What your guests
                <br />
                <span className="text-zinc-300">actually see.</span>
              </h2>
              <p className="mt-5 text-base leading-7 text-zinc-600">
                After scanning the QR, each guest lands on a clean, private gallery
                showing only their own photos. No login, no passwords, no confusion.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Personal gallery with only their matched photos",
                  "Download individual photos or full ZIP",
                  "Mobile-first, works on any device",
                  "Face-verified private access — no public link",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-zinc-700">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-950">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Create an Event <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Phone-style mockup */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <div className="overflow-hidden rounded-3xl border-4 border-zinc-950 bg-zinc-950 shadow-2xl shadow-zinc-300/40">
                  {/* Status bar */}
                  <div className="flex items-center justify-between bg-zinc-950 px-5 py-2">
                    <span className="text-[10px] font-semibold text-white/50">9:41</span>
                    <div className="h-4 w-20 rounded-full bg-zinc-800" />
                    <span className="text-[10px] font-semibold text-white/50">●●●</span>
                  </div>

                  {/* App UI */}
                  <div className="bg-white">
                    {/* Header */}
                    <div className="border-b border-zinc-100 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white">
                          R
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                            Personal Gallery
                          </p>
                          <p className="text-sm font-semibold text-zinc-950">
                            Rahul's Collection
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats bar */}
                    <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3 text-xs text-zinc-500">
                      <span className="font-semibold text-zinc-950">24 photos matched</span>
                      <span className="flex items-center gap-1 rounded-full bg-zinc-950 px-3 py-1 text-[10px] font-semibold text-white">
                        <Download className="h-3 w-3" /> Download All
                      </span>
                    </div>

                    {/* Masonry grid mockup */}
                    <div className="grid grid-cols-3 gap-1 p-2">
                      {[
                        "photo-1519741497674-611481863552",
                        "photo-1511285560929-80b456fea0bc",
                        "photo-1541339907198-e08756dedf3f",
                        "photo-1492684223066-81342ee5ff30",
                        "photo-1511578314322-379afb476865",
                        "photo-1540575467063-178a50c2df87",
                      ].map((id, idx) => (
                        <div
                          key={id}
                          className={`overflow-hidden rounded-lg bg-zinc-100 ${
                            idx === 0 || idx === 4 ? "row-span-1" : ""
                          }`}
                        >
                          <img
                            src={`https://images.unsplash.com/${id}?q=60&w=200&auto=format&fit=crop`}
                            alt=""
                            className="h-24 w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="px-4 pb-4 pt-1">
                      <div className="rounded-xl bg-zinc-950 py-3 text-center text-xs font-semibold text-white">
                        View All 24 Photos
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="mt-4 flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-600 shadow-sm">
                    <Lock className="h-3.5 w-3.5 text-zinc-400" />
                    Face-verified private access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Plans ────────────────────────────────────────────────────── */}
        <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-400">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Choose the right plan.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-zinc-500">
              Start small or go all-in. Every plan includes AI matching, private
              galleries, and QR registration — no hidden charges.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col overflow-hidden rounded-xl border ${
                  plan.highlight
                    ? "border-zinc-900 bg-zinc-950 text-white"
                    : "border-zinc-200 bg-white text-zinc-900"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className={`absolute right-5 top-5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      plan.highlight
                        ? "bg-white/15 text-white"
                        : "bg-zinc-950 text-white"
                    }`}
                  >
                    {plan.highlight && <Crown className="h-3 w-3" />}
                    {plan.badge}
                  </div>
                )}

                <div className="flex flex-1 flex-col p-8">
                  <div>
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${
                        plan.highlight ? "text-zinc-400" : "text-zinc-400"
                      }`}
                    >
                      {plan.name}
                    </p>
                    <div className="mt-3 flex items-end gap-1">
                      <span className="text-4xl font-semibold tracking-tight">
                        {plan.price}
                      </span>
                      <span
                        className={`mb-1 text-sm ${
                          plan.highlight ? "text-zinc-400" : "text-zinc-400"
                        }`}
                      >
                        {plan.period}
                      </span>
                    </div>
                    <p
                      className={`mt-2 text-sm ${
                        plan.highlight ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Divider */}
                  <div
                    className={`my-7 h-px ${
                      plan.highlight ? "bg-white/10" : "bg-zinc-100"
                    }`}
                  />

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm">
                        <div
                          className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${
                            plan.highlight ? "bg-white/15" : "bg-zinc-950"
                          }`}
                        >
                          <Check
                            className={`h-2.5 w-2.5 ${
                              plan.highlight ? "text-white" : "text-white"
                            }`}
                          />
                        </div>
                        <span
                          className={
                            plan.highlight ? "text-zinc-300" : "text-zinc-700"
                          }
                        >
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/register"
                    className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition ${
                      plan.highlight
                        ? "bg-white text-zinc-950 hover:bg-zinc-100"
                        : "bg-zinc-950 text-white hover:bg-zinc-800"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Trust note */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
            {["No setup fees", "Cancel anytime", "50% launch discount active"].map((note) => (
              <span key={note} className="flex items-center gap-2">
                <Star className="h-3.5 w-3.5 fill-zinc-300 text-zinc-300" />
                {note}
              </span>
            ))}
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────── */}
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl bg-zinc-950 px-8 py-20 text-center sm:px-14">
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/[0.03]" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/[0.03]" />

            <span className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              Start Today
            </span>
            <h2 className="relative mt-6 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Ready to deliver premium
              <br />
              galleries for your guests?
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-lg leading-8 text-zinc-400">
              Set up your first event in minutes. No technical knowledge needed —
              just upload photos and let Gopo handle everything.
            </p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                Talk to Our Team
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PremiumFooter />
      <PhotographerWordmarkSection />
    </div>
  );
}
