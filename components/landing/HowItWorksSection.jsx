"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Search, Download, QrCode } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Admin creates the event",
    desc: "The host generates a unique QR code for their event in seconds from the Admin dashboard.",
    icon: QrCode,
    image: "/images/feat_qr_scan.png"
  },
  {
    id: 2,
    title: "Guests scan & snap a selfie",
    desc: "Guests scan the QR on tables, enter their email, and take a quick selfie to register their face data securely.",
    icon: Camera,
    image: "/images/feat_selfie.png"
  },
  {
    id: 3,
    title: "AI Auto-Matches Faces",
    desc: "After the event, the admin uploads all photos. Our AI instantly matches faces against registered selfies.",
    icon: Search,
    image: "/images/feat_ai_match.png"
  },
  {
    id: 4,
    title: "Guests get notified & download",
    desc: "Guests receive an email with a secure link to view and download only the photos they are actually in.",
    icon: Download,
    image: "/images/feat_ai_match.png"
  }
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how" className="relative py-24 bg-white border-y border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-lg text-zinc-600">
            A seamless experience for the hosts, the photographer, and every single guest.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center lg:gap-12">

          {/* Steps selector */}
          <div className="space-y-3 sm:space-y-4">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`
                    cursor-pointer p-4 rounded-xl border transition-all duration-300 sm:p-6
                    ${isActive
                      ? 'border-zinc-300 bg-zinc-100 shadow-[0_0_30px_-10px_rgba(255,255,255,0.08)]'
                      : 'border-zinc-200 bg-white hover:bg-zinc-50'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      flex shrink-0 h-10 w-10 items-center justify-center rounded-2xl transition-colors sm:h-12 sm:w-12
                      ${isActive ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-300/50' : 'bg-zinc-100 text-zinc-600'}
                    `}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className={`text-base font-semibold mb-1.5 transition-colors sm:text-xl sm:mb-2 ${isActive ? 'text-zinc-900' : 'text-zinc-600'}`}>
                        {step.id}. {step.title}
                      </h3>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-zinc-600 leading-relaxed overflow-hidden"
                          >
                            {step.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image Display */}
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-zinc-200 shadow-xl bg-white sm:aspect-square md:aspect-[4/3]">
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200/60 to-transparent z-10 pointer-events-none mix-blend-screen" />

            <AnimatePresence mode="wait">
              <motion.img
                key={activeStep}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent pointer-events-none z-20" />
          </div>

        </div>
      </div>
    </section>
  );
}
