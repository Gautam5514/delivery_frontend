"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BarChart3, CreditCard, ListChecks, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { clearSuperadminSession, getSuperadminUser } from "../../utils/api";

export default function SuperadminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser] = useState(() => getSuperadminUser());

  useEffect(() => {
    if (!currentUser || currentUser.role !== "superadmin") {
      clearSuperadminSession().catch(() => {});
      router.replace("/superadmin/login");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const navItems = [
    { label: "Dashboard", href: "/superadmin/dashboard", icon: BarChart3 },
    { label: "Admin Subscriptions", href: "/superadmin/subscriptions", icon: ListChecks },
  ];

  const pageTitle = pathname === "/superadmin/subscriptions" ? "Admin Subscriptions" : "Superadmin Dashboard";

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-zinc-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-100/70 blur-[110px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[420px] w-[420px] rounded-full bg-amber-100/60 blur-[110px]" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-72 flex-shrink-0 border-r border-zinc-200 bg-white/70 p-5 backdrop-blur-xl lg:block">
          <Link href="/superadmin/dashboard" className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">Superadmin</p>
              <p className="text-lg font-semibold tracking-tight">Control Center</p>
            </div>
          </Link>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="mt-1 text-xs text-zinc-500">{currentUser.email}</p>
            </div>
            <button
              onClick={async () => {
                await clearSuperadminSession();
                router.push("/superadmin/login");
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="relative min-w-0 flex-1">
          <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/70 px-5 py-4 backdrop-blur-xl md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">Platform Oversight</p>
                <h1 className="mt-1 text-xl font-semibold tracking-tight">{pageTitle}</h1>
              </div>
              <Link href="/superadmin/subscriptions" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm">
                <CreditCard className="h-4 w-4" />
                Subscription Monitor
              </Link>
            </div>
          </div>

          <div className="p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
