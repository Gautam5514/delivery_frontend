"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogIn, Mail, Lock, RefreshCw, AlertCircle,
  UserPlus, Key, User, Camera, Zap, Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiCall, setAuthSession } from "../utils/api";
import { useToast } from "@/components/ui/ToastProvider";

const FEATURES = [
  { icon: Camera, label: "Face-matched personal gallery" },
  { icon: Zap,    label: "Instant delivery — no app required" },
  { icon: Shield, label: "Biometric data auto-deleted in 10 days" },
];

const FIELD_VARIANTS = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { opacity: 1, height: "auto", marginBottom: 0 },
};

// ── Reusable input field ───────────────────────────────────────────────────────
function Field({ label, icon, ...inputProps }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600">
          {icon}
        </span>
        <input
          {...inputProps}
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 transition-all duration-150 focus:border-white/20 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-white/10"
        />
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const toast  = useToast();
  const router = useRouter();

  const [role,    setRole]    = useState("user");   // "user" | "admin"
  const [mode,    setMode]    = useState("login");  // "login" | "signup"
  const [form,    setForm]    = useState({ name: "", email: "", password: "", inviteCode: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const isGuest = role === "user";
  const set     = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const switchRole = (r) => {
    setRole(r);
    setMode("login");
    setError("");
    setForm((p) => ({ ...p, inviteCode: "" }));
  };

  const switchMode = (m) => {
    setMode(m);
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = isGuest ? "/auth/guest-login"
        : mode === "signup"    ? "/auth/signup"
        : "/auth/login";

      const payload = isGuest
        ? { email: form.email }
        : {
            email: form.email,
            password: form.password,
            ...(mode === "signup" ? { name: form.name, inviteCode: form.inviteCode } : {}),
          };

      const data = await apiCall(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await setAuthSession(data.token, data.user);
      toast.success(data.user?.role === "admin" ? "Welcome back." : "Access granted.");
      router.push(data.user?.role === "admin" ? "/admin" : "/gallery");
    } catch (err) {
      const message = err.message || "Authentication failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const headingText = isGuest
    ? "Welcome back"
    : mode === "signup" ? "Create account" : "Admin portal";

  const subtitleText = isGuest
    ? "Use the email you registered with at the event."
    : mode === "signup"
    ? "Requires an admin invite code."
    : "Secure access for event operators.";

  const submitLabel = loading
    ? "Please wait…"
    : isGuest
    ? "View my gallery"
    : mode === "signup" ? "Create account" : "Log in";

  const SubmitIcon = loading
    ? RefreshCw
    : !isGuest && mode === "signup" ? UserPlus : LogIn;

  return (
    <div className="relative h-screen overflow-hidden bg-[#090b0f] text-white">

      {/* Subtle dot-grid background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-56 -top-56 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-56 -right-56 h-[500px] w-[500px] rounded-full bg-violet-600/8 blur-[120px]" />
      </div>

      <div className="relative flex h-full">

        {/* ── LEFT BRANDING PANEL ─────────────────────────────────────────── */}
        <aside className="relative hidden w-[44%] shrink-0 flex-col justify-between border-r border-white/[0.06] p-12 lg:flex h-full overflow-y-auto">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <span className="text-sm font-bold text-black leading-none">G</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">FaceDeliver</span>
          </div>

          {/* Hero copy */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium tracking-wide text-zinc-400">
                AI Photo Delivery
              </span>
            </div>

            <h2 className="text-[38px] font-semibold leading-[1.18] tracking-[-0.02em]">
              Every moment,<br />
              delivered to<br />
              the right person.
            </h2>

            <p className="mt-5 max-w-[300px] text-[15px] leading-relaxed text-zinc-500">
              Our face recognition engine scans event photos and routes each image to the exact guest who appears in it.
            </p>

            {/* Feature list */}
            <div className="mt-10 space-y-3">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                    <Icon className="h-3.5 w-3.5 text-zinc-400" />
                  </div>
                  <span className="text-sm text-zinc-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-zinc-700">
            © 2026 FaceDeliver
          </p>
        </aside>

        {/* ── RIGHT FORM PANEL ────────────────────────────────────────────── */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-8 overflow-y-auto">

          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <span className="text-sm font-bold text-black">G</span>
            </div>
            <span className="text-lg font-semibold">FaceDeliver</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-[400px]"
          >
            {/* ── Role pill switcher ─────────────────────────────────────── */}
            <div className="relative mb-6 flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
              {/* Sliding highlight */}
              <motion.div
                className="absolute inset-y-1 w-[calc(50%-4px)] rounded-[10px] border border-white/[0.1] bg-white/[0.08]"
                animate={{ x: role === "user" ? 0 : "calc(100% + 2px)" }}
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
              {[
                { value: "user",  label: "Guest" },
                { value: "admin", label: "Admin" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => switchRole(value)}
                  className={`relative z-10 flex-1 rounded-[10px] py-2 text-sm font-semibold transition-colors duration-150 ${
                    role === value ? "text-white" : "text-zinc-600 hover:text-zinc-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Heading ───────────────────────────────────────────────── */}
            <div className="mb-5">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={headingText}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.18 }}
                  className="text-2xl font-semibold tracking-tight"
                >
                  {headingText}
                </motion.h1>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.p
                  key={subtitleText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="mt-1.5 text-sm text-zinc-500"
                >
                  {subtitleText}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* ── Admin mode tab underlines ──────────────────────────────── */}
            <AnimatePresence>
              {!isGuest && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 overflow-hidden"
                >
                  <div className="flex border-b border-white/[0.08]">
                    {[
                      { value: "login",  label: "Log in" },
                      { value: "signup", label: "Sign up" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => switchMode(value)}
                        className={`relative mr-6 pb-3 text-sm font-medium transition-colors ${
                          mode === value
                            ? "text-white"
                            : "text-zinc-600 hover:text-zinc-400"
                        }`}
                      >
                        {label}
                        {mode === value && (
                          <motion.div
                            layoutId="mode-underline"
                            className="absolute bottom-0 left-0 right-0 h-px bg-white"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Form ──────────────────────────────────────────────────── */}
            <form onSubmit={submit} className="space-y-3">

              {/* Name — admin signup only */}
              <AnimatePresence>
                {!isGuest && mode === "signup" && (
                  <motion.div
                    key="name-field"
                    variants={FIELD_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <Field
                      label="Full name"
                      icon={<User className="h-4 w-4" />}
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={set("name")}
                      required
                      autoComplete="name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email — always */}
              <Field
                label="Email address"
                icon={<Mail className="h-4 w-4" />}
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={set("email")}
                required
                autoComplete="email"
              />

              {/* Password — admin only */}
              <AnimatePresence>
                {!isGuest && (
                  <motion.div
                    key="password-field"
                    variants={FIELD_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <Field
                      label="Password"
                      icon={<Lock className="h-4 w-4" />}
                      type="password"
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={set("password")}
                      required
                      minLength={8}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Invite code — admin signup only */}
              <AnimatePresence>
                {!isGuest && mode === "signup" && (
                  <motion.div
                    key="invite-field"
                    variants={FIELD_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <Field
                      label="Invite code"
                      icon={<Key className="h-4 w-4" />}
                      type="password"
                      placeholder="Enter your invite code"
                      value={form.inviteCode}
                      onChange={set("inviteCode")}
                      required
                      autoComplete="off"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-3.5 py-3 text-sm text-red-400"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-all duration-150 hover:bg-zinc-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SubmitIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                {submitLabel}
              </button>
            </form>

            {/* Footer hint */}
            <p className="mt-6 text-center text-xs leading-relaxed text-zinc-700">
              {isGuest
                ? "No password needed — just the email you used at registration."
                : "Admin accounts require an invite code from your organization."}
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
