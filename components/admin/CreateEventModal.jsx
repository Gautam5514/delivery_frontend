"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Copy, Download, Globe2, Loader2, X } from "lucide-react";
import { apiCall } from "@/app/utils/api";
import CustomQRCode from "@/components/ui/CustomQRCode";
import { useToast } from "@/components/ui/ToastProvider";

const initialEventData = { name: "", code: "" };

const getDisplayWebsite = (value) => value.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");

const getQRLink = (code) => {
  if (typeof window === "undefined") {
    return `/register?eventId=${encodeURIComponent(code)}`;
  }

  return `${window.location.origin}/register?eventId=${encodeURIComponent(code)}`;
};

export default function CreateEventModal({
  isOpen,
  onClose,
  onCreated,
  showSuccessDetails = true,
}) {
  const toast = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [eventData, setEventData] = useState(initialEventData);
  const [createdEvent, setCreatedEvent] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");
  const [qrWebsiteLabel, setQrWebsiteLabel] = useState("");
  const [isQrBrandingOpen, setIsQrBrandingOpen] = useState(false);

  const resetModal = () => {
    setEventData(initialEventData);
    setCreatedEvent(null);
    setCopyStatus("");
    setDownloadStatus("");
    setQrWebsiteLabel("");
    setIsQrBrandingOpen(false);
  };

  const closeModal = () => {
    resetModal();
    onClose();
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsCreating(true);

    try {
      const response = await apiCall("/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: eventData.name, code: eventData.code }),
      });

      if (response.success) {
        if (showSuccessDetails) {
          setCreatedEvent(response.event);
        } else {
          closeModal();
        }

        onCreated?.(response.event);
        toast.success("Event created successfully.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to create event");
    } finally {
      setIsCreating(false);
    }
  };

  const copyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopyStatus("Copied!");
      toast.success("Event access link copied.");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Could not copy the access link.");
    }
  };


  const roundRect = (context, x, y, width, height, radius) => {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
    context.closePath();
  };

  const downloadQrCode = async (code) => {
    const qrElement = document.getElementById("created-event-qr");
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
      const width = 1240;
      const height = displayWebsite ? 1560 : 1460;
      const qrSize = 860;
      const context = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;

      context.fillStyle = "#f4f4f5";
      context.fillRect(0, 0, width, height);

      context.fillStyle = "#ffffff";
      roundRect(context, 70, 70, width - 140, height - 140, 56);
      context.fill();

      context.fillStyle = "#18181b";
      context.font = "800 64px Arial";
      context.textAlign = "center";
      context.fillText(createdEvent?.name || eventData.name, width / 2, 190);

      context.fillStyle = "#71717a";
      context.font = "600 34px Arial";
      context.fillText("Scan to register for this event", width / 2, 250);

      context.fillStyle = "#ffffff";
      roundRect(context, (width - 940) / 2, 320, 940, 940, 44);
      context.fill();
      context.drawImage(image, (width - qrSize) / 2, 360, qrSize, qrSize);

      context.fillStyle = "#18181b";
      context.font = "800 42px Arial";
      context.fillText(createdEvent?.code || code, width / 2, 1330);

      if (displayWebsite) {
        context.fillStyle = "#3f3f46";
        context.font = "800 44px Arial";
        context.fillText(displayWebsite, width / 2, 1410);
      }

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${code.toLowerCase()}-qr.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(svgUrl);

      setDownloadStatus("Downloaded!");
      toast.success("Event QR downloaded.");
      setTimeout(() => setDownloadStatus(""), 2000);
    };

    image.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      setDownloadStatus("Download failed");
      toast.error("QR code download failed.");
      setTimeout(() => setDownloadStatus(""), 2500);
    };

    image.src = svgUrl;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-auto bg-zinc-950/35 px-4 pb-8 pt-28 backdrop-blur-sm md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            className="relative w-full max-w-[390px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-950/20"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                  {createdEvent ? "Ready to Share" : "New Event"}
                </p>
                <h2 className="mt-1 text-lg font-black tracking-tight text-zinc-950">
                  {createdEvent ? "Event created" : "Create event"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:bg-zinc-100 hover:text-zinc-950"
                type="button"
                aria-label="Close create event modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className={createdEvent ? "p-4" : "max-h-[calc(100vh-7rem)] overflow-y-auto p-5"}>
              {!createdEvent ? (
                <>
                  <div className="mb-5">
                    <p className="text-sm leading-6 text-zinc-600">
                      Add the event name and a unique code guests will use to register.
                    </p>
                  </div>

                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-zinc-700">
                        Event Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Corporate Meetup 2026"
                        value={eventData.name}
                        onChange={(event) =>
                          setEventData((prev) => ({ ...prev, name: event.target.value }))
                        }
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-zinc-700">
                        Unique Event Code
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. MEETUP_2026"
                        value={eventData.code}
                        onChange={(event) =>
                          setEventData((prev) => ({
                            ...prev,
                            code: event.target.value.toUpperCase().trim().replace(/\s+/g, "_"),
                          }))
                        }
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 font-mono text-sm uppercase outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isCreating}
                      className="flex w-full items-center justify-center rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Event"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="truncate text-sm font-bold text-zinc-950">{createdEvent.name}</p>
                      <p className="text-xs leading-5 text-zinc-500">
                        Share QR or link for guest registration.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                    <div className="mx-auto w-fit rounded-xl bg-white p-2 shadow-sm ring-1 ring-zinc-200/70">
                      <CustomQRCode
                        id="created-event-qr"
                        value={getQRLink(createdEvent.code)}
                        size={136}
                        fgColor="#18181b"
                        bgColor="#ffffff"
                      />
                    </div>
                    <p className="mt-2 text-center font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                      {createdEvent.code}
                    </p>
                    {getDisplayWebsite(qrWebsiteLabel) ? (
                      <p className="mt-1 truncate text-center text-xs font-black tracking-tight text-zinc-950">
                        {getDisplayWebsite(qrWebsiteLabel)}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsQrBrandingOpen((value) => !value)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold transition hover:bg-zinc-100"
                      type="button"
                    >
                      <Globe2 className="h-4 w-4" />
                      {isQrBrandingOpen ? "Hide Website" : "Add Website"}
                    </button>
                    <button
                      onClick={() => copyLink(getQRLink(createdEvent.code))}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold transition hover:bg-zinc-100"
                      type="button"
                    >
                      {copyStatus ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copyStatus || "Copy Link"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isQrBrandingOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left"
                      >
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                          Website on QR
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. spgraoher.com"
                          value={qrWebsiteLabel}
                          onChange={(event) => setQrWebsiteLabel(event.target.value)}
                          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100"
                        />
                        <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                          Optional. It appears below the QR preview and inside the downloaded event QR card.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-[11px] text-zinc-600">
                    <span className="block truncate font-mono">{getQRLink(createdEvent.code)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => downloadQrCode(createdEvent.code)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-900 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-black"
                      type="button"
                    >
                      <Download className="h-4 w-4" />
                      {downloadStatus || "Download QR"}
                    </button>

                    <Link
                      href={`/admin/events/${createdEvent._id}`}
                      onClick={closeModal}
                      className="block rounded-xl border border-zinc-300 bg-white py-2.5 text-center text-sm font-bold text-zinc-800 transition hover:bg-zinc-100"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
