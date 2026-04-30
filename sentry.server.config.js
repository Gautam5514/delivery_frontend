import * as Sentry from "@sentry/nextjs";

// Runs in the Node.js runtime (SSR, API route handlers, server actions).
// The same DSN works for both client and server — Sentry separates them by
// the "environment" tag and the platform context it attaches automatically.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.NODE_ENV || "development",

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  debug: false,
});
