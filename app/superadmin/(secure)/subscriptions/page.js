"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CreditCard, Search, ShieldCheck, Users } from "lucide-react";
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

export default function SuperadminSubscriptionsPage() {
  const [dashboard, setDashboard] = useState({
    stats: { totalAdmins: 0, totalSubscribers: 0, activeSubscriptions: 0, totalRevenue: 0 },
    subscribers: [],
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filteredSubscribers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return dashboard.subscribers;
    return dashboard.subscribers.filter((item) =>
      [item.adminName, item.adminEmail, item.planName, item.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [dashboard.subscribers, search]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">Admin subscription ledger</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
          Dedicated view of all admin subscriptions, including start date, end date, status, upload limit, and amount paid.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Admins" value={dashboard.stats.totalAdmins} helper="All admins on the platform" />
        <StatCard icon={ShieldCheck} label="Subscribers" value={dashboard.stats.totalSubscribers} helper="Admins with subscription records" />
        <StatCard icon={CalendarClock} label="Active Plans" value={dashboard.stats.activeSubscriptions} helper="Plans currently active" />
        <StatCard icon={CreditCard} label="Revenue" value={formatCurrency(dashboard.stats.totalRevenue)} helper="Total paid subscription revenue" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm"
      >
        <div className="border-b border-zinc-200 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-zinc-950">All subscription records</h3>
              <p className="mt-1 text-sm text-zinc-500">Search by admin name, email, plan, or status.</p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 lg:w-[340px]">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subscriptions..."
                className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Admin</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Start Date</th>
                <th className="px-6 py-4 font-semibold">End Date</th>
                <th className="px-6 py-4 font-semibold">Amount Paid</th>
                <th className="px-6 py-4 font-semibold">Upload Limit</th>
                <th className="px-6 py-4 font-semibold">Order ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-zinc-500">Loading subscription records...</td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-zinc-500">No subscriptions matched your search.</td>
                </tr>
              ) : (
                filteredSubscribers.map((item) => (
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
                            : item.status === "replaced"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-zinc-100 text-zinc-600"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-700">{formatDate(item.startDate)}</td>
                    <td className="px-6 py-4 text-zinc-700">{formatDate(item.endDate)}</td>
                    <td className="px-6 py-4 font-semibold text-zinc-900">{formatCurrency(item.paidAmount, item.currency)}</td>
                    <td className="px-6 py-4 text-zinc-700">{item.uploadLimit}</td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{item.orderId || "Not available"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
}
