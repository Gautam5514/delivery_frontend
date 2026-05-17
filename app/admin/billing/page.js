"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Loader2,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
  ImageIcon,
  CalendarDays,
  RefreshCw,
  BadgeIndianRupee,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiCall, getAuthUser } from "../../utils/api";
import { loadRazorpayCheckout } from "../../utils/razorpay";
import { useToast } from "@/components/ui/ToastProvider";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => new Intl.NumberFormat("en-IN").format(n ?? 0);

const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format((amount || 0) / 100);

const formatDate = (v) =>
  v
    ? new Date(v).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

// ─── Plan config ──────────────────────────────────────────────────────────────

const PLAN_META = {
  basic: {
    icon: BadgeIndianRupee,
    tag: "Starter",
    tagColor: "border-zinc-200 bg-zinc-50 text-zinc-600",
    dark: false,
    recommended: false,
  },
  pro: {
    icon: Zap,
    tag: "Most Popular",
    tagColor: "border-zinc-900 bg-zinc-900 text-white",
    dark: false,
    recommended: true,
  },
  premium: {
    icon: Sparkles,
    tag: "Best Value",
    tagColor: "border-white/20 bg-white/10 text-white",
    dark: true,
    recommended: false,
  },
};

const PLAN_FEATURES = [
  "Unlimited events & guests",
  "Auto face matching & delivery",
  "Personal guest photo galleries",
  "Analytics & delivery stats",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-2xl bg-zinc-100 ${className}`} />
);

const QuotaBar = ({ value }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(value, 100)}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`h-full rounded-full transition-colors ${
        value >= 90 ? "bg-red-500" : value >= 70 ? "bg-amber-500" : "bg-zinc-900"
      }`}
    />
  </div>
);

// ─── Current status card ──────────────────────────────────────────────────────

const StatusSection = ({ billing, loading, usagePercent }) => {
  if (loading) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-10" />
        </div>
      </section>
    );
  }

  if (!billing.subscription) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <Rocket className="h-6 w-6" />
          </div>
          <div>
            <p className="font-black text-zinc-900">No active plan</p>
            <p className="mt-1 text-sm text-zinc-500">
              Choose a plan below to unlock photo uploads and face matching.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const { subscription, usage } = billing;
  const statusColor =
    subscription.status === "active"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            Current Entitlement
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${statusColor}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {subscription.status || "active"}
        </span>
      </div>

      <div className="p-6">
        {/* Top stat row */}
        <div className="grid gap-3 sm:grid-cols-3">
          {/* Plan name */}
          <div className="rounded-2xl bg-zinc-950 p-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              Plan
            </p>
            <p className="mt-2 text-xl font-black tracking-tight">
              {subscription.plan?.name}
            </p>
            <p className="mt-0.5 text-xs text-white/50">
              {formatCurrency(subscription.plan?.amount, subscription.plan?.currency)}{" "}
              / {subscription.plan?.billingCycle}
            </p>
          </div>

          {/* Uploads used */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                Used
              </p>
              <ImageIcon className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <p className="mt-2 text-xl font-black tracking-tight text-zinc-950">
              {fmt(usage?.usedUploads)}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              of {fmt(subscription.uploadLimit)} uploads
            </p>
          </div>

          {/* Renewal */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                Renews
              </p>
              <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <p className="mt-2 text-xl font-black tracking-tight text-zinc-950">
              {formatDate(subscription.currentPeriodEnd)}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">Auto-renews</p>
          </div>
        </div>

        {/* Quota bar */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold text-zinc-500">Upload quota</p>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-bold ${
                  usagePercent >= 90
                    ? "text-red-600"
                    : usagePercent >= 70
                    ? "text-amber-600"
                    : "text-zinc-700"
                }`}
              >
                {usagePercent}% used
              </span>
              <span className="text-xs text-zinc-400">
                {fmt(usage?.remainingUploads ?? 0)} remaining
              </span>
            </div>
          </div>
          <QuotaBar value={usagePercent} />
        </div>

        {/* Cycle note */}
        <p className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
          <RefreshCw className="h-3 w-3" />
          Quota resets on{" "}
          <span className="font-semibold text-zinc-600">
            {formatDate(subscription.currentPeriodEnd)}
          </span>
        </p>
      </div>
    </section>
  );
};

// ─── Plan card ────────────────────────────────────────────────────────────────

const PlanCard = ({ plan, isActive, isProcessing, anyProcessing, onSelect, index }) => {
  const meta = PLAN_META[plan.code] || PLAN_META.basic;
  const Icon = meta.icon;
  const disabled = isProcessing || anyProcessing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className={`group relative flex flex-col overflow-hidden rounded-xl border transition hover:-translate-y-0.5 ${
        meta.dark
          ? "border-zinc-800 bg-zinc-950 shadow-2xl shadow-zinc-900/40"
          : meta.recommended
          ? "border-zinc-900/20 bg-white shadow-lg shadow-zinc-900/8"
          : "border-zinc-200 bg-white shadow-sm"
      }`}
    >
      {/* Recommended glow strip */}
      {meta.recommended && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />
      )}

      <div className="flex flex-1 flex-col p-6">
        {/* Tag row */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${meta.tagColor}`}
          >
            {meta.tag}
          </span>
          {isActive && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Active
            </span>
          )}
        </div>

        {/* Icon + name */}
        <div className="mt-5 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              meta.dark ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-700"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <h3
            className={`text-lg font-black tracking-tight ${
              meta.dark ? "text-white" : "text-zinc-950"
            }`}
          >
            {plan.name}
          </h3>
        </div>

        {/* Price */}
        <div className="mt-5 flex items-baseline gap-1">
          <span
            className={`text-3xl font-black tracking-tight ${
              meta.dark ? "text-white" : "text-zinc-950"
            }`}
          >
            {formatCurrency(plan.amount, plan.currency)}
          </span>
          <span
            className={`text-sm ${meta.dark ? "text-white/45" : "text-zinc-400"}`}
          >
            /{plan.billingCycle}
          </span>
        </div>

        {/* Upload limit pill */}
        <div
          className={`mt-5 rounded-2xl p-4 ${
            meta.dark
              ? "bg-white/5 ring-1 ring-white/10"
              : "bg-zinc-50 ring-1 ring-zinc-100"
          }`}
        >
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
              meta.dark ? "text-white/40" : "text-zinc-400"
            }`}
          >
            Monthly uploads
          </p>
          <p
            className={`mt-1 text-2xl font-black tracking-tight ${
              meta.dark ? "text-white" : "text-zinc-950"
            }`}
          >
            {fmt(plan.uploadLimit)}
          </p>
          <p
            className={`text-xs ${meta.dark ? "text-white/40" : "text-zinc-500"}`}
          >
            photos per cycle
          </p>
        </div>

        {/* Feature list */}
        <ul className="mt-5 flex-1 space-y-2.5">
          {PLAN_FEATURES.map((f) => (
            <li
              key={f}
              className={`flex items-center gap-2.5 text-sm ${
                meta.dark ? "text-white/60" : "text-zinc-600"
              }`}
            >
              <CheckCircle2
                className={`h-4 w-4 shrink-0 ${
                  meta.dark ? "text-white/30" : "text-emerald-500"
                }`}
              />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect(plan.code)}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
            isActive
              ? meta.dark
                ? "bg-white/10 text-white/60 cursor-default"
                : "bg-zinc-100 text-zinc-400 cursor-default"
              : meta.dark
              ? "bg-white text-zinc-950 hover:bg-zinc-100 shadow-lg shadow-black/30"
              : meta.recommended
              ? "bg-zinc-950 text-white hover:bg-black shadow-lg shadow-zinc-900/15"
              : "bg-zinc-900 text-white hover:bg-black"
          }`}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isActive ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          {isProcessing
            ? "Processing…"
            : isActive
            ? "Current Plan"
            : `Get ${plan.name}`}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const toast = useToast();
  const [plans, setPlans] = useState([]);
  const [billing, setBilling] = useState({ subscription: null, usage: null });
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState("");
  const currentUser = useMemo(() => getAuthUser(), []);

  const fetchBillingData = useCallback(async () => {
    try {
      const [plansData, statusData] = await Promise.all([
        apiCall("/billing/plans"),
        apiCall("/billing/status"),
      ]);
      setPlans(plansData.plans || []);
      setBilling({
        subscription: statusData.subscription,
        usage: statusData.usage,
      });
    } catch (err) {
      toast.error(err.message || "Failed to load billing data.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);

  const usagePercent =
    billing.subscription && billing.usage
      ? Math.min(
          100,
          Math.round(
            (billing.usage.usedUploads /
              Math.max(1, billing.subscription.uploadLimit)) *
              100
          )
        )
      : 0;

  const activePlanCode = billing.subscription?.plan?.code || "";

  const openCheckout = async (planCode) => {
    try {
      setProcessingPlan(planCode);
      const Razorpay = await loadRazorpayCheckout();
      const orderData = await apiCall("/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planCode }),
      });

      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Gopo Admin Billing",
        description: `${orderData.plan.name} plan`,
        order_id: orderData.order.id,
        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
        },
        theme: { color: "#09090b" },
        handler: async (response) => {
          try {
            await apiCall("/billing/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            toast.success(`${orderData.plan.name} plan activated.`);
            await fetchBillingData();
          } catch (err) {
            toast.error(err.message || "Payment verification failed.");
          } finally {
            setProcessingPlan("");
          }
        },
        modal: { ondismiss: () => setProcessingPlan("") },
      };

      new Razorpay(options).open();
    } catch (err) {
      toast.error(err.message || "Unable to start checkout.");
      setProcessingPlan("");
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-950">Billing &amp; Usage</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your subscription plan and monitor upload quota.
        </p>
      </div>

      {/* ── Current status ── */}
      <StatusSection
        billing={billing}
        loading={loading}
        usagePercent={usagePercent}
      />

      {/* ── Plans ── */}
      <section>
        <div className="mb-6 flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">
            Plans
          </p>
          <h2 className="text-xl font-black tracking-tight text-zinc-950">
            Choose your operating plan.
          </h2>
          <p className="text-sm text-zinc-500">
            All plans include every feature. The only difference is monthly upload capacity.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-700">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            Plans could not be loaded. Please refresh the page.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.code}
                plan={plan}
                index={i}
                isActive={activePlanCode === plan.code}
                isProcessing={processingPlan === plan.code}
                anyProcessing={!!processingPlan}
                onSelect={openCheckout}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Footer note ── */}
      <div className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
        <p className="text-xs leading-6 text-zinc-500">
          Payments are processed securely via Razorpay. Gopo never stores your
          card details. All plans are billed monthly with no lock-in — you can
          upgrade at any time and the new quota takes effect immediately.
        </p>
      </div>
    </div>
  );
}
