"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Crown,
  Layers,
  LogOut,
  Menu,
  Plus,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CreateEventModal from "@/components/admin/CreateEventModal";

const planMeta = {
  basic: {
    label: "Basic Plan",
    icon: Layers,
    wrapper:
      "bg-white/85 border-zinc-200/80 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.08)] hover:border-zinc-300 backdrop-blur-md",
    iconBox:
      "bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-600 border border-zinc-200/50",
    text: "text-zinc-800",
    subText: "text-zinc-400",
    divider: "bg-zinc-200",
    glow: "",
  },
  medium: {
    label: "Medium Plan",
    icon: Zap,
    wrapper:
      "bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border-blue-200/60 shadow-[0_4px_20px_-5px_rgba(59,130,246,0.15)] hover:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.25)] hover:border-blue-300/80 backdrop-blur-md",
    iconBox:
      "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[inset_0_2px_5px_rgba(255,255,255,0.3)] border border-blue-400/50",
    text: "text-indigo-950",
    subText: "text-indigo-500",
    divider: "bg-indigo-200",
    glow: "",
  },
  premium: {
    label: "Premium Plan",
    icon: Crown,
    wrapper:
      "group relative overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-800 to-black border-yellow-500/30 shadow-[0_4px_20px_-5px_rgba(234,179,8,0.2)] hover:shadow-[0_8px_30px_-5px_rgba(234,179,8,0.3)] hover:border-yellow-500/50",
    iconBox:
      "relative z-10 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 text-yellow-950 shadow-[inset_0_2px_10px_rgba(255,255,255,0.6)] border border-yellow-200/50",
    text: "relative z-10 text-white",
    subText: "relative z-10 text-yellow-500/80",
    divider: "relative z-10 bg-zinc-700",
    glow:
      "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]",
  },
};

const fallbackPlan = {
  label: "No Plan",
  icon: ShieldCheck,
  wrapper: "bg-zinc-50 border-zinc-200",
  iconBox: "bg-zinc-200 text-zinc-500",
  text: "text-zinc-500",
  subText: "text-zinc-400",
  divider: "bg-zinc-200",
  glow: "",
};

const getPlanMeta = (planCode) => {
  if (!planCode) return fallbackPlan;

  const normalizedCode =
    planCode.toLowerCase() === "pro" ? "medium" : planCode.toLowerCase();

  return (
    planMeta[normalizedCode] || {
      label: planCode,
      icon: Sparkles,
      wrapper: "bg-white border-zinc-200",
      iconBox: "bg-zinc-100 text-zinc-700",
      text: "text-zinc-700",
      subText: "text-zinc-500",
      divider: "bg-zinc-200",
      glow: "",
    }
  );
};

const getPageTitle = (pathname) => {
  if (pathname === "/admin" || pathname === "/admin/dashboard") return "Overview Dashboard";
  if (pathname?.startsWith("/admin/events")) return "Event Operations";
  if (pathname?.startsWith("/admin/billing")) return "Billing & Subscription";
  if (pathname?.startsWith("/admin/profile")) return "Profile Settings";
  return "Admin Panel";
};

export default function Header({
  billingStatus,
  currentUser,
  displayName,
  initials,
  onLogout,
  onOpenSidebar,
  pathname,
}) {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const activePlan = getPlanMeta(billingStatus.subscription?.plan?.code);
  const ActivePlanIcon = activePlan.icon;
  const remainingUploads = billingStatus.usage?.remainingUploads;

  const handleEventCreated = () => {
    window.dispatchEvent(new Event("admin-event-created"));
  };

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40">
      <div className="flex h-20 items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <button
            className="text-zinc-500 transition-colors hover:text-zinc-900 md:hidden"
            onClick={onOpenSidebar}
            type="button"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400"
            >
              Admin Workspace
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="truncate text-lg font-extrabold tracking-tight text-zinc-900 md:text-xl"
            >
              {getPageTitle(pathname)}
            </motion.h1>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-[2rem] border border-white/70 bg-white/35 p-2 shadow-[0_18px_55px_-35px_rgba(24,24,27,0.45)] backdrop-blur-2xl md:gap-4">
          <button
            onClick={() => setIsCreateEventOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 bg-zinc-950/90 px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_30px_-18px_rgba(24,24,27,0.9)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-black"
            type="button"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Event</span>
          </button>

          <Link href="/admin/billing" className="hidden lg:block">
            <motion.div
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 rounded-full border p-1.5 pr-5 backdrop-blur-2xl transition-all duration-300 ${activePlan.wrapper}`}
            >
              {activePlan.glow ? <div className={activePlan.glow} /> : null}

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${activePlan.iconBox}`}
              >
                <ActivePlanIcon className="h-4 w-4" />
              </div>

              <div className="flex flex-col justify-center">
                <span
                  className={`text-[9px] font-bold uppercase leading-tight tracking-[0.2em] ${activePlan.subText}`}
                >
                  Current Plan
                </span>
                <span
                  className={`text-sm font-extrabold leading-tight tracking-tight ${activePlan.text}`}
                >
                  {activePlan.label}
                </span>
              </div>

              <div className={`mx-1 h-7 w-px ${activePlan.divider}`} />

              <div className="flex flex-col justify-center">
                <span
                  className={`text-[9px] font-bold uppercase leading-tight tracking-[0.2em] ${activePlan.subText}`}
                >
                  Usage
                </span>
                <span className={`text-sm font-bold leading-tight ${activePlan.text}`}>
                  {typeof remainingUploads === "number"
                    ? `${remainingUploads} Left`
                    : "Inactive"}
                </span>
              </div>
            </motion.div>
          </Link>

          <div className="relative">
            <button
              className={`flex items-center gap-2 rounded-full border bg-zinc-950/85 p-1.5 pr-3 text-white shadow-[0_12px_30px_-18px_rgba(24,24,27,0.9)] backdrop-blur-xl transition hover:bg-zinc-950 ${
                isProfileOpen ? "border-blue-300 ring-4 ring-blue-500/20" : "border-white/30"
              }`}
              onClick={() => setIsProfileOpen((value) => !value)}
              type="button"
              aria-expanded={isProfileOpen}
              aria-label="Open profile menu"
            >
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/15 text-sm font-black text-white">
                {currentUser?.profileImageUrl ? (
                  <Image
                    src={currentUser.profileImageUrl}
                    alt={displayName}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  initials
                )}
              </span>
              {isProfileOpen ? (
                <ChevronUp className="h-4 w-4 text-zinc-200" />
              ) : (
                <ChevronDown className="h-4 w-4 text-zinc-200" />
              )}
            </button>

            <AnimatePresence>
              {isProfileOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-xl border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(232,242,255,0.9))] text-zinc-950 shadow-[0_30px_80px_-38px_rgba(15,23,42,0.75)] ring-1 ring-blue-100/80 backdrop-blur-[30px] backdrop-saturate-150"
                >
                  <div className="border-b border-zinc-200/70 bg-white/55 px-5 py-4">
                    <p className="truncate text-base font-black text-zinc-950">
                      {displayName}
                    </p>
                    <p className="mt-1 truncate text-xs font-semibold text-zinc-500">
                      {currentUser?.email}
                    </p>
                  </div>

                  <div className="bg-white/45 p-2">
                    <Link
                      href="/admin/profile"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-zinc-800 transition hover:bg-white/90 cursor-pointer hover:text-zinc-950"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-500 transition hover:bg-red-50/70 cursor-pointer hover:text-red-600"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                      type="button"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
      </div>

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreated={handleEventCreated}
      />
    </>
  );
}
