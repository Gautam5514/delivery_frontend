"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, RefreshCw, AlertCircle, UserPlus, Key } from "lucide-react";
import { motion } from "framer-motion";
import { apiCall, setAuthSession } from "../utils/api";
import { useToast } from "@/components/ui/ToastProvider";

export default function AuthPage() {
  const toast = useToast();
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ name: "", email: "", password: "", inviteCode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isUserFlow = role === "user";
  const title = useMemo(() => {
    if (isUserFlow) return "Guest Access";
    return mode === "signup" ? "Create Admin Account" : "Admin Login";
  }, [isUserFlow, mode]);

  const subtitle = isUserFlow
    ? "Use the same email you used during QR registration."
    : mode === "signup"
    ? "An invite code is required to create an admin account."
    : "Secure access for event operators.";

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isUserFlow
        ? "/auth/guest-login"
        : mode === "signup"
        ? "/auth/signup"
        : "/auth/login";

      const payload = isUserFlow
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
      toast.success(data.user?.role === "admin" ? "Admin login successful." : "Guest access granted.");
      router.push(data.user?.role === "admin" ? "/admin" : "/gallery");
    } catch (err) {
      const message = err.message || "Authentication failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-zinc-200/70 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-zinc-300/60 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl lg:grid-cols-2"
        >
          <section className="relative hidden lg:flex lg:flex-col lg:justify-between bg-zinc-900 p-9 text-white">
            <div className="absolute right-[-80px] top-[-60px] h-64 w-64 rounded-full bg-zinc-700/30 blur-3xl" />
            <div className="absolute left-[-80px] bottom-[-80px] h-72 w-72 rounded-full bg-zinc-500/20 blur-3xl" />
            <div className="relative">
              <div className="inline-flex rounded-2xl border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-zinc-200">
                Gopo Identity
              </div>
              <h2 className="mt-5 text-5xl font-semibold leading-tight">
                Personal access to every event memory.
              </h2>
              <p className="mt-5 text-lg leading-8 text-zinc-300">
                Login to view matched photos, secure downloads, and premium delivery tools for guests and admins.
              </p>
            </div>
            <div className="relative mt-10 space-y-4">
              {[
                "Face-based private galleries",
                "High-quality downloads",
                "Fast event access with role control",
              ].map((point) => (
                <div key={point} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-200">
                  {point}
                </div>
              ))}
            </div>
          </section>

          <section className="p-7 md:p-9">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-2 text-sm text-zinc-600">{subtitle}</p>
            </div>

            {!isUserFlow && (
              <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-zinc-200 bg-zinc-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setForm((p) => ({ ...p, inviteCode: "" }));
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    mode === "login" ? "bg-zinc-900 text-white" : "text-zinc-600"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    mode === "signup" ? "bg-zinc-900 text-white" : "text-zinc-600"
                  }`}
                >
                  Sign up
                </button>
              </div>
            )}

            <div className="mb-6 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole("user");
                  setMode("login");
                  setError("");
                  setForm((p) => ({ ...p, inviteCode: "" }));
                }}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  role === "user"
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 bg-white text-zinc-600"
                }`}
              >
                Guest
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  role === "admin"
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 bg-white text-zinc-600"
                }`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={submit} className="space-y-5">
              {!isUserFlow && mode === "signup" && (
                <div>
                  <label className="mb-2 block text-sm text-zinc-600">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3.5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm text-zinc-600">Email Address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-300 bg-white py-3.5 pl-11 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                  />
                </div>
              </div>

              {!isUserFlow && (
                <div>
                  <label className="mb-2 block text-sm text-zinc-600">Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      className="w-full rounded-xl border border-zinc-300 bg-white py-3.5 pl-11 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                    />
                  </div>
                </div>
              )}

              {!isUserFlow && mode === "signup" && (
                <div>
                  <label className="mb-2 block text-sm text-zinc-600">Invite Code</label>
                  <div className="relative">
                    <Key className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      required
                      placeholder="Enter your invite code"
                      value={form.inviteCode}
                      onChange={(e) => setForm((p) => ({ ...p, inviteCode: e.target.value }))}
                      className="w-full rounded-xl border border-zinc-300 bg-white py-3.5 pl-11 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3.5 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : mode === "signup" && !isUserFlow ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                {loading ? "Please wait" : isUserFlow ? "Continue to Gallery" : mode === "signup" ? "Create Admin Account" : "Login to Admin"}
              </button>
            </form>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
