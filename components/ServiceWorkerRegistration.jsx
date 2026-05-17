"use client";

import { useEffect } from "react";

// Registers /public/sw.js on the client side.
// Must be a Client Component because navigator.serviceWorker is browser-only.
// Renders nothing — purely a side-effect registration hook.
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        if (process.env.NODE_ENV === "development") {
          console.log("[SW] Registered:", reg.scope);
        }
      })
      .catch((err) => {
        console.error("[SW] Registration failed:", err);
      });
  }, []);

  return null;
}
