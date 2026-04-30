import Link from "next/link";

export function StaticPageHero({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}) {
  return (
    <section className="px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-xl border border-zinc-200/80 bg-zinc-50/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="rounded bg-zinc-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="rounded border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-900 transition hover:bg-zinc-100"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function StaticPageHighlights({ heading, items }) {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {heading}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-zinc-200 bg-white p-7"
            >
              <h3 className="text-xl font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-3 text-zinc-600 leading-7">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StaticPageCallout({ title, description, ctaHref, ctaLabel }) {
  return (
    <section className="px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-xl border border-zinc-200 bg-white p-8 sm:p-10">
        <h3 className="text-3xl font-semibold text-zinc-900">{title}</h3>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">
          {description}
        </p>
        <Link
          href={ctaHref}
          className="mt-7 inline-flex rounded bg-zinc-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
