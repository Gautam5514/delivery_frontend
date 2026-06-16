"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Image as ImageIcon,
  RefreshCw,
  LogOut,
  Archive,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Trash2,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Layers,
  LayoutGrid,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiCall, authFetch, getAuthUser, clearAuthSession } from "../utils/api";
import Image from "next/image";
import { useToast } from "@/components/ui/ToastProvider";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Stable aspect ratio seeded from the photo id so the masonry never
// re-shuffles on re-render (avoids the random-on-every-render bug).
const stableAspect = (id = "") => {
  const n = [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return n % 3 === 0 ? 0.72 : n % 3 === 1 ? 1.05 : 1.42;
};

const buildColumns = (photos, numCols) => {
  const cols = Array.from({ length: numCols }, () => []);
  photos.forEach((p, i) => cols[i % numCols].push({ ...p, localIdx: i }));
  return cols;
};

// Shared anchor-click download helper — avoids duplicating the same
// createElement / click / revokeObjectURL pattern across multiple actions.
const triggerDownload = (url, filename) => {
  const a = Object.assign(document.createElement("a"), {
    href: url, download: filename, style: "display:none",
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const LOADING_STEPS = [
  "Scanning the event album for every frame you appear in",
  "Matching your selfie against the full event collection",
  "Organising your photos by event",
];

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar event item
// ─────────────────────────────────────────────────────────────────────────────

function SidebarItem({ label, sub, photoCount, initial, isActive, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
        isActive
          ? "bg-zinc-900 shadow-sm shadow-zinc-900/20"
          : "hover:bg-zinc-100"
      }`}
    >
      {/* Avatar / icon */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
          isActive
            ? "bg-white/15 text-white"
            : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200"
        }`}
      >
        {icon || initial}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold leading-tight ${isActive ? "text-white" : "text-zinc-800"}`}>
          {label}
        </p>
        {sub && (
          <p className={`truncate text-[11px] leading-tight ${isActive ? "text-white/55" : "text-zinc-400"}`}>
            {sub}
          </p>
        )}
      </div>

      {/* Count badge */}
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ${
          isActive ? "bg-white/15 text-white/80" : "bg-zinc-200 text-zinc-500"
        }`}
      >
        {photoCount}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Photo card (inside masonry)
// ─────────────────────────────────────────────────────────────────────────────

function PhotoCard({ photo, eventName, globalIdx, onOpen, onDownload }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative w-full cursor-zoom-in overflow-hidden rounded-2xl bg-zinc-100 shadow-sm ring-1 ring-zinc-200/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-zinc-300"
      onClick={() => onOpen(globalIdx)}
    >
      <div
        className="relative w-full"
        style={{ paddingBottom: `${(1 / stableAspect(String(photo.id))) * 100}%` }}
      >
        <Image
          src={photo.url}
          alt="Event photo"
          fill
          className="absolute inset-0 object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Download button on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onDownload(photo.id, `${eventName}-photo.jpg`); }}
        className="absolute bottom-3 right-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white/90 text-zinc-900 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white"
      >
        <Download className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const toast  = useToast();
  const router = useRouter();

  // ── Data ──────────────────────────────────────────────────────────────────
  const [eventGroups,  setEventGroups]  = useState([]);
  const [guestName,    setGuestName]    = useState("");
  const [selfieUrl,    setSelfieUrl]    = useState(null);
  const [totalPhotos,  setTotalPhotos]  = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [loadingStep,  setLoadingStep]  = useState(0);
  const [error,        setError]        = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── UI ────────────────────────────────────────────────────────────────────
  const [activeEventId,    setActiveEventId]    = useState("all");
  const [lightboxIdx,      setLightboxIdx]      = useState(null);
  const [touchStartX,      setTouchStartX]      = useState(null);
  const [isZipDownloading, setIsZipDownloading] = useState(false);
  const [showDeleteConfirm,setShowDeleteConfirm]= useState(false);
  const [isDeleting,       setIsDeleting]       = useState(false);
  const [dataDeleted,      setDataDeleted]      = useState(false);
  const [columns,          setColumns]          = useState(3);
  const [mobileSidebarOpen,setMobileSidebarOpen]= useState(false);
  const [eventsExpanded,   setEventsExpanded]   = useState(true);

  // ── Responsive columns (content area only, not full viewport) ─────────────
  useEffect(() => {
    const calc = () => {
      // Sidebar takes 256px on lg+, so content width is smaller
      if (window.innerWidth < 640)  return setColumns(2);
      if (window.innerWidth < 1024) return setColumns(3);
      if (window.innerWidth < 1400) return setColumns(3);
      setColumns(4);
    };
    window.addEventListener("resize", calc);
    calc();
    return () => window.removeEventListener("resize", calc);
  }, []);

  // ── Loading animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading) return;
    const id = setInterval(
      () => setLoadingStep((s) => (s + 1) % LOADING_STEPS.length),
      1800
    );
    return () => clearInterval(id);
  }, [loading]);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchGallery = useCallback(
    async (manual = false) => {
      manual ? setIsRefreshing(true) : setLoading(true);
      setError("");
      try {
        const data = await apiCall("/guests/matches/me");
        setGuestName(data.guestName || "Guest");
        setSelfieUrl(data.selfieUrl || null);
        setTotalPhotos(data.totalPhotos || 0);
        setEventGroups(data.events || []);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Unable to load gallery.");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!getAuthUser()) { router.replace("/login"); return; }
    fetchGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const activeGroup = useMemo(
    () => eventGroups.find((eg) => eg.eventId === activeEventId) || null,
    [eventGroups, activeEventId]
  );

  // All photos visible given the current selection (flat list for lightbox)
  const flatVisible = useMemo(() => {
    if (activeEventId === "all") {
      return eventGroups.flatMap((eg) =>
        eg.photos.map((p) => ({ ...p, eventName: eg.eventName }))
      );
    }
    return (activeGroup?.photos || []).map((p) => ({
      ...p,
      eventName: activeGroup?.eventName || "",
    }));
  }, [activeEventId, eventGroups, activeGroup]);

  // Column arrays — only computed for the single-event view.
  // In the "all events" view each section builds its own columns inline,
  // so computing this here would be wasted work for multi-event renders.
  const colArrays = useMemo(
    () => activeEventId !== "all" ? buildColumns(flatVisible, columns) : [],
    [activeEventId, flatVisible, columns]
  );

  // ── Actions ────────────────────────────────────────────────────────────────
  const downloadImage = useCallback(async (photoId, name) => {
    try {
      const data = await apiCall(`/guests/photos/${photoId}/download`, { method: "POST" });
      if (!data?.url) throw new Error("No download URL");
      const resp = await fetch(data.url);
      if (!resp.ok) throw new Error("Fetch failed");
      const blob = await resp.blob();
      triggerDownload(URL.createObjectURL(blob), name || "photo.jpg");
      toast.success("Download started.");
    } catch (e) {
      toast.error(e.message || "Download failed.");
    }
  }, [toast]);

  const downloadAllZip = useCallback(async () => {
    if (!totalPhotos) return;
    setIsZipDownloading(true);
    try {
      const resp = await authFetch("/guests/photos/download-all");
      if (!resp.ok) throw new Error("Download failed");
      const blob = await resp.blob();
      triggerDownload(URL.createObjectURL(blob), `${guestName}-photos.zip`);
      toast.success("Archive download started.");
    } catch {
      toast.error("Could not download ZIP. Try again.");
    } finally {
      setIsZipDownloading(false);
    }
  }, [totalPhotos, guestName, toast]);

  const logout = useCallback(async () => {
    await clearAuthSession();
    router.push("/login");
  }, [router]);

  const handleDeleteMyData = useCallback(async () => {
    setIsDeleting(true);
    try {
      await apiCall("/guests/me", { method: "DELETE" });
      await clearAuthSession();
      setDataDeleted(true);
    } catch (e) {
      toast.error(e.message || "Deletion failed. Try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [toast]);

  const prevPhoto = useCallback(
    () => setLightboxIdx((i) => (i > 0 ? i - 1 : flatVisible.length - 1)),
    [flatVisible.length]
  );
  const nextPhoto = useCallback(
    () => setLightboxIdx((i) => (i < flatVisible.length - 1 ? i + 1 : 0)),
    [flatVisible.length]
  );

  useEffect(() => {
    const handler = (e) => {
      if (lightboxIdx === null) return;
      if (e.key === "ArrowLeft")  prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "Escape")     setLightboxIdx(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, prevPhoto, nextPhoto]);

  // Close mobile sidebar when an event is selected
  const selectEvent = useCallback((id) => {
    setActiveEventId(id);
    setMobileSidebarOpen(false);
  }, []);

  // ── Data-deleted screen ────────────────────────────────────────────────────
  if (dataDeleted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-2xl"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
            <CheckCircle className="h-8 w-8 text-zinc-700" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-zinc-900">Data Deleted</h2>
          <p className="mb-7 text-sm leading-relaxed text-zinc-500">
            Your selfie, face descriptor, matches, and download history have
            been permanently removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full rounded-2xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Sidebar content (shared between desktop fixed + mobile drawer) ─────────
  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand / user */}
      <div className="border-b border-zinc-100 px-4 pb-4 pt-5">
        <div className="flex items-center gap-3">
          {/* Profile photo — selfie uploaded at registration, falls back to letter */}
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-zinc-200 shadow-sm">
            {selfieUrl ? (
              <Image
                src={selfieUrl}
                alt={guestName}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-sm font-bold text-white">
                {guestName.charAt(0).toUpperCase() || "G"}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-zinc-900">{guestName || "Guest"}</p>
            <p className="text-[11px] text-zinc-400">{totalPhotos} photos matched</p>
          </div>
        </div>
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
          Events
        </p>

        {/* All Photos — with dropdown toggle when multiple events exist */}
        <div className="overflow-hidden rounded-xl">
          <div
            className={`flex items-center rounded-xl transition-all duration-150 ${
              activeEventId === "all"
                ? "bg-zinc-900 shadow-sm shadow-zinc-900/20"
                : "hover:bg-zinc-100"
            }`}
          >
            {/* Left: click to select "all" */}
            <button
              onClick={() => selectEvent("all")}
              className="flex flex-1 items-center gap-3 px-3 py-2.5 text-left"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                activeEventId === "all"
                  ? "bg-white/15 text-white"
                  : "bg-zinc-100 text-zinc-600"
              }`}>
                <LayoutGrid className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold leading-tight ${activeEventId === "all" ? "text-white" : "text-zinc-800"}`}>
                  All Photos
                </p>
                <p className={`text-[11px] leading-tight ${activeEventId === "all" ? "text-white/55" : "text-zinc-400"}`}>
                  {eventGroups.length} event{eventGroups.length !== 1 ? "s" : ""}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ${
                activeEventId === "all" ? "bg-white/15 text-white/80" : "bg-zinc-200 text-zinc-500"
              }`}>
                {totalPhotos}
              </span>
            </button>

            {/* Right: chevron toggle — only shown when there are multiple events */}
            {eventGroups.length > 1 && (
              <button
                onClick={() => setEventsExpanded((v) => !v)}
                className={`mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  activeEventId === "all"
                    ? "text-white/60 hover:bg-white/10 hover:text-white"
                    : "text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700"
                }`}
                title={eventsExpanded ? "Collapse events" : "Expand events"}
              >
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${eventsExpanded ? "rotate-0" : "-rotate-90"}`} />
              </button>
            )}
          </div>

          {/* Dropdown: individual events */}
          <AnimatePresence initial={false}>
            {eventsExpanded && eventGroups.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-zinc-100 pl-3">
                  {eventGroups.map((eg) => (
                    <button
                      key={eg.eventId}
                      onClick={() => selectEvent(eg.eventId)}
                      className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150 ${
                        activeEventId === eg.eventId
                          ? "bg-zinc-900 shadow-sm shadow-zinc-900/20"
                          : "hover:bg-zinc-100"
                      }`}
                    >
                      {/* Initial avatar */}
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold transition-colors ${
                        activeEventId === eg.eventId
                          ? "bg-white/15 text-white"
                          : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200"
                      }`}>
                        {eg.eventName.charAt(0).toUpperCase()}
                      </div>
                      {/* Name + date */}
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-xs font-semibold leading-tight ${activeEventId === eg.eventId ? "text-white" : "text-zinc-800"}`}>
                          {eg.eventName}
                        </p>
                        {formatDate(eg.eventDate) && (
                          <p className={`text-[10px] leading-tight ${activeEventId === eg.eventId ? "text-white/50" : "text-zinc-400"}`}>
                            {formatDate(eg.eventDate)}
                          </p>
                        )}
                      </div>
                      {/* Count */}
                      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                        activeEventId === eg.eventId ? "bg-white/15 text-white/80" : "bg-zinc-200 text-zinc-500"
                      }`}>
                        {eg.photos.length}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="space-y-1 border-t border-zinc-100 px-3 py-3">
        {totalPhotos > 0 && (
          <button
            onClick={downloadAllZip}
            disabled={isZipDownloading}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50"
          >
            {isZipDownloading
              ? <RefreshCw className="h-4 w-4 animate-spin text-zinc-400" />
              : <Archive className="h-4 w-4 text-zinc-400" />
            }
            {isZipDownloading ? "Preparing…" : "Download All"}
          </button>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
        >
          <LogOut className="h-4 w-4 text-zinc-400" />
          Log Out
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
          Delete My Data
        </button>
        <div className="flex items-start gap-2 px-3 pt-1">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-300" />
          <p className="text-[10px] leading-relaxed text-zinc-300">
            Face data auto-deleted 10 days after each event.
          </p>
        </div>
      </div>
    </div>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="relative flex min-h-screen bg-zinc-50">

      {/* ── Desktop sidebar (lg+) ──────────────────────────────────────── */}
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          {sidebarContent}
        </div>
      </aside>

      {/* ── Mobile sidebar drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 overflow-hidden border-r border-zinc-200 bg-white shadow-2xl lg:hidden"
            >
              {/* Close handle */}
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500"
              >
                <X className="h-4 w-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Content area ──────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col">

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-xl">
          <div className="flex h-14 items-center gap-3 px-4 lg:px-6">

            {/* Mobile: hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-100 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Active event title */}
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              {activeEventId !== "all" && activeGroup ? (
                <>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
                    {activeGroup.eventName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-zinc-900">
                      {activeGroup.eventName}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      {activeGroup.photos.length} photos
                      {formatDate(activeGroup.eventDate)
                        ? ` · ${formatDate(activeGroup.eventDate)}`
                        : ""}
                    </p>
                  </div>
                </>
              ) : (
                <div className="min-w-0">
                  <p className="text-sm font-bold text-zinc-900">All Photos</p>
                  <p className="text-[11px] text-zinc-400">
                    {totalPhotos} photos · {eventGroups.length} event{eventGroups.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>

            {/* Right actions */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => fetchGallery(true)}
                disabled={isRefreshing}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-100 disabled:opacity-40"
                title="Refresh"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
              {/* Mobile: Download All visible in topbar */}
              {totalPhotos > 0 && (
                <button
                  onClick={downloadAllZip}
                  disabled={isZipDownloading}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-40 lg:hidden"
                >
                  {isZipDownloading
                    ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    : <Archive className="h-3.5 w-3.5" />
                  }
                  {isZipDownloading ? "Zipping…" : "Download All"}
                </button>
              )}
            </div>
          </div>

          {/* ── Mobile: horizontal event chips ── */}
          {!loading && eventGroups.length > 0 && (
            <div className="flex gap-2 overflow-x-auto border-t border-zinc-100 px-4 py-2 scrollbar-none lg:hidden">
              <button
                onClick={() => selectEvent("all")}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeEventId === "all"
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                All · {totalPhotos}
              </button>
              {eventGroups.map((eg) => (
                <button
                  key={eg.eventId}
                  onClick={() => selectEvent(eg.eventId)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    activeEventId === eg.eventId
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {eg.eventName} · {eg.photos.length}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* ── Page content ──────────────────────────────────────────────── */}
        <main className="flex-1 px-4 py-8 lg:px-8">

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[60vh] items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-zinc-100">
                  <motion.div
                    className="h-full w-1/3 rounded-full bg-zinc-900"
                    animate={{ x: ["-10%", "220%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  AI Matching
                </p>
                <h3 className="mb-5 text-2xl font-bold text-zinc-900">
                  Finding your photos…
                </h3>
                <div className="space-y-2.5">
                  {LOADING_STEPS.map((step, i) => (
                    <motion.div
                      key={step}
                      animate={{ opacity: loadingStep === i ? 1 : 0.4, scale: loadingStep === i ? 1 : 0.98 }}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                        loadingStep === i
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-400"
                      }`}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        loadingStep === i ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                      }`}>{i + 1}</span>
                      {step}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Error / empty */}
          {!loading && (error || totalPhotos === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-[50vh] flex-col items-center justify-center text-center"
            >
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-zinc-200 bg-white shadow-xl">
                {error
                  ? <X className="h-8 w-8 text-red-400" />
                  : <ImageIcon className="h-8 w-8 text-zinc-400" />
                }
              </div>
              <h2 className="mb-2 text-xl font-bold text-zinc-900">
                {error ? "Unable to load gallery" : "No photos found yet"}
              </h2>
              <p className="mb-8 max-w-xs text-sm text-zinc-500">
                {error
                  ? error
                  : "Photos are still being processed. Check back in a few minutes."
                }
              </p>
              <button
                onClick={() => fetchGallery(true)}
                className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </motion.div>
          )}

          {/* ── Photo grid ──────────────────────────────────────────────── */}
          {!loading && flatVisible.length > 0 && (
            <>
              {/* Grid subtitle when viewing all events: show event section labels */}
              {activeEventId === "all" ? (
                <div className="space-y-12">
                  {eventGroups.map((eg, gi) => {
                    const offset = eventGroups
                      .slice(0, gi)
                      .reduce((acc, g) => acc + g.photos.length, 0);
                    const egCols = buildColumns(eg.photos, columns);
                    return (
                      <section key={eg.eventId}>
                        {/* Section divider */}
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-xs font-bold text-white">
                            {eg.eventName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900">{eg.eventName}</p>
                            <p className="text-[11px] text-zinc-400">
                              {eg.photos.length} photos
                              {formatDate(eg.eventDate) ? ` · ${formatDate(eg.eventDate)}` : ""}
                            </p>
                          </div>
                          <div className="ml-2 h-px flex-1 bg-zinc-200" />
                          <button
                            onClick={() => setActiveEventId(eg.eventId)}
                            className="shrink-0 text-[11px] font-medium text-zinc-400 hover:text-zinc-700 transition"
                          >
                            View only →
                          </button>
                        </div>

                        {/* Masonry for this event */}
                        <div className="flex gap-3 sm:gap-4">
                          {egCols.map((col, ci) => (
                            <div key={ci} className="flex flex-1 flex-col gap-3 sm:gap-4">
                              {col.map((photo) => (
                                <PhotoCard
                                  key={photo.id}
                                  photo={photo}
                                  eventName={eg.eventName}
                                  globalIdx={offset + photo.localIdx}
                                  onOpen={setLightboxIdx}
                                  onDownload={downloadImage}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              ) : (
                /* Single-event view: clean masonry, no section labels needed */
                <div className="flex gap-3 sm:gap-4">
                  {colArrays.map((col, ci) => (
                    <div key={ci} className="flex flex-1 flex-col gap-3 sm:gap-4">
                      {col.map((photo) => (
                        <PhotoCard
                          key={photo.id}
                          photo={photo}
                          eventName={activeGroup?.eventName || ""}
                          globalIdx={photo.localIdx}
                          onOpen={setLightboxIdx}
                          onDownload={downloadImage}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Delete confirmation modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => { if (!isDeleting) setShowDeleteConfirm(false); }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{    scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">Delete All My Data</h3>
                  <p className="text-xs text-zinc-500">Permanent · cannot be undone</p>
                </div>
              </div>
              <ul className="mb-6 space-y-2">
                {[
                  "Your selfie photo and face descriptor",
                  "All matched photos across every event",
                  "Your complete download history",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-600">
                    <span className="shrink-0 text-red-400">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 rounded-2xl border border-zinc-300 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteMyData}
                  disabled={isDeleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {isDeleting
                    ? <><RefreshCw className="h-4 w-4 animate-spin" />Deleting…</>
                    : <><Trash2 className="h-4 w-4" />Delete Everything</>
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lightbox ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIdx !== null && flatVisible[lightboxIdx] && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/96"
            onClick={() => setLightboxIdx(null)}
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null) return;
              const touchEndX = e.changedTouches[0].clientX;
              const diffX = touchStartX - touchEndX;
              if (diffX > 50) {
                nextPhoto();
              } else if (diffX < -50) {
                prevPhoto();
              }
              setTouchStartX(null);
            }}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute right-5 top-5 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Event context label */}
            <div className="absolute left-5 top-5 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-white/20 text-[10px] font-bold text-white">
                {flatVisible[lightboxIdx].eventName?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-white/80">
                {flatVisible[lightboxIdx].eventName}
              </span>
            </div>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              className="absolute left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/60 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Photo */}
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="relative h-[84vh] w-[88vw] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={flatVisible[lightboxIdx].url}
                alt="Full view"
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              className="absolute right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/60 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Bottom bar */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-10">
              <div className="mx-auto flex max-w-4xl items-center justify-between">
                <span className="text-sm text-white/50">
                  {lightboxIdx + 1} / {flatVisible.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(
                      flatVisible[lightboxIdx].id,
                      `${flatVisible[lightboxIdx].eventName}-photo.jpg`
                    );
                  }}
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-zinc-200"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
