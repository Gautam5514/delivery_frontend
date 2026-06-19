import { buildMetadata } from "../seo.config";

export const metadata = buildMetadata({
  title: "Contact FaceDeliver – Talk to Our Team",
  description:
    "Get in touch with the FaceDeliver team about AI event photo delivery, demos, pricing, or partnership opportunities for photographers and event organizers.",
  path: "/contact",
});

export default function ContactLayout({ children }) {
  return children;
}
