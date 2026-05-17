"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Upload, CheckCircle, Loader2, Sparkles, X,
    ArrowLeft, Copy, Globe2, Users,
    Download, Image as ImageIcon, ShieldCheck, CreditCard,
    RefreshCw, Paintbrush, Trash2, AlertTriangle, Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiCall } from "@/app/utils/api";
import Link from "next/link";
import CustomQRCode from "@/components/ui/CustomQRCode";
import { useToast } from "@/components/ui/ToastProvider";

const getDisplayWebsite = (value) =>
    String(value || "").trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");

const StatCard = ({ icon: Icon, label, value, accent }) => (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-zinc-900">{value}</p>
            </div>
            <div className={`rounded-xl p-3 ${accent}`}>
                <Icon className="h-5 w-5" />
            </div>
        </div>
    </div>
);

export default function EventDetailsPage() {
    const toast = useToast();
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Upload state
    const [photos, setPhotos] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadPhase, setUploadPhase] = useState("idle"); // "idle" | "compressing" | "uploading"
    const [uploadPhaseDetail, setUploadPhaseDetail] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const fileInputRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Stats
    const [downloadStats, setDownloadStats] = useState({
        todayDownloads: 0,
        allTimeDownloads: 0,
        totalPhotos: 0,
        downloadedPhotos: 0,
        uniqueGuestsDownloaded: 0,
        downloadCoveragePercent: 0,
    });
    const [billing, setBilling] = useState({ subscription: null, usage: null });
    const [retryingMatch, setRetryingMatch] = useState(false);
    const [isQrBrandingOpen, setIsQrBrandingOpen] = useState(false);
    const [qrWebsiteLabel, setQrWebsiteLabel] = useState("");
    const [isQrLogoOpen,    setIsQrLogoOpen]    = useState(false);
    const [qrLogoSrc,       setQrLogoSrc]       = useState(null);
    const [qrLogoDragging,  setQrLogoDragging]  = useState(false);
    const logoInputRef = useRef(null);
    const [statsLoading, setStatsLoading] = useState(false);

    const fetchDownloadStats = useCallback(async (code) => {
        if (!code) return;
        setStatsLoading(true);
        try {
            const data = await apiCall(`/admin/download-stats?eventId=${encodeURIComponent(code)}`);
            setDownloadStats({
                todayDownloads:          data.todayDownloads          ?? 0,
                allTimeDownloads:        data.allTimeDownloads        ?? 0,
                totalPhotos:             data.totalPhotos             ?? 0,
                downloadedPhotos:        data.downloadedPhotos        ?? 0,
                uniqueGuestsDownloaded:  data.uniqueGuestsDownloaded  ?? 0,
                downloadCoveragePercent: data.downloadCoveragePercent ?? 0,
            });
        } catch (err) {
            console.error("Download stats fetch failed:", err);
            toast.warning("Delivery stats could not be refreshed.");
        } finally {
            setStatsLoading(false);
        }
    }, [toast]);

    const fetchEventData = useCallback(async () => {
        try {
            setLoading(true);
            const [data, billingData] = await Promise.all([
                apiCall(`/admin/events/${params.id}`),
                apiCall("/billing/status"),
            ]);
            if (data.success) {
                setEvent(data.event);
                fetchDownloadStats(data.event.code);
            } else {
                router.push("/admin/events");
            }
            setBilling({
                subscription: billingData.subscription,
                usage: billingData.usage,
            });
        } catch (err) {
            console.error(err);
            toast.error("Event details could not be loaded.");
            router.push("/admin/events");
        } finally {
            setLoading(false);
        }
    }, [params.id, router, toast, fetchDownloadStats]);

    useEffect(() => {
        fetchEventData();
    }, [fetchEventData]);

    useEffect(() => {
        if (!event?.code) return;
        const id = setInterval(() => {
            if (document.visibilityState === "visible") {
                fetchDownloadStats(event.code);
            }
        }, 30_000);
        return () => clearInterval(id);
    }, [event?.code, fetchDownloadStats]);

    // Silent background refresh — no loading spinner, no redirect on error.
    // Runs every 10 s while photos are still in the processing queue so the
    // "X photos still being processed" banner disappears automatically once
    // the job runner finishes, and stats/match count stay up-to-date.
    const refreshEventSilently = useCallback(async () => {
        try {
            const data = await apiCall(`/admin/events/${params.id}`);
            if (!data.success) return;
            setEvent(data.event);
            if (data.event.pendingProcessing === 0) {
                // Processing just finished — refresh stats so match count updates
                fetchDownloadStats(data.event.code);
            }
        } catch {
            // Swallow — this is a background poll, not a user-triggered action
        }
    }, [params.id, fetchDownloadStats]);

    useEffect(() => {
        if (!event?.pendingProcessing || event.pendingProcessing === 0) return;
        const id = setInterval(() => {
            if (document.visibilityState === "visible") refreshEventSilently();
        }, 10_000);
        return () => clearInterval(id);
    }, [event?.pendingProcessing, refreshEventSilently]);

    useEffect(() => {
        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [previews]);

    // ── Image compression ─────────────────────────────────────────────────────
    // createImageBitmap works directly from a File object — no URL, no
    // cross-origin check, no tainted-canvas risk.
    const compressImage = async (file) => {
        try {
            const bitmap = await createImageBitmap(file);
            const MAX_DIM = 1600;
            const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
            const w = Math.round(bitmap.width * scale);
            const h = Math.round(bitmap.height * scale);
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
            bitmap.close();
            return await new Promise((resolve) =>
                canvas.toBlob(
                    (blob) => resolve(blob ? new File([blob], file.name, { type: "image/jpeg" }) : file),
                    "image/jpeg",
                    0.85
                )
            );
        } catch {
            return file;
        }
    };

    // ── File validation & selection ───────────────────────────────────────────
    const validateAndAddFiles = useCallback((fileList) => {
        const incoming = Array.from(fileList || []);
        if (!incoming.length) return;

        const imageFiles = incoming.filter(f => f.type.startsWith("image/"));
        const nonImages = incoming.length - imageFiles.length;
        if (nonImages > 0) {
            toast.warning(`${nonImages} non-image file${nonImages > 1 ? "s" : ""} skipped.`);
        }
        if (!imageFiles.length) return;

        // 20 MB client-side guard — the backend compresses before checking its 5 MB
        // limit, so only truly huge originals need to be rejected here.
        const MAX_RAW_SIZE = 20 * 1024 * 1024;
        const valid    = imageFiles.filter(f => f.size <= MAX_RAW_SIZE);
        const oversized = imageFiles.filter(f => f.size >  MAX_RAW_SIZE);
        if (oversized.length) {
            toast.warning(`${oversized.length} file${oversized.length > 1 ? "s" : ""} over 20 MB skipped.`);
        }
        if (!valid.length) return;

        setPhotos(prev => {
            const combined = [...prev, ...valid];
            if (combined.length > 300) {
                const dropped = combined.length - 300;
                toast.warning(`Selection capped at 300 photos. ${dropped} file${dropped > 1 ? "s" : ""} not added.`);
            }
            return combined.slice(0, 300);
        });
        setPreviews(prev => {
            const newUrls = valid.slice(0, 300 - prev.length).map(f => URL.createObjectURL(f));
            return [...prev, ...newUrls];
        });
        setStatus({ type: "", message: "" });
    }, [toast]);

    const handleFileChange = (e) => {
        validateAndAddFiles(e.target.files);
        // Reset so re-selecting the same file fires onChange again
        e.target.value = "";
    };

    const removePhoto = (idx) => {
        URL.revokeObjectURL(previews[idx]);
        setPhotos(prev => prev.filter((_, i) => i !== idx));
        setPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const clearSelection = () => {
        previews.forEach(url => URL.revokeObjectURL(url));
        setPhotos([]);
        setPreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ── Drag-and-drop ─────────────────────────────────────────────────────────
    const handleDragOver = (e) => {
        e.preventDefault();
        if (!processing) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        // Only clear when the cursor actually leaves the drop zone, not a child
        if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (processing) return;
        validateAndAddFiles(e.dataTransfer.files);
    };

    // ── Re-trigger matching manually ──────────────────────────────────────────
    // Useful when photos processed successfully but matching was never run,
    // or when a new guest registers after photos were already matched.
    // resetProcessed=true (handled server-side) re-evaluates all photos.
    const retryMatching = async () => {
        if (!event || retryingMatch) return;
        setRetryingMatch(true);
        try {
            const result = await apiCall("/admin/start-matching", {
                method: "POST",
                body: JSON.stringify({ eventId: event.code }),
            });
            if (result.skipped) {
                toast.warning(
                    result.reason === "photos_still_processing"
                        ? "Photos are still being processed. Matching will run automatically when done."
                        : "Matching is already running — please wait."
                );
            } else {
                toast.success(
                    `Matching complete. ${result.matchCount} match${result.matchCount === 1 ? "" : "es"} found across ${result.notifiedGuests} guest${result.notifiedGuests === 1 ? "" : "s"}.`
                );
                fetchDownloadStats(event.code);
                refreshEventSilently();
            }
        } catch (err) {
            toast.error(err.message || "Matching failed. Please try again.");
        } finally {
            setRetryingMatch(false);
        }
    };

    // ── Upload with XHR progress + abort support ──────────────────────────────
    // Routes through the Next.js proxy (/api/proxy) so the HttpOnly auth cookie
    // is sent automatically — no manual Authorization header needed.
    const uploadWithProgress = (formData, onProgress, signal) =>
        new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            if (signal) {
                if (signal.aborted) { reject(new Error("Upload cancelled")); return; }
                signal.addEventListener("abort", () => xhr.abort(), { once: true });
            }

            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
            });
            xhr.addEventListener("load", () => {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (xhr.status >= 200 && xhr.status < 300) resolve(data);
                    else reject(new Error(data?.error || `Upload failed (${xhr.status})`));
                } catch {
                    reject(new Error(`Upload failed (${xhr.status})`));
                }
            });
            xhr.addEventListener("error", () => reject(new Error("Network error — check your connection and try again")));
            xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));
            xhr.open("POST", "/api/proxy/admin/upload-photos");
            xhr.send(formData);
        });

    const cancelUpload = () => {
        abortControllerRef.current?.abort();
    };

    // ── Main upload handler ───────────────────────────────────────────────────
    // Two phases:
    //   1. Compress — resize each photo to 1600 px max (8 at a time, 0–30%)
    //   2. Upload   — send in 30-photo batches so progress stays smooth and a
    //                 single bad batch never kills the whole session (30–100%)
    const handleUpload = async () => {
        if (!photos.length || !event) return;

        const controller = new AbortController();
        abortControllerRef.current = controller;
        const { signal } = controller;

        setProcessing(true);
        setUploadProgress(0);

        try {
            // ── Phase 1: Compress ──────────────────────────────────────────
            setUploadPhase("compressing");
            const COMPRESS_CONCURRENCY = 8;
            const total = photos.length;
            const compressed = new Array(total);

            for (let i = 0; i < total; i += COMPRESS_CONCURRENCY) {
                if (signal.aborted) throw new Error("Upload cancelled");
                const slice = photos.slice(i, Math.min(i + COMPRESS_CONCURRENCY, total));
                const done  = await Promise.all(slice.map(compressImage));
                done.forEach((f, j) => { compressed[i + j] = f; });
                const doneSoFar = Math.min(i + COMPRESS_CONCURRENCY, total);
                setUploadPhaseDetail(`${doneSoFar} / ${total}`);
                setUploadProgress(Math.round((doneSoFar / total) * 30));
            }

            // ── Phase 2: Batch upload ──────────────────────────────────────
            setUploadPhase("uploading");
            const BATCH_SIZE = 30;
            const batches = [];
            for (let i = 0; i < compressed.length; i += BATCH_SIZE) {
                batches.push(compressed.slice(i, i + BATCH_SIZE));
            }

            let totalUploaded = 0;
            let lastResult    = null;

            for (let bi = 0; bi < batches.length; bi++) {
                if (signal.aborted) throw new Error("Upload cancelled");

                const batch      = batches[bi];
                const batchStart = 30 + Math.round((bi       / batches.length) * 70);
                const batchEnd   = 30 + Math.round(((bi + 1) / batches.length) * 70);
                const batchLabel = batches.length > 1 ? `Batch ${bi + 1}/${batches.length}` : "";

                const formData = new FormData();
                batch.forEach(photo => formData.append("photos", photo));
                formData.append("eventId", event.code);

                lastResult = await uploadWithProgress(
                    formData,
                    (xhrPct) => {
                        const pct = batchStart + Math.round(xhrPct * (batchEnd - batchStart) / 100);
                        setUploadProgress(pct);
                        setUploadPhaseDetail(
                            batchLabel ? `${batchLabel} · ${xhrPct}%` : `${xhrPct}%`
                        );
                    },
                    signal,
                );

                totalUploaded += batch.length;
            }

            setUploadProgress(100);
            const msg = lastResult?.message
                || `${totalUploaded} photo${totalUploaded === 1 ? "" : "s"} uploaded. Face detection running in the background.`;
            setStatus({ type: "success", message: msg });
            toast.success(msg);

            clearSelection();
            fetchDownloadStats(event.code);
            fetchEventData();
        } catch (err) {
            if (err.message === "Upload cancelled") {
                toast.info("Upload cancelled.");
                setStatus({ type: "", message: "" });
            } else {
                setStatus({ type: "error", message: err.message || "Upload failed" });
                toast.error(err.message || "Upload failed");
            }
        } finally {
            setProcessing(false);
            setUploadPhase("idle");
            setUploadProgress(0);
            setUploadPhaseDetail("");
            abortControllerRef.current = null;
        }
    };

    // ── Grid column helper ────────────────────────────────────────────────────
    const getGridCols = (n) => {
        if (n <= 2)  return "grid-cols-2";
        if (n <= 6)  return "grid-cols-3";
        if (n <= 12) return "grid-cols-4";
        if (n <= 25) return "grid-cols-5";
        if (n <= 60) return "grid-cols-6";
        return "grid-cols-8";
    };

    const registrationLink = useMemo(() => {
        if (!event) return "";
        if (typeof window === "undefined") return `/register?eventId=${encodeURIComponent(event.code)}`;
        return `${window.location.origin}/register?eventId=${encodeURIComponent(event.code)}`;
    }, [event]);

    const remainingUploads    = billing.usage?.remainingUploads || 0;
    const uploadLimit         = billing.subscription?.uploadLimit || 0;
    const uploadUsagePercent  = billing.subscription && billing.usage
        ? Math.round((billing.usage.usedUploads / Math.max(1, uploadLimit)) * 100)
        : 0;
    const quotaInsufficient   = billing.subscription && photos.length > 0 && photos.length > remainingUploads;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(registrationLink);
            setStatus({ type: "success", message: "Link copied to clipboard!" });
            toast.success("Registration link copied.");
            setTimeout(() => setStatus({ type: "", message: "" }), 3000);
        } catch {
            toast.error("Could not copy registration link.");
        }
    };

    const readLogoFile = (file) => {
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Please select a valid image file (PNG, JPG, SVG).");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Logo must be under 2 MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => setQrLogoSrc(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleLogoFileChange = (e) => {
        readLogoFile(e.target.files?.[0]);
        e.target.value = "";
    };

    const removeLogo = () => {
        setQrLogoSrc(null);
        if (logoInputRef.current) logoInputRef.current.value = "";
    };

    const handleLogoDrop = (e) => {
        e.preventDefault();
        setQrLogoDragging(false);
        readLogoFile(e.dataTransfer.files?.[0]);
    };

    const downloadQrCode = async () => {
        if (!event) return;

        const qrElement = document.getElementById("event-detail-qr");
        if (!qrElement) return;

        const displayWebsite = getDisplayWebsite(qrWebsiteLabel);
        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(qrElement)], {
            type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);
        const image = new Image();

        image.onload = () => {
            const canvas = document.createElement("canvas");
            const width  = 1240;
            const height = displayWebsite ? 1560 : 1460;
            const qrSize = 860;
            const context = canvas.getContext("2d");
            canvas.width  = width;
            canvas.height = height;

            context.fillStyle = "#f4f4f5";
            context.fillRect(0, 0, width, height);

            context.fillStyle = "#ffffff";
            context.beginPath();
            context.roundRect(70, 70, width - 140, height - 140, 56);
            context.fill();

            context.fillStyle = "#18181b";
            context.font = "800 64px Arial";
            context.textAlign = "center";
            context.fillText(event.name, width / 2, 190);

            context.fillStyle = "#71717a";
            context.font = "600 34px Arial";
            context.fillText("Scan to register for this event", width / 2, 250);

            context.fillStyle = "#ffffff";
            context.beginPath();
            context.roundRect((width - 940) / 2, 320, 940, 940, 44);
            context.fill();
            context.drawImage(image, (width - qrSize) / 2, 360, qrSize, qrSize);

            context.fillStyle = "#18181b";
            context.font = "800 42px Arial";
            context.fillText(event.code, width / 2, 1330);

            if (displayWebsite) {
                context.fillStyle = "#3f3f46";
                context.font = "800 44px Arial";
                context.fillText(displayWebsite, width / 2, 1410);
            }

            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `${event.code.toLowerCase()}-qr.png`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(svgUrl);
            setStatus({ type: "success", message: "Custom QR code downloaded." });
            toast.success("Custom QR code downloaded.");
            setTimeout(() => setStatus({ type: "", message: "" }), 3000);
        };

        image.onerror = () => {
            URL.revokeObjectURL(svgUrl);
            setStatus({ type: "error", message: "QR code download failed." });
            toast.error("QR code download failed.");
            setTimeout(() => setStatus({ type: "", message: "" }), 3000);
        };

        image.src = svgUrl;
    };

    if (loading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-zinc-700" /></div>;
    }

    if (!event) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/events" className="rounded-full bg-zinc-100 p-2 transition hover:bg-zinc-200 flex-shrink-0">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="min-w-0">
                    <h1 className="text-3xl font-semibold tracking-tight truncate">{event.name}</h1>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                        <span className="font-mono text-zinc-700">{event.code}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Created {new Date(event.createdAt).toLocaleDateString()}</span>
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Left Col: Upload & Stats */}
                <div className="space-y-6 lg:col-span-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard icon={Users}       label="Total Guests"  value={event.guests?.length || 0}  accent="bg-zinc-100 text-zinc-700" />
                        <StatCard icon={ImageIcon}   label="Total Photos"  value={event.photoCount  || 0}     accent="bg-zinc-100 text-zinc-700" />
                        <StatCard icon={CheckCircle} label="Total Matches" value={event.matchCount  || 0}     accent="bg-zinc-100 text-zinc-700" />
                    </div>

                    {event.pendingProcessing > 0 && (
                        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                            <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                            <span>
                                {event.pendingProcessing} photo{event.pendingProcessing === 1 ? "" : "s"} still being processed in the background. Matches and guest emails will arrive automatically when done.
                            </span>
                        </div>
                    )}

                    {event.failedPhotos > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <div className="flex items-start gap-2 flex-1">
                                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span>
                                    <strong>{event.failedPhotos} photo{event.failedPhotos === 1 ? "" : "s"} failed to process</strong> — face detection timed out before they could be analysed. Re-upload them and they will be replaced automatically.
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="rounded-xl border border-zinc-200 bg-white p-5 backdrop-blur-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Upload Event Photos</h2>
                            <div className="flex items-center gap-2">
                                {/* Manual re-trigger — useful when a new guest registers after photos
                                    were already matched, or to recover from a partial failure */}
                                {event.photoCount > 0 && !event.pendingProcessing && (
                                    <button
                                        type="button"
                                        onClick={retryMatching}
                                        disabled={retryingMatch}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60"
                                        title="Re-run face matching for all processed photos"
                                    >
                                        {retryingMatch
                                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            : <Zap className="h-3.5 w-3.5" />
                                        }
                                        {retryingMatch ? "Matching…" : "Retry Matching"}
                                    </button>
                                )}
                                <span className="hidden sm:inline text-xs text-zinc-500">Auto face-match with guests</span>
                            </div>
                        </div>

                        {/* Billing / quota strip */}
                        <div className={`mb-4 rounded-2xl border p-4 text-sm ${
                            billing.subscription
                                ? "border-zinc-200 bg-zinc-50 text-zinc-700"
                                : "border-amber-200 bg-amber-50 text-amber-800"
                        }`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className={`rounded-xl p-2 ${billing.subscription ? "bg-white text-zinc-700" : "bg-amber-100 text-amber-700"}`}>
                                        {billing.subscription ? <ShieldCheck className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {billing.subscription
                                                ? `${billing.subscription.plan?.name} plan active`
                                                : "No active billing plan"}
                                        </p>
                                        <p className="mt-1">
                                            {billing.subscription
                                                ? `${billing.usage?.usedUploads || 0} of ${uploadLimit} uploads used. ${remainingUploads} remaining this cycle.`
                                                : "Uploads are blocked until this admin account activates a billing plan."}
                                        </p>
                                    </div>
                                </div>
                                <Link href="/admin/billing" className="whitespace-nowrap rounded border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-100">
                                    Manage Billing
                                </Link>
                            </div>
                            {billing.subscription && (
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                                    <div
                                        className="h-full rounded-full bg-zinc-900 transition-all"
                                        style={{ width: `${Math.min(100, Math.max(0, uploadUsagePercent))}%` }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Quota warning */}
                        {quotaInsufficient && (
                            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                You selected {photos.length} photos but only {remainingUploads} upload{remainingUploads === 1 ? "" : "s"} remain this cycle. Remove some photos or{" "}
                                <Link href="/admin/billing" className="underline font-semibold">upgrade your plan</Link>.
                            </div>
                        )}

                        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />

                        {/* CSS keyframe for water wave — scoped to this component */}
                        <style>{`
                            @keyframes gopo-wave {
                                0%   { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                        `}</style>

                        {/* ── Drop zone ── */}
                        <div
                            onClick={() => !processing && fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative min-h-[300px] overflow-hidden rounded-2xl border-2 border-dashed p-4 transition ${
                                processing
                                    ? "border-zinc-200 bg-zinc-50 cursor-default"
                                    : isDragging
                                    ? "border-zinc-700 bg-zinc-100 cursor-copy"
                                    : photos.length
                                    ? "border-zinc-300 bg-zinc-50 cursor-pointer"
                                    : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 cursor-pointer"
                            }`}
                        >
                            {processing ? (
                                /* ── WATER FILL ANIMATION ── */
                                <>
                                    <div
                                        className="absolute inset-x-0 bottom-0 pointer-events-none transition-all duration-500 ease-out"
                                        style={{ height: `${uploadProgress > 0 ? Math.max(uploadProgress, 5) : 0}%` }}
                                    >
                                        <div
                                            className="absolute top-0 left-0 h-14 w-[200%]"
                                            style={{ animation: "gopo-wave 2.4s linear infinite" }}
                                        >
                                            {[0, 1].map((i) => (
                                                <svg key={i} viewBox="0 0 600 56" className="h-14 w-1/2 float-left" preserveAspectRatio="none">
                                                    <path d="M0,28 C75,4 150,52 225,28 C300,4 375,52 450,28 C525,4 600,52 600,28 L600,56 L0,56 Z" fill="rgba(24,24,27,0.13)" />
                                                    <path d="M0,40 C100,18 200,50 300,40 C400,18 500,50 600,40 L600,56 L0,56 Z" fill="rgba(24,24,27,0.07)" />
                                                </svg>
                                            ))}
                                        </div>
                                        <div className="absolute top-12 inset-x-0 bottom-0" style={{ background: "rgba(24,24,27,0.08)" }} />
                                    </div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
                                        <p className="text-6xl font-bold tabular-nums tracking-tight text-zinc-900 leading-none">
                                            {Math.round(uploadProgress)}%
                                        </p>
                                        <p className="mt-3 text-sm font-semibold text-zinc-700">
                                            {uploadPhase === "compressing" ? "Compressing photos" : "Uploading to server"}
                                        </p>
                                        <p className="mt-1 text-xs text-zinc-500">{uploadPhaseDetail}</p>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); cancelUpload(); }}
                                            className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white/80 px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-white hover:border-zinc-400"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                            Cancel upload
                                        </button>
                                    </div>
                                </>
                            ) : !photos.length ? (
                                /* ── EMPTY STATE ── */
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                    <div className={`mb-4 rounded-2xl p-4 transition ${isDragging ? "bg-zinc-200" : "bg-zinc-100"}`}>
                                        <Upload className="h-8 w-8 text-zinc-700" />
                                    </div>
                                    <p className="text-lg font-semibold">
                                        {isDragging ? "Drop photos to add them" : "Drop event photos here"}
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-900/60">or click to browse files</p>
                                    <p className="mt-2 text-xs text-zinc-400">JPEG · PNG · HEIC · max 20 MB each · up to 300 photos</p>
                                </div>
                            ) : (
                                /* ── PHOTO GRID ── */
                                <>
                                    <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
                                        <div className={`grid gap-1.5 ${getGridCols(photos.length)}`}>
                                            {previews.map((src, idx) => (
                                                <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-200">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={src} alt="preview" className="h-full w-full object-cover" />
                                                    {/* Remove button — visible on hover */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removePhoto(idx); }}
                                                        className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100"
                                                        title="Remove photo"
                                                    >
                                                        <div className="rounded-full bg-white/90 p-1 shadow">
                                                            <X className="h-3 w-3 text-zinc-800" />
                                                        </div>
                                                    </button>
                                                </div>
                                            ))}

                                            {/* "Add more" tile — always visible when photos are selected */}
                                            {photos.length < 300 && (
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                                    className="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-500 hover:text-zinc-600 cursor-pointer transition"
                                                    title="Add more photos"
                                                >
                                                    <Upload className="h-4 w-4" />
                                                    <span className="mt-1 text-[10px] font-medium">Add more</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                                                {photos.length} photo{photos.length !== 1 ? "s" : ""} selected
                                            </span>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                                                className="rounded-lg p-2 text-zinc-900/60 hover:bg-zinc-200 hover:text-zinc-700"
                                                title="Clear all"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                                            disabled={!billing.subscription || quotaInsufficient}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                                        >
                                            <Sparkles className="h-4 w-4" />
                                            Upload &amp; Match
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {status.message && (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    className={`mt-4 rounded-2xl border p-4 text-sm ${
                                        status.type === "success"
                                            ? "border-zinc-300 bg-zinc-50 text-zinc-700"
                                            : status.type === "error"
                                            ? "border-red-300 bg-red-50 text-red-700"
                                            : "border-zinc-300 bg-zinc-50 text-zinc-700"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {status.type === "success"
                                            ? <CheckCircle className="h-4 w-4" />
                                            : <Loader2 className={`h-4 w-4 ${status.type === "info" ? "animate-spin" : ""}`} />
                                        }
                                        <span>{status.message}</span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-5 backdrop-blur-xl">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Registered Guests</h2>
                                <p className="mt-1 text-sm text-zinc-500">
                                    View, search, and filter all guests on a dedicated page.
                                </p>
                            </div>
                            <Link
                                href={`/admin/events/${event._id}/guests`}
                                className="inline-flex items-center justify-center gap-2 rounded border border-zinc-900 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                            >
                                <Users className="h-4 w-4" />
                                Open Guest List
                            </Link>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Total</p>
                                <p className="mt-2 text-2xl font-semibold text-zinc-950">{event.guests?.length || 0}</p>
                            </div>
                            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">With Selfie</p>
                                <p className="mt-2 text-2xl font-semibold text-zinc-950">
                                    {event.guests?.filter((guest) => guest.selfieUrl).length || 0}
                                </p>
                            </div>
                            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Without Selfie</p>
                                <p className="mt-2 text-2xl font-semibold text-zinc-950">
                                    {event.guests?.filter((guest) => !guest.selfieUrl).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: QR & Download Stats */}
                <div className="space-y-6 lg:col-span-4">

                    {/* ── QR Card ─────────────────────────────────────────── */}
                    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">

                        <div className="border-b border-zinc-100 px-5 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-zinc-900">Guest Registration QR</h2>
                                    <p className="mt-0.5 text-[11px] text-zinc-400">Scan to register · auto face-match enabled</p>
                                </div>
                                <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
                                    <button
                                        onClick={() => { setIsQrLogoOpen(false); setIsQrBrandingOpen((v) => !v); }}
                                        type="button"
                                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                                            isQrBrandingOpen
                                                ? "bg-zinc-900 text-white shadow-sm"
                                                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                                        }`}
                                    >
                                        <Globe2 className="h-3.5 w-3.5" />
                                        Website
                                    </button>
                                    <button
                                        onClick={() => { setIsQrBrandingOpen(false); setIsQrLogoOpen((v) => !v); }}
                                        type="button"
                                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                                            isQrLogoOpen
                                                ? "bg-zinc-900 text-white shadow-sm"
                                                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                                        }`}
                                    >
                                        <Paintbrush className="h-3.5 w-3.5" />
                                        Logo
                                        {qrLogoSrc && (
                                            <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-950 px-6 py-7">
                            <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/40">
                                <div className="border-b border-zinc-100 px-4 py-3 text-center">
                                    <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                                        {event.name}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center px-6 py-5">
                                    <CustomQRCode
                                        id="event-detail-qr"
                                        value={registrationLink}
                                        size={220}
                                        fgColor="#18181b"
                                        bgColor="#ffffff"
                                        logoSrc={qrLogoSrc}
                                    />
                                </div>
                                <div className="border-t border-zinc-100 px-4 py-3 text-center">
                                    {getDisplayWebsite(qrWebsiteLabel) ? (
                                        <>
                                            <p className="text-[11px] font-semibold tracking-widest text-zinc-900 uppercase">
                                                {getDisplayWebsite(qrWebsiteLabel)}
                                            </p>
                                            <p className="mt-0.5 text-[10px] text-zinc-400">Scan to get your photos</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-mono text-xs font-bold tracking-widest text-zinc-900">{event.code}</p>
                                            <p className="mt-0.5 text-[10px] text-zinc-400">Scan to get your photos</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {(qrLogoSrc || getDisplayWebsite(qrWebsiteLabel)) && (
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                                    {qrLogoSrc && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/70">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={qrLogoSrc} alt="" className="h-3.5 w-3.5 rounded-[3px] object-contain" />
                                            Logo applied
                                            <button onClick={removeLogo} className="ml-0.5 text-white/40 hover:text-red-400 transition">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                    {getDisplayWebsite(qrWebsiteLabel) && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/70">
                                            <Globe2 className="h-3 w-3" />
                                            {getDisplayWebsite(qrWebsiteLabel)}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="px-5">
                            <AnimatePresence>
                                {isQrBrandingOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-b border-zinc-100 py-4">
                                            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                                                Website label
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. myphotography.com"
                                                value={qrWebsiteLabel}
                                                onChange={(e) => setQrWebsiteLabel(e.target.value)}
                                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100"
                                            />
                                            <p className="mt-1.5 text-[11px] text-zinc-400">
                                                Replaces the event code below the QR in the downloaded card.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {isQrLogoOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-b border-zinc-100 py-4">
                                            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                                                Brand logo
                                            </p>

                                            {qrLogoSrc ? (
                                                <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={qrLogoSrc} alt="Brand logo" className="h-full w-full object-contain p-1.5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-zinc-800">Logo active</p>
                                                        <p className="text-[11px] text-zinc-400">Centred on QR preview &amp; download</p>
                                                        <div className="mt-2 flex gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => logoInputRef.current?.click()}
                                                                className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
                                                            >
                                                                Replace
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={removeLogo}
                                                                className="flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-100"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onDragOver={(e) => { e.preventDefault(); setQrLogoDragging(true); }}
                                                    onDragLeave={() => setQrLogoDragging(false)}
                                                    onDrop={handleLogoDrop}
                                                    onClick={() => logoInputRef.current?.click()}
                                                    className={`flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed py-6 text-center transition ${
                                                        qrLogoDragging
                                                            ? "border-zinc-900 bg-zinc-50"
                                                            : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
                                                    }`}
                                                >
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100">
                                                        <Paintbrush className="h-4 w-4 text-zinc-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-zinc-700">Drop logo or click to browse</p>
                                                        <p className="mt-0.5 text-[10px] text-zinc-400">PNG · JPG · SVG · max 2 MB</p>
                                                    </div>
                                                </div>
                                            )}

                                            <p className="mt-2 text-[10px] leading-4 text-zinc-400">
                                                Stored in your browser only — never uploaded to our servers.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFileChange} />

                        <div className="grid grid-cols-2 divide-x divide-zinc-100 border-t border-zinc-100">
                            <button
                                onClick={copyLink}
                                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
                            >
                                <Copy className="h-4 w-4" />
                                Copy Link
                            </button>
                            <button
                                onClick={downloadQrCode}
                                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
                            >
                                <Download className="h-4 w-4" />
                                Download QR
                            </button>
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-5 backdrop-blur-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Download className="h-5 w-5 text-zinc-700" />
                                Delivery Stats
                            </h2>
                            <button
                                onClick={() => event?.code && fetchDownloadStats(event.code)}
                                disabled={statsLoading}
                                title="Refresh stats"
                                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50"
                            >
                                <RefreshCw className={`h-3.5 w-3.5 ${statsLoading ? "animate-spin" : ""}`} />
                                {statsLoading ? "Updating…" : "Refresh"}
                            </button>
                        </div>

                        {statsLoading && downloadStats.allTimeDownloads === 0 ? (
                            <div className="space-y-3 animate-pulse">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex justify-between items-center py-1">
                                        <div className="h-3 w-28 rounded bg-zinc-100" />
                                        <div className="h-3 w-10 rounded bg-zinc-100" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-0">
                                <div className="flex justify-between items-center text-sm border-b border-zinc-100 py-3">
                                    <span className="text-zinc-500">Total Downloads</span>
                                    <span className="font-semibold text-zinc-900">{downloadStats.allTimeDownloads}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-zinc-100 py-3">
                                    <span className="text-zinc-500">Today</span>
                                    <span className="font-semibold text-zinc-900">{downloadStats.todayDownloads}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-zinc-100 py-3">
                                    <span className="text-zinc-500">Photos Delivered</span>
                                    <span className="font-semibold text-zinc-900">
                                        {downloadStats.downloadedPhotos}/{downloadStats.totalPhotos}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-zinc-100 py-3">
                                    <span className="text-zinc-500">Unique Guests</span>
                                    <span className="font-semibold text-zinc-900">{downloadStats.uniqueGuestsDownloaded}</span>
                                </div>
                                <div className="pt-3">
                                    <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                                        <span>Delivery Coverage</span>
                                        <span className="font-semibold text-zinc-700">{downloadStats.downloadCoveragePercent}%</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-zinc-800 transition-all duration-500"
                                            style={{ width: `${downloadStats.downloadCoveragePercent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
