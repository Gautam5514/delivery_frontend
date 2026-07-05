"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";

// Fallback data in case you want to test immediately without your import.
// These questions double as SEO content: they target real search phrases and
// power the FAQPage structured data that can earn expandable Google results.
const defaultFaqItems = [
  {
    q: "What is the best way to share wedding photos with all your guests?",
    a: "The fastest way to share wedding photos is FaceDeliver. Upload the full gallery once, and every guest scans a QR code, takes a selfie, and instantly gets their own photos delivered through AI face recognition — no manual sorting and no group chats full of duplicates.",
  },
  {
    q: "Do guests need to download an app to view their photos?",
    a: "No. FaceDeliver works in any web browser on any phone or laptop. Guests just open a link or scan a QR code — there is nothing to download from the App Store or Google Play, so anyone can access their event photos in seconds.",
  },
  {
    q: "How does the facial recognition work?",
    a: "Our AI scans the uploaded event photos and creates a unique face print. It then matches this against the selfie you upload, filtering thousands of photos down to just the ones you are in, with 99.9% accuracy.",
  },
  {
    q: "Can I share event photos using a QR code?",
    a: "Yes. Every event gets a unique QR code and link. Print it on a wedding card, display it at a corporate booth, or share it in a school group — guests scan once and reach their personalized photo gallery, no sign-up friction required.",
  },
  {
    q: "How fast are event photos delivered to guests?",
    a: "Once photos are uploaded, AI matching runs automatically and guests receive their personal gallery within minutes — not days or weeks. It works for weddings, school events, college fests, corporate conferences, and birthday parties.",
  },
  {
    q: "Is the photo quality preserved?",
    a: "Absolutely. We do not compress your memories. Whether you upload 5MB or 50MB files, your guests will download the exact same resolution you uploaded. Original quality, always.",
  },
  {
    q: "Can I upload multiple folders at once?",
    a: "Yes! Our 'One Shot Upload' feature allows you to drag and drop entire directory structures. We automatically organize sub-folders into specific event albums for you.",
  },
  {
    q: "Is my data secure and private?",
    a: "Security is our top priority. Photos are stored in encrypted cloud storage and are only accessible to guests who have the specific event link or QR code. You have full control over privacy settings, and face data is deleted after the event.",
  },
];

export default function FaqSection({ faqItems = defaultFaqItems }) {
  // Removed TypeScript generic <number | null>
  const [activeIndex, setActiveIndex] = useState(0);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section id="faq" className="relative bg-white py-16 px-4 sm:py-24 sm:px-6 lg:px-8 overflow-hidden">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Background Decor: Subtle Blue Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 opacity-60" />

      <div className="mx-auto max-w-4xl">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-600 mb-4"
          >
            Support & Answers
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Everything you need to know about creating events, sharing photos, and managing your gallery.
          </motion.p>
        </div>

        {/* ACCORDION LIST */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.q}
              answer={item.a}
              isOpen={activeIndex === index}
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* BOTTOM CTA CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 relative overflow-hidden rounded-xl bg-slate-900 p-8 sm:p-10 text-white shadow-2xl"
        >
          {/* Decorative circles inside card */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-yellow-400 rounded-full blur-3xl opacity-10"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
              <p className="text-slate-400">Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
               <a
                href="/admin"
                className="group flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition-all hover:bg-blue-50 hover:scale-105 active:scale-95"
              >
                <span>Create Event</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/contact"
                className="flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-transparent px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800"
              >
                Get in touch
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// --- SUB-COMPONENT: The Accordion Item ---

// Removed TypeScript type annotations here
function AccordionItem({ question, answer, isOpen, onClick }) {
  return (
    <motion.div 
      initial={false}
      animate={{ backgroundColor: isOpen ? "rgba(248, 250, 252, 1)" : "rgba(255, 255, 255, 0)" }}
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-blue-200 shadow-md' : 'border-slate-200 hover:border-blue-100'}`}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between p-5 text-left sm:p-6"
      >
        <span className={`text-base font-bold transition-colors sm:text-lg ${isOpen ? 'text-blue-600' : 'text-slate-800'}`}>
          {question}
        </span>
        <span className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? 'bg-blue-600 border-blue-600 text-white rotate-180' : 'bg-white border-slate-200 text-slate-400'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 pt-0 text-slate-600 leading-relaxed text-[15px] sm:px-6 sm:pb-6">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}