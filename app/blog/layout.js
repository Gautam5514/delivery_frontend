import { buildMetadata } from "../seo.config";

export const metadata = buildMetadata({
  title: "Blog – Event Photo Delivery Tips & AI Photography Guides",
  description:
    "Guides on sharing event photos with guests, AI face matching, QR-code galleries, and automated photo delivery for photographers and event organizers.",
  path: "/blog",
});

export default function BlogLayout({ children }) {
  return children;
}
