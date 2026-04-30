"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarHeart,
  CheckCircle,
  CreditCard,
  Gauge,
  Image as ImageIcon,
  Loader2,
  Plus,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiCall } from "../../utils/api";
import { useToast } from "@/components/ui/ToastProvider";

const emptyStats = {
  totalEvents: 0,
  totalGuests: 0,
  totalPhotos: 0,
  totalMatches: 0,
  recentEvents: [],
};

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(value || 0);

const getUsagePercent = (billing) => {
  if (!billing.subscription || !billing.usage) return 0;

  const usedUploads = billing.usage.usedUploads || 0;
  const uploadLimit = Math.max(1, billing.subscription.uploadLimit || 0);

  return Math.min(100, Math.round((usedUploads / uploadLimit) * 100));
};

const getQuotaStatus = (billing, usagePercent) => {
  if (!billing.subscription) {
    return {
      label: "Plan required",
      tone: "border-amber-200 bg-amber-50 text-amber-700",
      message: "Activate billing before uploading event photos.",
    };
  }

  if (usagePercent >= 90) {
    return {
      label: "Critical quota",
      tone: "border-red-200 bg-red-50 text-red-700",
      message: "Upgrade before the next large gallery import.",
    };
  }

  if (usagePercent >= 70) {
    return {
      label: "Watch quota",
      tone: "border-orange-200 bg-orange-50 text-orange-700",
      message: "Capacity is getting tight for this billing period.",
    };
  }

  return {
    label: "Healthy quota",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
    message: "Upload capacity is available for upcoming events.",
  };
};

const SectionHeader = ({ action, eyebrow, title }) => (
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

const StatCard = ({ icon: Icon, label, subLabel, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-zinc-200 bg-white p-5  transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/5"
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
          {label}
        </p>
        <p className="mt-3 text-3xl font-black tracking-tight text-zinc-950">
          {formatNumber(value)}
        </p>
        <p className="mt-2 text-sm text-zinc-500">{subLabel}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
);

const QuotaBar = ({ percent }) => (
  <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${percent}%` }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="h-full rounded-full bg-zinc-950"
    />
  </div>
);

const BillingPanel = ({ billing, quotaStatus, usagePercent }) => (
  <section className="rounded-xl border border-zinc-200 bg-white p-6">
    <SectionHeader
      eyebrow="Billing"
      title={billing.subscription ? "Plan and upload quota" : "Billing setup required"}
      action={
        <Link
          href="/admin/billing"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-black"
        >
          Open Billing
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      }
    />

    <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${quotaStatus.tone}`}
          >
            {quotaStatus.label}
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-zinc-950">
            {billing.subscription
              ? `${billing.subscription.plan?.name || "Active"} plan is live`
              : "Activate uploads"}
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
            {quotaStatus.message}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-right shadow-sm lg:min-w-40">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            Quota Used
          </p>
          <p className="mt-2 text-3xl font-black text-zinc-950">{usagePercent}%</p>
        </div>
      </div>

      <div className="mt-5">
        <QuotaBar percent={usagePercent} />
      </div>
    </div>

    {billing.subscription ? (
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-zinc-950 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
            Current Plan
          </p>
          <p className="mt-3 text-2xl font-black">{billing.subscription.plan?.name}</p>
          <p className="mt-1 text-sm capitalize text-white/65">
            {billing.subscription.plan?.billingCycle || "Active cycle"}
          </p>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            Used Uploads
          </p>
          <p className="mt-3 text-2xl font-black text-zinc-950">
            {formatNumber(billing.usage?.usedUploads)}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Remaining: {formatNumber(billing.usage?.remainingUploads)}
          </p>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            Plan Limit
          </p>
          <p className="mt-3 text-2xl font-black text-zinc-950">
            {formatNumber(billing.subscription.uploadLimit)}
          </p>
          <p className="mt-1 text-sm text-zinc-500">Current period cap</p>
        </div>
      </div>
    ) : (
      <div className="mt-4 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-600">
        No active plan found. Choose a plan before uploading event photos.
      </div>
    )}
  </section>
);



const RecentEvents = ({ loading, recentEvents }) => (
  <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
    <div className="border-b border-zinc-200 p-6">
      <SectionHeader
        eyebrow="Recent Events"
        title="Latest event workspaces"
        action={
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 rounded border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />
    </div>

    {loading ? (
      <div className="space-y-3 p-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-16 animate-pulse rounded-2xl bg-zinc-100" />
        ))}
      </div>
    ) : recentEvents.length === 0 ? (
      <div className="p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded bg-zinc-100 text-zinc-500">
          <CalendarHeart className="h-6 w-6" />
        </div>
        <p className="mt-4 text-sm font-semibold text-zinc-700">
          No events created yet.
        </p>
        <Link
          href="/admin/events"
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-black"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </Link>
      </div>
    ) : (
      <div className="divide-y divide-zinc-200">
        {recentEvents.map((event) => (
          <div
            key={event._id}
            className="grid gap-4 p-5 transition hover:bg-zinc-50/80 md:grid-cols-[1fr_auto] md:items-center"
          >
            <div className="min-w-0">
              <p className="truncate font-bold text-zinc-900">{event.name}</p>
              <p className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-500">
                <span className="font-mono font-bold text-zinc-700">{event.code}</span>
                <span>/</span>
                <span>{new Date(event.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
            <Link
              href={`/admin/events/${event._id}`}
              className="inline-flex items-center justify-center rounded border border-zinc-900 bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-black"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    )}
  </section>
);

export default function DashboardPage() {
  const toast = useToast();
  const [stats, setStats] = useState(emptyStats);
  const [billing, setBilling] = useState({ subscription: null, usage: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        setError("");
        const [statsData, billingData] = await Promise.all([
          apiCall("/admin/dashboard-stats"),
          apiCall("/billing/status"),
        ]);

        if (cancelled) return;

        if (statsData.success) {
          setStats({ ...emptyStats, ...statsData });
        }

        setBilling({
          subscription: billingData.subscription,
          usage: billingData.usage,
        });
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch dashboard", err);
          const message = "Dashboard data could not be loaded. Try refreshing the page.";
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const dashboardMetrics = useMemo(() => {
    const usagePercent = getUsagePercent(billing);
    const quotaStatus = getQuotaStatus(billing, usagePercent);
    const remainingUploads = billing.usage?.remainingUploads ?? Infinity;
    const shouldShowBillingPanel =
      !billing.subscription || usagePercent >= 70 || remainingUploads <= 25;

    return {
      quotaStatus,
      shouldShowBillingPanel,
      usagePercent,
    };
  }, [billing]);

  const statCards = [
    {
      icon: CalendarHeart,
      label: "Events",
      value: stats.totalEvents,
      subLabel: "Event workspaces",
    },
    {
      icon: Users,
      label: "Guests",
      value: stats.totalGuests,
      subLabel: "Guest profiles",
    },
    {
      icon: ImageIcon,
      label: "Photos",
      value: stats.totalPhotos,
      subLabel: "Uploaded photos",
    },
    {
      icon: CheckCircle,
      label: "Matches",
      value: stats.totalMatches,
      subLabel: "Face matches",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-zinc-200 bg-white p-5  md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              <Gauge className="h-3.5 w-3.5" />
              Admin Overview
            </div>
            <h1 className="mt-4 max-w-2xl text-2xl font-black tracking-tight text-zinc-950 md:text-3xl">
              Event operations at a glance.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
              Track events, guests, uploads, and matching performance.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:w-[300px]">
            <Link
              href="/admin/events"
              className="group flex items-center justify-between gap-3 rounded bg-zinc-950 px-4 py-3 text-white transition hover:-translate-y-0.5 hover:bg-black"
            >
              <span className="flex items-center gap-2 text-sm font-black">
                <CalendarHeart className="h-4 w-4" />
                Events
              </span>
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/admin/billing"
              className="group flex items-center justify-between gap-3 rounded border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 transition hover:-translate-y-0.5 hover:bg-white"
            >
              <span className="flex items-center gap-2 text-sm font-black">
                <WalletCards className="h-4 w-4" />
                Billing
              </span>
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {error ? (
        <div className="flex items-center gap-3 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          <AlertTriangle className="h-5 w-5" />
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-3 rounded-3xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-500 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading dashboard data...
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {dashboardMetrics.shouldShowBillingPanel ? (
        <BillingPanel
          billing={billing}
          quotaStatus={dashboardMetrics.quotaStatus}
          usagePercent={dashboardMetrics.usagePercent}
        />
      ) : null}

      <RecentEvents loading={loading} recentEvents={stats.recentEvents || []} />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: TrendingUp,
            title: "Scale safely",
            text: "Watch quota before large uploads so imports do not fail midway.",
          },
          {
            icon: Users,
            title: "Improve matching",
            text: "Cleaner guest face data improves gallery delivery quality.",
          },
          {
            icon: CreditCard,
            title: "Account scoped",
            text: "Events, billing, and quota remain isolated to this admin account.",
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
              <h3 className="mt-4 text-base font-black text-zinc-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
