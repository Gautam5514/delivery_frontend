"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import PremiumFooter from "@/components/landing/PremiumFooter";
import PhotographerWordmarkSection from "@/components/landing/PhotographerWordmarkSection";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { allBlogPosts } from "./posts";

const [heroPost, secondPost, thirdPost, ...gridPosts] = allBlogPosts;

const categories = [
  "All",
  ...Array.from(new Set(allBlogPosts.map((p) => p.category))),
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? gridPosts
      : gridPosts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <main className="px-4 pb-24 pt-4 sm:px-6 lg:px-8">

        {/* ── Editorial Header ── */}
        <section className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-xl border border-zinc-100 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 px-8 py-14 sm:px-14 sm:py-18">
            {/* decorative circles */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-zinc-100" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-zinc-100" />

            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-zinc-800" />
                  FaceDeliver Journal
                </span>
                <h1 className="mt-6 text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
                  Ideas for smarter
                  <br />
                  <span className="text-zinc-300">event experiences.</span>
                </h1>
              </div>

              <div className="max-w-sm shrink-0">
                <p className="text-base leading-7 text-zinc-600">
                  Premium guides on AI matching, event workflows, privacy, and
                  guest gallery experiences — crafted by the FaceDeliver team.
                </p>
                <div className="mt-6 flex flex-wrap gap-5 text-sm text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {allBlogPosts.length} Articles
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    Expert Authors
                  </span>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" />
                    Weekly Updates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Magazine Feature Layout ── */}
        <section className="mx-auto mt-8 max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-[1.65fr_1fr]">

            {/* Main hero card */}
            <Link
              href={`/blog/${heroPost.slug}`}
              className="group relative min-h-[480px] overflow-hidden rounded-xl bg-zinc-900"
            >
              <img
                src={heroPost.cover}
                alt={heroPost.coverAlt || heroPost.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white/20 px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                    {heroPost.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-white/60">
                    <Clock className="h-3 w-3" />
                    {heroPost.readTime}
                  </span>
                </div>
                <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  {heroPost.title}
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-white/72">
                  {heroPost.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 rounded bg-white px-5 py-2.5 text-xs font-semibold text-zinc-900 transition group-hover:bg-zinc-100">
                  Read Article <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>

            {/* Two stacked secondary cards */}
            <div className="flex flex-col gap-5">
              {[secondPost, thirdPost].map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group relative flex-1 overflow-hidden rounded-xl bg-zinc-900"
                  style={{ minHeight: "225px" }}
                >
                  <img
                    src={post.cover}
                    alt={post.coverAlt || post.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/60">
                      {post.category} · {post.readTime}
                    </span>
                    <h3 className="mt-1.5 text-lg font-semibold leading-snug">
                      {post.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-white/60 transition group-hover:text-white">
                      Read article <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── All Articles + Category Filter ── */}
        <section className="mx-auto mt-20 max-w-7xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-400">
                All Articles
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                The full playbooks.
              </h2>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
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

          {/* Cards grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-xl"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-52 overflow-hidden bg-zinc-100">
                    <img
                      src={post.cover}
                      alt={post.coverAlt || post.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-800 shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                    <span>{post.date}</span>
                    <span>·</span>
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="mt-3 text-xl font-semibold leading-snug text-zinc-950 transition group-hover:text-zinc-700">
                    {post.title}
                  </h2>

                  <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-zinc-500">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="text-xs font-medium text-zinc-400">
                      By {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 rounded bg-zinc-950 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-zinc-700"
                    >
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-3 py-20 text-center text-zinc-400">
                No articles in this category yet.
              </div>
            )}
          </div>
        </section>

        {/* ── Newsletter CTA ── */}
        <section className="mx-auto mt-20 max-w-7xl">
          <div className="relative overflow-hidden rounded-xl bg-zinc-950 px-8 py-16 text-center sm:px-14">
            {/* decorative */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/[0.03]" />
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/[0.03]" />

            <span className="relative inline-block rounded-full border border-zinc-700 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
              Stay in the loop
            </span>
            <h2 className="relative mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Get the latest from FaceDeliver Journal.
            </h2>
            <p className="relative mt-4 mx-auto max-w-md text-base leading-7 text-zinc-400">
              Premium insights on AI photo delivery, event workflows, and guest
              experience — straight to your inbox.
            </p>
            <div className="relative mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full max-w-sm rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-zinc-400 sm:w-auto"
              />
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100">
                Subscribe Free
              </button>
            </div>
            <p className="relative mt-4 text-xs text-zinc-600">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>

      <PremiumFooter />
      <PhotographerWordmarkSection />
    </div>
  );
}
