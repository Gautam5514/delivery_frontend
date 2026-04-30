import * as Sentry from "@sentry/nextjs";

// Runs in the browser. NEXT_PUBLIC_SENTRY_DSN must be prefixed so Next.js
// inlines it into the client bundle at build time.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.NODE_ENV || "development",

  // Capture every transaction in dev; sample 10 % in production to stay
  // within free-tier limits while still catching most slow paths.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay: record a video-like replay for every session that
  // produces an error so you can see exactly what the user was doing.
  replaysOnErrorSampleRate: 1.0,

  // Record 5 % of all sessions for general performance insight.
  replaysSessionSampleRate: 0.05,

  integrations: [
    Sentry.replayIntegration({
      // Mask all text and block all media by default — safe for an app that
      // handles personal event photos.
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Suppress Sentry's own debug logs in the browser console.
  debug: false,
});
