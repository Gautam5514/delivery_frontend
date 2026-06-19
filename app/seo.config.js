// Central SEO configuration. Update SITE_URL to your final production domain.
// Set NEXT_PUBLIC_SITE_URL in your environment to override per deploy.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://facedeliver.shop"
).replace(/\/$/, "");

export const SITE_NAME = "FaceDeliver";

export const SITE_DESCRIPTION =
  "FaceDeliver uses AI face recognition to instantly deliver event photos to every guest. QR-code galleries for weddings, schools, college fests, corporate events and more.";

// Default share image used for Open Graph / Twitter. Add a 1200x630 image at
// /public/og-image.png for best results (falls back to the logo for now).
export const OG_IMAGE = "/og-image.png";

export const SITE_KEYWORDS = [
  "event photo delivery",
  "AI face recognition photos",
  "face matching photo app",
  "QR code photo gallery",
  "wedding photo sharing app",
  "school event photos",
  "corporate event photo delivery",
  "share event photos with guests",
  "photographer photo delivery software",
  "FaceDeliver",
];

// Used for canonical URLs. Pass a leading-slash path, e.g. "/services".
export const canonical = (path = "/") =>
  `${SITE_URL}${path === "/" ? "" : path}`;

// Helper to build a complete metadata object for a page.
export function buildMetadata({ title, description, path = "/", image }) {
  const url = canonical(path);
  const img = image || OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: img }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img],
    },
  };
}
