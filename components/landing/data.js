export const eventFlowSteps = [
  { title: "Guest scans QR", desc: "Opens your event link instantly" },
  { title: "Registers once", desc: "Name + email + selfie upload" },
  { title: "Admin uploads photos", desc: "Bulk upload 200–300 photos" },
  { title: "Matching runs", desc: "Faces detected & assigned automatically" },
  { title: "Guest gets email", desc: "Private gallery link + downloads" },
];

export const experienceCards = [
  {
    title: "Guest Experience",
    points: ["Scan QR", "Upload selfie once", "Login & download"],
  },
  {
    title: "Admin Experience",
    points: ["Create event", "Upload album", "Start matching"],
  },
  {
    title: "Delivery",
    points: ["Auto face matching", "Photos assigned", "Email sent"],
  },
];

export const featureCards = [
  {
    title: "Face Matching Pipeline",
    desc: "Background processing assigns photos without blocking your server.",
  },
  {
    title: "Private Galleries",
    desc: "Each guest sees only their matched photos — clean and secure.",
  },
  {
    title: "Cloudinary Storage",
    desc: "Selfies + albums handled reliably with CDN-fast delivery.",
  },
  {
    title: "Brevo Email Delivery",
    desc: "Automatic photo-ready emails with your event branding.",
  },
];

export const faqItems = [
  {
    q: "Do guests need to create a password?",
    a: "No. Use OTP login via email for a frictionless experience.",
  },
  {
    q: "What if a photo has multiple faces?",
    a: "We detect multiple faces and match each face against registered guests.",
  },
  {
    q: "Is the gallery private?",
    a: "Yes. Guests can only access their own matched photos after login.",
  },
  {
    q: "Can I run matching after the event?",
    a: "Yes — upload the album anytime and start matching with one click.",
  },
];
