"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  Bell,
  BellOff,
  Camera,
  Clock,
  Loader2,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  apiCall,
  getAuthUser,
  setAuthSession,
  updateAuthUser,
} from "@/app/utils/api";
import { useToast } from "@/components/ui/ToastProvider";

// ─── Preferences (localStorage, no backend needed) ────────────────────────────

const PREFS_KEY = "gopo_admin_prefs";

const loadPrefs = () => {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(PREFS_KEY) || "{}"); }
  catch { return {}; }
};

const savePrefs = (prefs) => {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); }
  catch { /* quota exceeded — non-fatal */ }
};

const getInitials = (name) =>
  String(name || "A").trim().charAt(0).toUpperCase();

// ─── Shared primitives ────────────────────────────────────────────────────────

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionLabel = ({ eyebrow, title, description }) => (
  <div className="border-b border-zinc-100 px-6 py-4">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
      {eyebrow}
    </p>
    <h2 className="mt-0.5 text-base font-black tracking-tight text-zinc-950">
      {title}
    </h2>
    {description && (
      <p className="mt-0.5 text-xs leading-5 text-zinc-500">{description}</p>
    )}
  </div>
);

// ─── Toggle ───────────────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
      checked ? "bg-zinc-900" : "bg-zinc-200"
    }`}
  >
    <span
      style={{ height: 18, width: 18 }}
      className={`inline-block transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

// ─── Delete-account modal ─────────────────────────────────────────────────────

const DeleteModal = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-black tracking-tight text-zinc-950">
        Delete your account?
      </h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        This is permanent and cannot be undone. All events, guests, photos, and
        billing history will be removed. Please contact support to proceed.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
        >
          Cancel
        </button>
        <a
          href="mailto:support@hellobj.me?subject=Account+Deletion+Request"
          onClick={onClose}
          className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-red-700"
        >
          Contact Support
        </a>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminProfilePage() {
  const toast = useToast();
  const fileInputRef = useRef(null);

  // ── Profile state ──
  const [profile, setProfile] = useState(() => getAuthUser() || {});
  const [name, setName] = useState(() => getAuthUser()?.name || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Preferences state ──
  const [prefs, setPrefs] = useState(() => ({
    notifyOnMatchComplete: true,
    notifyOnGuestDownload: false,
    ...loadPrefs(),
  }));

  // ── Danger zone ──
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ── Load profile from server ──
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await apiCall("/auth/me");
        if (!cancelled && data.success) {
          setProfile(data.user);
          setName(data.user.name || "");
          updateAuthUser(data.user);
          window.dispatchEvent(new Event("admin-profile-updated"));
        }
      } catch (err) {
        if (!cancelled) toast.error(err.message || "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [toast]);

  // ── Preview URL lifecycle ──
  useEffect(() => {
    if (!selectedImage) { setPreviewUrl(""); return; }
    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  const avatarSrc = previewUrl || profile?.profileImageUrl || "";
  const initials = useMemo(
    () => getInitials(name || profile?.name),
    [name, profile?.name]
  );

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.warning("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.warning("Profile image must be under 2 MB.");
      return;
    }
    setSelectedImage(file);
    toast.info("Image selected — save to apply.");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      if (selectedImage) fd.append("profileImage", selectedImage);
      const data = await apiCall("/auth/me", { method: "PUT", body: fd });
      if (data.success) {
        setProfile(data.user);
        setName(data.user.name || "");
        setSelectedImage(null);
        await setAuthSession(data.token, data.user);
        window.dispatchEvent(new Event("admin-profile-updated"));
        toast.success("Profile saved.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const setPref = (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    savePrefs(next);
    toast.success("Preference saved.");
  };

  const privacyItems = [
    {
      icon: Clock,
      title: "10-day guest data retention",
      body: "Guest selfies and face descriptors are deleted automatically 10 days after creation.",
    },
    {
      icon: ShieldCheck,
      title: "Biometric data handling",
      body: "Face descriptors are used only for matching within your events and never shared.",
    },
    {
      icon: Lock,
      title: "Event isolation",
      body: "Your events, guests, and photos are scoped solely to this admin account.",
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-950">Profile &amp; Account</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Update your photo, name, notification preferences, and privacy settings.
        </p>
      </div>

      {/* ── Edit Profile ── */}
      <Card>
        <SectionLabel
          eyebrow="Identity"
          title="Display name &amp; photo"
          description="Shown in the sidebar and header across the admin panel."
        />
        <form onSubmit={handleSave} className="p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">

            {/* ── Avatar (compact, natural height) ── */}
            <div className="flex shrink-0 flex-col items-center gap-3">
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-zinc-900 text-3xl font-black text-white shadow-lg ring-4 ring-zinc-100">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt={name || "Admin"}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center">
                    {initials}
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
              >
                <Camera className="h-3.5 w-3.5" />
                Change
              </button>
              <p className="text-center text-[10px] leading-4 text-zinc-400">
                JPG / PNG<br />max 2 MB
              </p>
            </div>

            {/* ── Fields ── */}
            <div className="flex w-full flex-col gap-4 sm:flex-1">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                  Display Name
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm focus-within:border-zinc-400 focus-within:ring-4 focus-within:ring-zinc-100">
                  <UserRound className="h-4 w-4 shrink-0 text-zinc-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full bg-transparent text-sm font-semibold text-zinc-950 outline-none placeholder:font-normal placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                  Email Address
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                  <span className="truncate text-sm font-semibold text-zinc-500">
                    {profile?.email || "—"}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-zinc-400">
                  Email is used for login and cannot be changed.
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={saving || loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Profile
                </button>
              </div>
            </div>

          </div>
        </form>
      </Card>

      {/* ── Preferences ── */}
      <Card>
        <SectionLabel
          eyebrow="Preferences"
          title="Notifications"
          description="Saved locally on this device."
        />
        <div className="divide-y divide-zinc-100 px-6">
          {[
            {
              icon: Bell,
              key: "notifyOnMatchComplete",
              label: "Matching complete",
              desc: "When face matching finishes and guests are emailed.",
            },
            {
              icon: BellOff,
              key: "notifyOnGuestDownload",
              label: "Guest first download",
              desc: "When a guest downloads their matched photos for the first time.",
            },
          ].map(({ icon: Icon, key, label, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-6 py-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">{label}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{desc}</p>
                </div>
              </div>
              <Toggle
                checked={!!prefs[key]}
                onChange={(val) => setPref(key, val)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* ── Data & Privacy ── */}
      <Card>
        <SectionLabel
          eyebrow="Privacy"
          title="Data &amp; privacy"
          description="How FaceDeliver handles your event data."
        />
        <div className="space-y-2 p-6">
          {privacyItems.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-600 shadow-sm ring-1 ring-zinc-200">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">{title}</p>
                <p className="mt-0.5 text-xs leading-5 text-zinc-500">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Danger zone ── */}
      <Card className="border-red-200">
        <SectionLabel
          eyebrow="Danger Zone"
          title="Destructive actions"
          description="Permanent and cannot be undone."
        />
        <div className="p-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-red-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-zinc-900">Delete account</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Removes your account, all events, guests, photos, and billing data.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>
      </Card>

      {/* ── Delete modal ── */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteModal onClose={() => setShowDeleteModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
