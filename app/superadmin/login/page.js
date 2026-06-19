"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock, LogIn, Mail, ShieldEllipsis } from "lucide-react";
import { motion } from "framer-motion";
import { getSuperadminUser, setSuperadminSession, superadminApiCall } from "../../utils/api";
import { useToast } from "@/components/ui/ToastProvider";

export default function SuperadminLoginPage() {
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getSuperadminUser();
    if (user?.role === "superadmin") {
      router.replace("/superadmin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await superadminApiCall("/superadmin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      await setSuperadminSession(data.token, data.user);
      toast.success("Superadmin login successful.");
      router.push("/superadmin/dashboard");
    } catch (err) {
      const message = err.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-20%] h-[520px] w-[520px] rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-yellow-500/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]"
        >
          <section className="relative hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),_transparent_40%),linear-gradient(135deg,#111827_0%,#0f172a_45%,#1d4ed8_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-white/75">
                <ShieldEllipsis className="h-3.5 w-3.5" />
                Superadmin Access
              </div>
              <h1 className="mt-6 max-w-md text-5xl font-semibold leading-tight">
                Control every paid admin account from one cockpit.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
                Review subscriptions, revenue, billing periods, and paid admin activity from a dedicated superadmin dashboard.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "One private login for the platform owner",
                "Full subscription visibility across admins",
                "Revenue and payment tracking in one place",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-7 text-zinc-900 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">Superadmin</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">Secure platform login</h2>
                <p className="mt-2 text-sm text-zinc-500">This login is separate from standard admin and guest access.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-zinc-600">Email Address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-2xl border border-zinc-300 bg-white py-3.5 pl-11 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                      placeholder="superadmin@facedeliver.shop"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-600">Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                      className="w-full rounded-2xl border border-zinc-300 bg-white py-3.5 pl-11 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
                      placeholder="Enter superadmin password"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3.5 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogIn className="h-5 w-5" />
                  {loading ? "Signing in..." : "Login to Superadmin"}
                </button>
              </form>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
