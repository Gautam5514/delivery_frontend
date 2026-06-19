import Navbar from "@/components/landing/Navbar";
import PremiumFooter from "@/components/landing/PremiumFooter";
import PhotographerWordmarkSection from "@/components/landing/PhotographerWordmarkSection";
import {
  CheckCircle2,
  Clock3,
  Fingerprint,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Trash2,
} from "lucide-react";

const lastUpdated = "April 27, 2026";

const summaryItems = [
  {
    icon: LockKeyhole,
    label: "Access",
    value: "Private guest galleries",
  },
  {
    icon: Fingerprint,
    label: "Face data",
    value: "Used only for matching",
  },
  {
    icon: Clock3,
    label: "Retention",
    value: "10 day cleanup workflow",
  },
  {
    icon: Trash2,
    label: "Deletion",
    value: "Guest removal supported",
  },
];

const policySections = [
  {
    title: "Information we collect",
    body:
      "We collect only the information needed to register guests, match photos, and deliver private event galleries.",
    items: [
      "Guest name, email address, event code, and consent timestamp.",
      "Uploaded selfie image and generated face descriptor.",
      "Event photos uploaded by the event admin or photographer.",
      "Download activity used for delivery stats and operational reporting.",
    ],
  },
  {
    title: "How we use information",
    body:
      "FaceDeliver uses guest and event data to connect each person with the photos they appear in.",
    items: [
      "Register guests for a specific event and verify their access.",
      "Match registered guests with uploaded event photos.",
      "Send onboarding, processing, and photo-ready email notifications.",
      "Show admins event-level upload, guest, matching, and download statistics.",
    ],
  },
  {
    title: "How access is controlled",
    body:
      "Guest, admin, and superadmin experiences are separated so each user sees only the data needed for their role.",
    items: [
      "Guests access their own matched gallery after authentication.",
      "Admins manage event workspaces and event-related assets.",
      "Superadmin routes are separated from regular admin workflows.",
      "Sensitive auth tokens are handled through server-side HTTP-only cookies.",
    ],
  },
  {
    title: "Data deletion and retention",
    body:
      "The backend includes cleanup logic for old guest and photo assets, with a current retention target of 10 days.",
    items: [
      "Old event photos, guest selfies, and guest records are eligible for cleanup after the retention window.",
      "Guests can request deletion of their personal data from the authenticated account flow.",
      "Deleted records are removed from the app database and linked asset storage where supported.",
      "Retention windows may be adjusted for legal, business, or operational requirements.",
    ],
  },
  {
    title: "Third-party processors",
    body:
      "FaceDeliver uses infrastructure providers to store assets, send email, process payments, and monitor reliability.",
    items: [
      "Cloudinary may store uploaded selfies and event photos.",
      "MongoDB stores application records, guest metadata, and matching records.",
      "Resend sends transactional email notifications.",
      "Razorpay handles billing and payment flows for paid plans.",
      "Sentry may receive technical error logs used to diagnose failures.",
    ],
  },
  {
    title: "Your choices",
    body:
      "Guests and admins can make privacy requests when they need access, correction, retention, or deletion support.",
    items: [
      "Guests may choose not to register if they do not want face matching.",
      "Guests may delete their personal gallery data from the authenticated account flow.",
      "Admins can contact support for event-level retention and removal requests.",
      "You can contact the team for privacy questions or data access requests.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <main>
        <section className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-12 shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:px-10 sm:py-16 lg:px-14">
            <div className="max-w-4xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                <ShieldCheck className="h-4 w-4 text-zinc-800" />
                Privacy Policy
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
                Clear privacy rules for private event photo delivery.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
                This page explains how FaceDeliver collects, uses, protects, and deletes data when
                guests register for AI photo matching and admins manage event galleries.
              </p>
            </div>

            <div className="mt-10 grid gap-3 border-t border-zinc-200 pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {summaryItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[280px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="border-l-2 border-zinc-900 pl-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Updated
                </p>
                <p className="mt-2 text-lg font-semibold text-zinc-950">{lastUpdated}</p>
                <p className="mt-4 text-sm leading-6 text-zinc-600">
                  Designed around narrow access, explicit consent, and limited retention.
                </p>
              </div>
            </aside>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              {policySections.map((section, index) => (
                <PolicySection
                  key={section.title}
                  index={index + 1}
                  title={section.title}
                  body={section.body}
                  items={section.items}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-xl border border-zinc-200 bg-zinc-950 p-7 text-white sm:p-10 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Privacy requests
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Need help with your data?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
                Contact the FaceDeliver team for access, correction, retention, or deletion requests.
              </p>
            </div>
            <a
              href="mailto:support@facedeliver.shop"
              className="inline-flex items-center justify-center gap-2 rounded bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-950 transition hover:bg-zinc-100"
            >
              <Mail className="h-4 w-4" />
              Email Support
            </a>
          </div>
        </section>
      </main>

      <PremiumFooter />
      <PhotographerWordmarkSection />
    </div>
  );
}

function PolicySection({ index, title, body, items }) {
  return (
    <article className="grid gap-5 border-b border-zinc-200 p-6 last:border-b-0 sm:p-8 lg:grid-cols-[160px_1fr]">
      <div>
        <span className="font-mono text-sm font-semibold text-zinc-400">
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{title}</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">{body}</p>
        <ul className="mt-6 grid gap-3">
          {items.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-600">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-zinc-900" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
