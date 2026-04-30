"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart2,
  CalendarHeart,
  CheckCircle,
  Image as ImageIcon,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  QrCode,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiCall } from "@/app/utils/api";
import { useToast } from "@/components/ui/ToastProvider";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => new Intl.NumberFormat("en-IN").format(n ?? 0);
const pct = (num, den) =>
  den > 0 ? Math.min(100, Math.round((num / den) * 100)) : 0;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-2xl bg-zinc-100 ${className}`} />
);

// ─── Section header (mirrors Dashboard pattern) ───────────────────────────────

const SectionHeader = ({ eyebrow, title, action }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-950">
        {title}
      </h2>
    </div>
    {action}
  </div>
);

// ─── KPI card ─────────────────────────────────────────────────────────────────

const KpiCard = ({ icon: Icon, label, value, subLabel, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/5"
  >
    {loading ? (
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    ) : (
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-zinc-950">
            {value}
          </p>
          <p className="mt-2 text-sm text-zinc-500">{subLabel}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    )}
  </motion.div>
);

// ─── Rate bar ─────────────────────────────────────────────────────────────────

const RateBar = ({ value }) => (
  <div className="flex items-center gap-3">
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-full rounded-full bg-zinc-800"
      />
    </div>
    <span className="w-9 text-right text-xs font-bold text-zinc-700">
      {value}%
    </span>
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ photoCount, guestCount }) => {
  if (photoCount > 0 && guestCount > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  }
  if (photoCount > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-600">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        Photos only
      </span>
    );
  }
  if (guestCount > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        Guests only
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
      Empty
    </span>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setError("");
      const [statsData, eventsData] = await Promise.all([
        apiCall("/admin/dashboard-stats"),
        apiCall("/admin/events"),
      ]);
      if (statsData.success) setStats(statsData);
      if (eventsData.success) setEvents(eventsData.events || []);
    } catch (err) {
      const msg = "Analytics data could not be loaded. Try refreshing.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const matchRate = useMemo(
    () => pct(stats?.totalMatches, stats?.totalPhotos),
    [stats]
  );

  const avgGuests = useMemo(
    () =>
      stats?.totalEvents > 0
        ? Math.round(stats.totalGuests / stats.totalEvents)
        : 0,
    [stats]
  );

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.code.toLowerCase().includes(search.toLowerCase())
      ),
    [events, search]
  );

  const kpis = [
    {
      icon: Sparkles,
      label: "Match Rate",
      value: `${matchRate}%`,
      subLabel: "Faces matched vs photos",
    },
    {
      icon: CheckCircle,
      label: "Total Matches",
      value: fmt(stats?.totalMatches),
      subLabel: "Across all events",
    },
    {
      icon: Users,
      label: "Guests Registered",
      value: fmt(stats?.totalGuests),
      subLabel: `~${fmt(avgGuests)} per event`,
    },
    {
      icon: ImageIcon,
      label: "Photos Processed",
      value: fmt(stats?.totalPhotos),
      subLabel: "Across all events",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-950">Analytics</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track match rates, guest engagement, and photo delivery across all events.
        </p>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* ── KPI cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} loading={loading} />
        ))}
      </div>

      {/* ── Match rate panel ── */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <SectionHeader
          eyebrow="Performance"
          title="Key metrics overview"
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-zinc-950 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              Face Match Rate
            </p>
            <p className="mt-3 text-4xl font-black">{matchRate}%</p>
            <p className="mt-1.5 text-sm text-white/60">
              {fmt(stats?.totalMatches)} matches from{" "}
              {fmt(stats?.totalPhotos)} photos
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${matchRate}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="h-full rounded-full bg-white"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
              Avg Guests / Event
            </p>
            <p className="mt-3 text-4xl font-black text-zinc-950">
              {loading ? "—" : fmt(avgGuests)}
            </p>
            <p className="mt-1.5 text-sm text-zinc-500">
              Across {fmt(stats?.totalEvents)} events
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
              Avg Photos / Event
            </p>
            <p className="mt-3 text-4xl font-black text-zinc-950">
              {loading
                ? "—"
                : fmt(
                    stats?.totalEvents > 0
                      ? Math.round(stats.totalPhotos / stats.totalEvents)
                      : 0
                  )}
            </p>
            <p className="mt-1.5 text-sm text-zinc-500">
              {fmt(stats?.totalPhotos)} total uploaded
            </p>
          </div>
        </div>
      </section>

      {/* ── Events performance table ── */}
      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 p-6">
          <SectionHeader
            eyebrow="Event Breakdown"
            title="Performance by event"
            action={
              <Link
                href="/admin/events"
                className="inline-flex items-center gap-2 rounded border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                Manage Events
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            }
          />

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events by name or code…"
              className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
              <CalendarHeart className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-zinc-700">
              {search ? "No events match your search." : "No events created yet."}
            </p>
            {!search && (
              <Link
                href="/admin/events"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-black"
              >
                Create your first event
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/80">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                    Event
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                    Code
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                    Guests
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                    Photos
                  </th>
                  <th className="hidden px-4 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400 md:table-cell">
                    Status
                  </th>
                  <th className="hidden px-4 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400 lg:table-cell">
                    Guest coverage
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredEvents.map((event) => {
                  return (
                    <tr
                      key={event._id}
                      className="transition hover:bg-zinc-50/80"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-zinc-900">{event.name}</p>
                        <p className="mt-0.5 text-xs text-zinc-400">
                          {new Date(event.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs font-bold text-zinc-700">
                          <QrCode className="h-3 w-3" />
                          {event.code}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-zinc-900">
                        {fmt(event.guestCount)}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-zinc-900">
                        {fmt(event.photoCount)}
                      </td>
                      <td className="hidden px-4 py-4 md:table-cell">
                        <StatusBadge
                          photoCount={event.photoCount}
                          guestCount={event.guestCount}
                        />
                      </td>
                      <td className="hidden px-4 py-4 lg:table-cell">
                        <RateBar
                          value={pct(
                            event.guestCount,
                            Math.max(event.guestCount, 1)
                          )}
                        />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/admin/events/${event._id}`}
                          className="inline-flex items-center gap-1.5 rounded border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-black"
                        >
                          View Stats
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Tips ── */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: TrendingUp,
            title: "Improve your match rate",
            text: "Ensure guests register with a well-lit frontal selfie. Better input data directly improves face matching accuracy.",
          },
          {
            icon: Users,
            title: "Grow guest registrations",
            text: "Share the QR code before the event, not just at entry. Pre-event registration means guests are ready when photos arrive.",
          },
          {
            icon: BarChart2,
            title: "Track delivery coverage",
            text: "Open any event and check delivery stats to see how many guests have downloaded their matched photos.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-black text-zinc-950">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
