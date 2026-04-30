// Next.js calls register() once when the server process starts.
// Dynamically importing the Sentry config here (instead of a top-level
// import) lets Next.js tree-shake it on the edge runtime if needed, and
// keeps the startup path clean when SENTRY_DSN is not set.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
}
