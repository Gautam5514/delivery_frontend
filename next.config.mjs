import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

// withSentryConfig wraps the build so Sentry can:
//   • Upload source maps to Sentry after each build (readable stack traces)
//   • Tree-shake unused Sentry code from the browser bundle
//   • Auto-instrument server components and API routes
//
// When NEXT_PUBLIC_SENTRY_DSN is not set the wrapper is a transparent pass-
// through — it adds zero overhead and does not change app behaviour.
export default withSentryConfig(nextConfig, {
  // Suppress the Sentry CLI output during local builds.
  silent: !process.env.CI,

  // Upload source maps from all output directories (app router + pages).
  widenClientFileUpload: true,

  // Strip source maps from the browser bundle so users cannot reverse-
  // engineer your application logic from the network tab.
  hideSourceMaps: true,

  // Remove Sentry's runtime logger from the production bundle.
  disableLogger: true,

  // Do not create automatic Vercel Cron monitors (not using Vercel).
  automaticVercelMonitors: false,
});
