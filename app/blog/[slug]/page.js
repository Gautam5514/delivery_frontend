import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import PremiumFooter from "@/components/landing/PremiumFooter";
import PhotographerWordmarkSection from "@/components/landing/PhotographerWordmarkSection";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Clock } from "lucide-react";
import { allBlogPosts } from "../posts";
import BlogDetailClient from "./BlogDetailClient";
import { buildMetadata, SITE_URL, SITE_NAME } from "../../seo.config";

export function generateStaticParams() {
  return allBlogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = allBlogPosts.find((item) => item.slug === slug);
  if (!post) return { title: "Blog Not Found" };
  return buildMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.cover,
    keywords: post.keywords,
    type: "article",
    publishedTime: post.isoDate,
    authors: post.author ? [post.author] : undefined,
  });
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const categoryColors = {
  Workflow: "bg-blue-50 text-blue-700 border-blue-100",
  Security: "bg-red-50 text-red-700 border-red-100",
  Design: "bg-purple-50 text-purple-700 border-purple-100",
  Operations: "bg-orange-50 text-orange-700 border-orange-100",
  Business: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Checklist: "bg-yellow-50 text-yellow-700 border-yellow-100",
  AI: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Engagement: "bg-pink-50 text-pink-700 border-pink-100",
  Quality: "bg-teal-50 text-teal-700 border-teal-100",
  Scale: "bg-cyan-50 text-cyan-700 border-cyan-100",
  Experience: "bg-rose-50 text-rose-700 border-rose-100",
  Future: "bg-violet-50 text-violet-700 border-violet-100",
  Wedding: "bg-pink-50 text-pink-700 border-pink-100",
  Schools: "bg-sky-50 text-sky-700 border-sky-100",
  Corporate: "bg-slate-50 text-slate-700 border-slate-100",
  College: "bg-amber-50 text-amber-700 border-amber-100",
  Founder: "bg-zinc-100 text-zinc-800 border-zinc-200",
};

const absoluteUrl = (src) =>
  !src ? undefined : src.startsWith("http") ? src : `${SITE_URL}${src}`;

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = allBlogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  const relatedPosts = allBlogPosts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 6);

  const catClass =
    categoryColors[post.category] ?? "bg-zinc-100 text-zinc-700 border-zinc-200";

  const profile = post.authorProfile;
  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  const authorNode = profile
    ? {
        "@type": "Person",
        "@id": `${postUrl}#author`,
        name: profile.name,
        jobTitle: profile.jobTitle,
        description: profile.bio,
        image: absoluteUrl(profile.image),
        url: profile.url || postUrl,
        sameAs: profile.sameAs,
        worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      }
    : { "@type": "Organization", name: post.author || SITE_NAME };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: absoluteUrl(post.cover),
    datePublished: post.isoDate || post.date,
    dateModified: post.isoDate || post.date,
    keywords: post.keywords?.join(", "),
    author: authorNode,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.webp` },
    },
    mainEntityOfPage: postUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  const faqJsonLd = post.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const personJsonLd = profile
    ? { "@context": "https://schema.org", ...authorNode }
    : null;

  const schemas = [articleJsonLd, breadcrumbJsonLd, faqJsonLd, personJsonLd].filter(
    Boolean
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Navbar />

      {/* Reading progress bar — client only */}
      <BlogDetailClient />

      <main className="px-4 pb-20 pt-4 sm:px-6 lg:px-8">

        {/* ── Hero Banner ── */}
        <section className="mx-auto max-w-7xl overflow-hidden rounded-xl shadow-lg">
          <div className="relative min-h-[500px] bg-zinc-900">
            <img
              src={post.cover}
              alt={post.coverAlt || post.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/94 via-black/40 to-black/10" />
            <div className="relative flex min-h-[500px] flex-col justify-end p-7 text-white sm:p-12">
              <Link
                href="/blog"
                className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Journal
              </Link>

              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full border px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${catClass}`}
                  >
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  {post.title}
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Article + Sidebar ── */}
        <section className="mx-auto mt-10 grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">

          {/* Article */}
          <article className="rounded-xl border border-zinc-100 bg-white p-7 shadow-sm sm:p-12">

            {/* Author row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-7">
              <div className="flex items-center gap-3">
                {profile?.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-zinc-200"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white">
                    {getInitials(post.author)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {post.author}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {profile?.role ?? "FaceDeliver Team"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  {post.readTime}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="mt-10 space-y-12">
              {post.content.map((section, i) => (
                <section key={section.heading}>
                  {i === 0 ? (
                    <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                      {section.heading}
                    </h2>
                  ) : (
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                      {section.heading}
                    </h2>
                  )}

                  <div className="mt-5 space-y-5">
                    {section.paragraphs.map((para, j) => (
                      <p
                        key={j}
                        className={`leading-8 text-zinc-700 ${
                          i === 0 && j === 0 ? "text-lg" : "text-base"
                        }`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* FAQ */}
            {post.faqs?.length > 0 && (
              <div className="mt-14 border-t border-zinc-100 pt-10">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                  Frequently asked questions
                </h2>
                <div className="mt-6 space-y-3">
                  {post.faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-xl border border-zinc-200 bg-zinc-50/60 px-5 py-4 transition open:bg-white open:shadow-sm"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">
                        {faq.question}
                        <span className="inline-block shrink-0 text-xl font-normal leading-none text-zinc-400 transition group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-[15px] leading-7 text-zinc-600">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="mt-12 border-t border-zinc-100 pt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Tagged
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(post.keywords?.length
                  ? post.keywords
                  : [post.category, "FaceDeliver", "Event Photography"]
                ).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-medium text-zinc-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author card */}
            <div className="mt-8 flex flex-col items-start gap-5 rounded-xl border border-zinc-100 bg-zinc-50 p-6 sm:flex-row">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="h-20 w-20 shrink-0 rounded-full object-cover ring-1 ring-zinc-200"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-base font-bold text-white">
                  {getInitials(post.author)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900">
                  Written by {post.author}
                </p>
                {profile?.role && (
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
                    {profile.role}
                  </p>
                )}
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {profile?.bio ??
                    "Part of the FaceDeliver team, crafting guides on AI event photo delivery, workflows, and guest experience."}
                </p>

                {profile?.social?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.social.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="me noopener noreferrer"
                        className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Back */}
            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all articles
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">

            {/* Read Next */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-5">
              <div className="px-1 pb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  Read Next
                </p>
                <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-950">
                  More from the Journal
                </h2>
              </div>

              <div className="space-y-3">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="group grid grid-cols-[88px_1fr] gap-3 rounded-xl border border-zinc-200 bg-white p-2.5 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="h-[72px] w-[88px] rounded-xl object-cover"
                    />
                    <span className="flex min-w-0 flex-col justify-center">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                        {item.category}
                      </span>
                      <span className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-zinc-900">
                        {item.title}
                      </span>
                      <span className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-zinc-400 transition group-hover:text-zinc-900">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter mini CTA */}
            <div className="mt-5 rounded-xl bg-zinc-950 p-6 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Newsletter
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Get articles like this.
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Weekly insights from the FaceDeliver team.
              </p>
              <div className="mt-5 space-y-2.5">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-zinc-500"
                />
                <button className="w-full rounded-full bg-white py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100">
                  Subscribe Free
                </button>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <PremiumFooter />
      <PhotographerWordmarkSection />
    </div>
  );
}
