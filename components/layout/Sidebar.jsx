"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart2,
  CalendarHeart,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  UserCircle,
  WalletCards,
  X,
} from "lucide-react";

// Items with `divider: true` render a horizontal separator before them.
const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Events",    href: "/admin/events",    icon: CalendarHeart },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { divider: true },
  { label: "Billing", href: "/admin/billing", icon: WalletCards },
  { label: "Help",    href: "/admin/help",    icon: HelpCircle },
  { divider: true },
  { label: "Profile", href: "/admin/profile", icon: UserCircle },
];

export default function Sidebar({
  currentUser,
  displayName,
  initials,
  isOpen,
  onClose,
  pathname,
  billingStatus,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const remainingUploads = billingStatus?.usage?.remainingUploads;
  const totalUploads = billingStatus?.usage?.totalLimit;
  const usedUploads = typeof totalUploads === "number" && typeof remainingUploads === "number" ? totalUploads - remainingUploads : 0;
  const progressPercent = totalUploads ? Math.max(5, Math.min(100, (usedUploads / totalUploads) * 100)) : 0;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 transform overflow-hidden border-r border-zinc-200/80 bg-white/75 shadow-[18px_0_50px_-35px_rgba(24,24,27,0.45)] backdrop-blur-2xl transition-[width,transform,box-shadow] duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:flex-shrink-0 ${
        isCollapsed ? "lg:w-20" : "lg:w-72"
      } ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
    >
      {/* ── Logo row ── */}
      <div
        className={`flex h-20 items-center border-b border-zinc-200/60 px-5 transition-all duration-300 ${
          isCollapsed ? "lg:justify-center lg:px-3" : "justify-between"
        }`}
      >
        <Link
          href="/admin/dashboard"
          className={`flex min-w-0 items-center gap-3 ${
            isCollapsed ? "lg:justify-center" : ""
          }`}
        >
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/80">
            <Image
              src="/G.png"
              alt="Gopo logo"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <span
            className={`truncate text-xl font-extrabold tracking-tight text-zinc-900 transition-all duration-200 ${
              isCollapsed
                ? "lg:pointer-events-none lg:w-0 lg:opacity-0"
                : "opacity-100"
            }`}
          >
            Gopo
          </span>
        </Link>

        {/* Mobile close */}
        <button
          className="text-zinc-400 transition-colors hover:text-zinc-600 lg:hidden"
          onClick={onClose}
          type="button"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          className={`hidden h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-500 cursor-pointer lg:flex ${
            isCollapsed ? "lg:absolute lg:left-1/2 lg:top-24 lg:-translate-x-1/2" : ""
          }`}
          onClick={() => setIsCollapsed((v) => !v)}
          type="button"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* ── Nav + profile ── */}
      <div
        className={`flex h-[calc(100vh-5rem)] flex-col justify-between overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "p-3 pt-16 lg:p-3 lg:pt-16" : "p-4"
        }`}
      >
        <div className="flex-1">
          <nav className={`space-y-1 ${isCollapsed ? "" : "-mx-4"}`}>
            {navItems.map((item, index) => {
              // ── Divider ──
              if (item.divider) {
                return (
                  <div
                    key={`divider-${index}`}
                    className={`my-2 border-t border-zinc-200/60 ${
                      isCollapsed ? "mx-2" : "mx-8"
                    }`}
                  />
                );
              }

              // ── Nav link ──
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  title={isCollapsed ? item.label : undefined}
                  className={`group relative flex items-center overflow-hidden text-sm font-semibold transition-all duration-200 ${
                    isCollapsed
                      ? "h-14 justify-center gap-0 px-0"
                      : "gap-3 px-8 py-3.5"
                  } ${
                    isActive
                      ? isCollapsed
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/15"
                        : "bg-[linear-gradient(90deg,#050507_0%,#111113_28%,rgba(24,24,27,0.82)_52%,rgba(113,113,122,0.36)_76%,rgba(255,255,255,0.96)_100%)] text-white shadow-[0_16px_35px_-20px_rgba(24,24,27,0.95)] ring-1 ring-zinc-950/5"
                      : "text-zinc-500 hover:bg-zinc-100/90 hover:text-zinc-900"
                  }`}
                >
                  <Icon
                    className={`relative z-10 h-5 w-5 shrink-0 transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span
                    className={`relative z-10 truncate transition-all duration-200 ${
                      isCollapsed
                        ? "lg:pointer-events-none lg:w-0 lg:opacity-0"
                        : "opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Premium Quota Progress Card */}
          {!isCollapsed && billingStatus && billingStatus.subscription && (
            <div className="mt-8 rounded-2xl border border-zinc-200/50 bg-zinc-50/50 p-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)] ring-1 ring-black/[0.02]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  Active Plan
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-0.5 text-[9px] font-black tracking-tight text-white">
                  {billingStatus.subscription?.plan?.code?.toUpperCase() === 'PRO' || billingStatus.subscription?.plan?.code === 'medium' ? 'PRO' : billingStatus.subscription?.plan?.code?.toUpperCase() === 'PREMIUM' ? 'STUDIO' : 'STARTER'}
                </span>
              </div>
              
              {typeof remainingUploads === "number" ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-zinc-700">
                    <span>Photo Uploads</span>
                    <span className="font-extrabold text-zinc-900">
                      {remainingUploads} Left
                    </span>
                  </div>
                  {/* Visual Progress bar */}
                  <div className="h-1.5 w-full rounded-full bg-zinc-200/70 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-zinc-900 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-400 font-semibold">
                    <span>Used: {usedUploads}</span>
                    <span>Limit: {totalUploads}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-zinc-400 font-semibold py-0.5">
                  No active upload limits.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Profile strip ── */}
        <div
          className={`border-t border-zinc-200/70 pt-4 transition-all duration-300 ${
            isCollapsed ? "flex justify-center" : ""
          }`}
        >
          <Link
            href="/admin/profile"
            onClick={onClose}
            className={`flex items-center bg-zinc-900 text-white shadow-lg shadow-zinc-900/10 transition-all duration-300 hover:bg-black ${
              isCollapsed ? "h-12 w-12 justify-center" : "w-full gap-3 px-4 py-3"
            }`}
            title={isCollapsed ? displayName : undefined}
          >
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-sm font-black">
              {currentUser?.profileImageUrl ? (
                <Image
                  src={currentUser.profileImageUrl}
                  alt={displayName}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                initials
              )}
            </span>
            <span
              className={`min-w-0 transition-all duration-200 ${
                isCollapsed
                  ? "lg:pointer-events-none lg:w-0 lg:opacity-0"
                  : "opacity-100"
              }`}
            >
              <span className="block truncate text-sm font-black">
                {displayName}
              </span>
              <span className="block truncate text-xs font-medium text-white/55">
                {currentUser?.email}
              </span>
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
