"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeIndianRupee, CalendarClock, CreditCard, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { superadminApiCall } from "../../../utils/api";

const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format((amount || 0) / 100);

const formatDate = (value) => {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const StatCard = ({ icon: Icon, label, value, helper }) => (
  <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">{label}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">{value}</p>
        <p className="mt-2 text-sm text-zinc-500">{helper}</p>
      </div>
      <div className="rounded-2xl bg-zinc-100 p-3 text-zinc-700">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

export default function SuperadminDashboardPage() {
  const [dashboard, setDashboard] = useState({
    stats: { totalAdmins: 0, totalSubscribers: 0, activeSubscriptions: 0, totalRevenue: 0 },
    subscribers: [],
    recentPayments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await superadminApiCall("/superadmin/dashboard");
        setDashboard(data);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const activeRows = useMemo(
    () => dashboard.subscribers.filter((item) => item.status === "active"),
    [dashboard.subscribers]
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">Subscription oversight</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
          Review which admins purchased plans, how much they paid, when each subscription started, and when it will end.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Admins" value={dashboard.stats.totalAdmins} helper="All admin accounts created in the platform" />
        <StatCard icon={ShieldCheck} label="Subscribers" value={dashboard.stats.totalSubscribers} helper="Admins with at least one subscription record" />
        <StatCard icon={CalendarClock} label="Active Plans" value={dashboard.stats.activeSubscriptions} helper="Subscriptions currently marked active" />
        <StatCard icon={BadgeIndianRupee} label="Revenue" value={formatCurrency(dashboard.stats.totalRevenue)} helper="Total paid revenue captured from Razorpay" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm"
        >
          <div className="border-b border-zinc-200 px-6 py-5">
            <h3 className="text-lg font-semibold text-zinc-950">Admin subscription ledger</h3>
            <p className="mt-1 text-sm text-zinc-500">Every admin who has taken a plan, with billing periods and paid amount.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Admin</th>
                  <th className="px-6 py-4 font-semibold">Plan</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Start</th>
                  <th className="px-6 py-4 font-semibold">End</th>
                  <th className="px-6 py-4 font-semibold">Paid</th>
                  <th className="px-6 py-4 font-semibold">Uploads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-zinc-500">Loading subscription records...</td>
                  </tr>
                ) : dashboard.subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-zinc-500">No subscription records found yet.</td>
                  </tr>
                ) : (
                  dashboard.subscribers.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-zinc-900">{item.adminName}</p>
                        <p className="text-xs text-zinc-500">{item.adminEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-zinc-900">{item.planName}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{item.billingCycle || "Cycle NA"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
                          item.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.status === "expired"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-zinc-100 text-zinc-600"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-700">{formatDate(item.startDate)}</td>
                      <td className="px-6 py-4 text-zinc-700">{formatDate(item.endDate)}</td>
                      <td className="px-6 py-4 font-semibold text-zinc-900">{formatCurrency(item.paidAmount, item.currency)}</td>
                      <td className="px-6 py-4 text-zinc-700">{item.uploadLimit}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.section>

        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-zinc-950">Active now</h3>
            <p className="mt-1 text-sm text-zinc-500">Quick list of currently active subscriber accounts.</p>

            <div className="mt-5 space-y-3">
              {activeRows.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-500">
                  No active subscriptions yet.
                </div>
              ) : (
                activeRows.slice(0, 6).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                    <p className="font-semibold text-zinc-900">{item.adminName}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.adminEmail}</p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="font-medium text-zinc-700">{item.planName}</span>
                      <span className="text-zinc-500">{formatDate(item.endDate)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-zinc-950">Recent payments</h3>
            <p className="mt-1 text-sm text-zinc-500">Latest paid transactions recorded in the system.</p>

            <div className="mt-5 space-y-3">
              {loading ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-500">
                  Loading payments...
                </div>
              ) : dashboard.recentPayments.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-500">
                  No successful payments yet.
                </div>
              ) : (
                dashboard.recentPayments.map((payment) => (
                  <div key={payment.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-zinc-900">{payment.adminName}</p>
                        <p className="mt-1 text-xs text-zinc-500">{payment.planName}</p>
                      </div>
                      <p className="font-semibold text-zinc-900">{formatCurrency(payment.amount, payment.currency)}</p>
                    </div>
                    <p className="mt-3 text-xs text-zinc-500">{payment.adminEmail}</p>
                    <p className="mt-1 text-xs text-zinc-400">Paid on {formatDate(payment.paidAt)}</p>
                  </div>
                ))
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
