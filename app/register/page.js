"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Camera,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ScanFace,
  User,
  Mail,
  Focus,
  ShieldCheck,
  BadgeCheck,
  Stars,
  UploadCloud,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiCall } from "../utils/api";
import { useToast } from "@/components/ui/ToastProvider";

// ── Lifted outside to prevent remount on every parent re-render ───────────────

function PrivacyModal({ show, onClose, onAccept }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Privacy Notice</p>
              <button type="button" onClick={onClose} className="rounded-full p-1.5 text-zinc-500 hover:bg-white/10 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="mb-5 space-y-3 text-xs leading-relaxed text-zinc-400">
              {[
                ["What we collect", "A photo of your face and a mathematical face descriptor for photo matching only."],
                ["Why", "To find and deliver your event photos. No other purpose, ever."],
                ["Storage", "Your selfie is stored on Cloudinary (US servers). Face descriptor in our database."],
                ["Retention", "All face data is permanently deleted 10 days after the event."],
                ["Your rights", "Delete all your data instantly from your photo gallery after registration, or email hellobj16@gmail.com for manual removal."],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-amber-400">▸</span>
                  <span><span className="font-semibold text-zinc-200">{title}:</span> {body}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onAccept}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
            >
              I Agree &amp; Accept
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ConsentRow({ consentGiven, onToggle, onRead }) {
  return (
    <div className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors ${consentGiven ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5"}`}>
      <div className="flex items-center gap-3">
        <div
          onClick={onToggle}
          className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-colors ${consentGiven ? "border-emerald-500 bg-emerald-500" : "border-zinc-500 bg-transparent hover:border-amber-400"}`}
        >
          {consentGiven && (
            <svg viewBox="0 0 12 10" className="h-3 w-3" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 5 4.5 9 11 1" />
            </svg>
          )}
        </div>
        <span className="text-xs text-zinc-400">I consent to face data processing</span>
      </div>
      <button
        type="button"
        onClick={onRead}
        className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors"
      >
        Read
      </button>
    </div>
  );
}

function SelfiePanel({ image, imagePreview, isCameraActive, consentGiven, videoRef, canvasRef, onCapture, onReset, onStartCamera, onFileSelect }) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden rounded-2xl bg-black/80 ring-1 ring-white/10">
        <AnimatePresence mode="wait">
          {image ? (
            <motion.div key="captured" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} className="h-full w-full object-cover" alt="Selfie preview" />
              <div className="absolute left-3 top-3 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                ✓ Captured
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                  type="button" onClick={onReset}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:bg-white/20"
                >
                  <RefreshCw className="h-4 w-4" /> Retake
                </button>
              </div>
            </motion.div>
          ) : isCameraActive ? (
            <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative h-full w-full bg-black">
              <video ref={videoRef} autoPlay playsInline className="h-full w-full scale-x-[-1] object-cover" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
                <Focus className="h-48 w-48 text-white" strokeWidth={1} />
              </div>
              <div className="pointer-events-none absolute inset-5 rounded-2xl border border-white/15">
                {["tl", "tr", "bl", "br"].map((corner) => (
                  <div key={corner} className={`absolute h-8 w-8 border-cyan-300/70 border-2 ${
                    corner === "tl" ? "left-0 top-0 rounded-tl-xl border-r-0 border-b-0" :
                    corner === "tr" ? "right-0 top-0 rounded-tr-xl border-l-0 border-b-0" :
                    corner === "bl" ? "bottom-0 left-0 rounded-bl-xl border-r-0 border-t-0" :
                    "bottom-0 right-0 rounded-br-xl border-l-0 border-t-0"
                  }`} />
                ))}
              </div>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                <button
                  type="button" onClick={onCapture}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white/80 bg-transparent p-1.5 transition-transform hover:scale-105 active:scale-95"
                >
                  <div className="h-full w-full rounded-full bg-white" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-center gap-5 p-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                  <Camera className="h-9 w-9 text-white/50" />
                </div>
              </div>
              <div>
                <h3 className="mb-1 text-base font-bold text-white">Take a Selfie</h3>
                <p className="text-xs text-zinc-500">Face forward, good lighting, no glasses</p>
              </div>
              <button
                type="button" onClick={onStartCamera}
                disabled={!consentGiven}
                title={!consentGiven ? "Accept privacy notice first" : undefined}
                className="flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/10 px-6 py-3 text-sm font-bold text-amber-400 transition-all hover:bg-amber-500 hover:text-black disabled:pointer-events-none disabled:opacity-40"
              >
                <ScanFace className="h-4 w-4" /> Open Camera
              </button>
              <div className="flex w-full max-w-[200px] items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] uppercase tracking-widest text-zinc-600">or</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <label className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${consentGiven ? "text-zinc-400 hover:bg-white/5 hover:text-white" : "cursor-not-allowed opacity-40 text-zinc-600"}`}>
                <UploadCloud className="h-4 w-4" /> Upload Photo
                <input type="file" accept="image/*" className="hidden" disabled={!consentGiven} onChange={onFileSelect} />
              </label>
            </motion.div>
          )}
        </AnimatePresence>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterPageInner />
    </Suspense>
  );
}

function RegisterPageInner() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") || "WEDDING_2026";

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [mobileStep, setMobileStep] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  // Tracks whether the auto-show has already fired so React StrictMode's
  // double-invocation of effects doesn't open the modal twice.
  const autoModalFired = useRef(false);

  const showError = (msg) => { setError(msg); toast.error(msg); };

  const waitForVideoElement = () =>
    new Promise((resolve, reject) => {
      let attempts = 0;

      const check = () => {
        if (videoRef.current) {
          resolve(videoRef.current);
          return;
        }

        attempts += 1;
        if (attempts > 20) {
          reject(new Error("Camera view not ready"));
          return;
        }

        requestAnimationFrame(check);
      };

      check();
    });

  // Auto-show the biometric consent notice on first render.
  // DPDP 2023 and GDPR require "prominent" disclosure before collecting
  // face data — waiting for the user to notice the checkbox is not enough.
  useEffect(() => {
    if (!autoModalFired.current) {
      autoModalFired.current = true;
      setShowPrivacy(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const startCamera = async () => {
    if (!consentGiven) { showError("Accept the privacy notice before using the camera."); return; }
    if (!window.isSecureContext) {
      showError("Camera requires HTTPS. Open this link on HTTPS or use the Upload Photo option.");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) { showError("Camera API not supported on this browser."); return; }
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "user" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      streamRef.current = stream;
      setIsCameraActive(true);
      const video = await waitForVideoElement();
      video.srcObject = stream;
      await video.play();
      setError("");
    } catch (err) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") { showError("Camera permission denied."); return; }
      if (err.name === "NotFoundError") { showError("No camera found on this device."); return; }
      if (err.name === "NotReadableError") { showError("Camera is busy in another app."); return; }
      if (err.name === "NotSecureError" || err.name === "SecurityError") { showError("Camera requires HTTPS. Open this link on HTTPS or use the Upload Photo option."); return; }
      showError("Could not access camera. Check device settings.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || video.readyState < 2) { showError("Camera not ready yet."); return; }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) { showError("Failed to capture image."); return; }
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImage(blob);
      setImagePreview(URL.createObjectURL(blob));
      stopCamera();
    }, "image/jpeg", 0.9);
  };

  const resetCapture = () => {
    if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(""); }
    setImage(null);
    startCamera();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!consentGiven) { showError("Accept the privacy notice first."); e.target.value = ""; return; }
    if (!file.type.startsWith("image/")) { showError("Please select an image file."); return; }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    stopCamera();
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!consentGiven) { showError("Accept the privacy notice first."); return; }
    if (!image) { showError("Please capture or upload a selfie first."); return; }
    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("selfie", image, "selfie.jpg");
      data.append("eventId", eventId);
      data.append("consentGiven", "true");
      await apiCall("/guests/register", { method: "POST", body: data });
      setSuccess(true);
      toast.success("Registration complete!");
    } catch (err) {
      showError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConsentToggle = () => {
    if (!consentGiven) setShowPrivacy(true);
    else setConsentGiven(false);
  };

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="relative flex h-dvh items-center justify-center overflow-hidden bg-[#030712] px-5 font-sans text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-2xl"
        >
          <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_70%)]" />
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10"
          >
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </motion.div>
          <h1 className="mb-2 text-2xl font-bold text-white">You&apos;re All Set!</h1>
          <p className="mb-6 text-sm leading-relaxed text-zinc-400">
            Thanks, <span className="font-semibold text-white">{formData.name}</span>. We&apos;ll notify you when your photos are ready for{" "}
            <span className="text-amber-400">{eventId}</span>.
          </p>
          <div className="mb-6 grid grid-cols-3 gap-2">
            {[
              { icon: <ShieldCheck className="h-4 w-4 text-emerald-400" />, label: "Secure", desc: "Data saved" },
              { icon: <BadgeCheck className="h-4 w-4 text-cyan-400" />, label: "Verified", desc: "Matched" },
              { icon: <Stars className="h-4 w-4 text-amber-400" />, label: "Delivery", desc: "Photos later" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                {item.icon}
                <p className="mt-1.5 text-[10px] uppercase tracking-widest text-zinc-500">{item.label}</p>
                <p className="mt-0.5 text-xs font-semibold text-white">{item.desc}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Register Another Guest
          </button>
        </motion.div>
      </div>
    );
  }

  const selfieProps = {
    image, imagePreview, isCameraActive, consentGiven,
    videoRef, canvasRef,
    onCapture: capturePhoto,
    onReset: resetCapture,
    onStartCamera: startCamera,
    onFileSelect: handleFileSelect,
  };

  // ── Main Layout ────────────────────────────────────────────────────────────
  return (
    <>
      <PrivacyModal
        show={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        onAccept={() => { setConsentGiven(true); setShowPrivacy(false); }}
      />

      <div className="relative flex h-dvh flex-col overflow-hidden bg-[#030712] font-sans text-zinc-100 selection:bg-amber-500/30">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-[-15%] top-[-20%] h-[500px] w-[500px] rounded-full bg-cyan-600/8 blur-[130px]" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-amber-600/8 blur-[130px]" />
        </div>

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2 sm:px-6 sm:pt-5">
          <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Guest Registration</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
            <span className="text-[10px] text-zinc-500">Event</span>
            <div className="h-3 w-px bg-white/20" />
            <span className="text-[10px] font-bold tracking-wider text-white">{eventId}</span>
          </div>
        </div>

        {/* Mobile headline (step 0 only) */}
        <AnimatePresence>
          {mobileStep === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="relative z-10 px-4 pt-2 pb-1 text-center sm:pb-2 xl:hidden"
            >
              <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-gradient-to-b from-white to-white/50 bg-clip-text sm:text-3xl">
                Scan. Register. Get Photos.
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop headline */}
        <div className="relative z-10 hidden px-6 pb-1 pt-2 text-center xl:block">
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-gradient-to-b from-white to-white/50 bg-clip-text">
            Scan. Register. Get Photos.
          </h1>
        </div>

        {/* Mobile Step Tabs */}
        <div className="relative z-10 mx-4 mt-3 flex items-center rounded-2xl border border-white/10 bg-white/[0.03] p-1 xl:hidden">
          {["Guest Details", "Selfie Capture"].map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (i === 1 && !consentGiven) { showError("Accept privacy notice first."); return; }
                setMobileStep(i);
              }}
              className={`relative flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${mobileStep === i ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <span className={`mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${mobileStep === i ? "bg-black/20 text-black" : "bg-white/10 text-zinc-400"}`}>{i + 1}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex min-h-0 flex-1 gap-4 overflow-hidden px-4 pt-3 pb-4 sm:px-5 sm:pb-5 xl:px-6 xl:pb-5 xl:pt-3">

          {/* Desktop left column — form */}
          <motion.form
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
            onSubmit={handleSubmit}
            className="hidden xl:flex xl:flex-col xl:w-[420px] xl:shrink-0 gap-3"
          >
            <div className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <User className="h-4 w-4 text-zinc-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Guest Details</h2>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                  <div className="group relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-amber-400" />
                    <input
                      type="text" required placeholder="Enter your name"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 transition-all focus:border-amber-500/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-amber-500/10"
                      value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                  <div className="group relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-amber-400" />
                    <input
                      type="email" required placeholder="name@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 transition-all focus:border-amber-500/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-amber-500/10"
                      value={formData.email} onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <ConsentRow consentGiven={consentGiven} onToggle={handleConsentToggle} onRead={() => setShowPrivacy(true)} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[{ step: "01", text: "Fill details" }, { step: "02", text: "Capture selfie" }, { step: "03", text: "Get photos" }].map(({ step, text }) => (
                  <div key={step} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{step}</p>
                    <p className="mt-1 text-xs font-semibold text-zinc-300">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !image || !consentGiven}
              className="w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 font-bold text-black shadow-[0_0_30px_-8px_rgba(245,158,11,0.4)] transition-all hover:shadow-[0_0_50px_-10px_rgba(245,158,11,0.6)] hover:scale-[1.01] active:scale-[0.99] disabled:pointer-events-none disabled:grayscale disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ScanFace className="h-4 w-4" />}
                {loading ? "Registering…" : "Complete Registration"}
              </div>
            </button>
          </motion.form>

          {/* Desktop right column — selfie */}
          <motion.div
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="hidden xl:flex xl:flex-1 xl:flex-col gap-3"
          >
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 backdrop-blur-xl">
              <p className="text-xs text-zinc-400">Center your face · Good lighting · Look straight</p>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${image ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : isCameraActive ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300" : "border border-zinc-700 bg-zinc-800/50 text-zinc-400"}`}>
                {image ? "Photo Ready" : isCameraActive ? "Camera Live" : "Awaiting Capture"}
              </span>
            </div>
            <div className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-2.5 backdrop-blur-2xl">
              <div className="h-full overflow-hidden rounded-2xl">
                <SelfiePanel {...selfieProps} />
              </div>
            </div>
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mobile step panels */}
          <div className="flex w-full flex-col xl:hidden">
            <AnimatePresence mode="wait">
              {mobileStep === 0 ? (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-1 flex-col gap-3"
                >
                  <div className="flex-1 overflow-auto rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-2xl">
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                        <div className="group relative">
                          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-amber-400" />
                          <input
                            type="text" required placeholder="Enter your name"
                            className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 transition-all focus:border-amber-500/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-amber-500/10"
                            value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                        <div className="group relative">
                          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-amber-400" />
                          <input
                            type="email" required placeholder="name@example.com"
                            className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 transition-all focus:border-amber-500/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-amber-500/10"
                            value={formData.email} onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                          />
                        </div>
                      </div>
                      <ConsentRow consentGiven={consentGiven} onToggle={handleConsentToggle} onRead={() => setShowPrivacy(true)} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.name.trim()) { showError("Please enter your name."); return; }
                      if (!formData.email.trim()) { showError("Please enter your email."); return; }
                      if (!consentGiven) { showError("Please accept the privacy notice."); return; }
                      setError("");
                      setMobileStep(1);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 font-bold text-black shadow-[0_0_30px_-8px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Next: Take Selfie <ChevronRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="flex flex-1 flex-col gap-3"
                >
                  <div className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-2.5 backdrop-blur-2xl">
                    <div className="h-full overflow-hidden rounded-2xl">
                      <SelfiePanel {...selfieProps} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !image}
                    className="w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 font-bold text-black shadow-[0_0_30px_-8px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:pointer-events-none disabled:grayscale disabled:opacity-50"
                  >
                    <div className="flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ScanFace className="h-4 w-4" />}
                      {loading ? "Registering…" : "Complete Registration"}
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </>
  );
}
