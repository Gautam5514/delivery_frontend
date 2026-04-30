"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah & David",
    role: "Bride & Groom",
    content: "We hated the idea of chasing people to send them photos. This app did it all automatically. Our guests were mind-blown when they got their pictures the very next day!",
    avatar: "https://images.unsplash.com/photo-1541250848049-b4f71426cac8?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Michael T.",
    role: "Event Guest",
    content: "Usually I never see the photos taken of me at events. With this, I got a text the morning after with 12 amazing HQ photos of me and my wife. Absolutely brilliant.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Jessica Lee",
    role: "Event Photographer",
    content: "It saves me hours of admin work. I just give the couple the bulk folder, they upload it here, and their guests are sorted. I've started recommending it to all my clients.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Emily Chen",
    role: "Event Planner",
    content: "I manage 50+ events a year. The facial recognition accuracy is scary good. It adds a premium tech touch to my events that clients absolutely love paying for.",
    avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Mark Robinson",
    role: "Corporate Host",
    content: "We used Kwikpic for our annual tech summit. Distributing 5,000+ photos to 800 attendees used to take weeks. With this, it was done before the closing keynote.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Lisa Kudrow",
    role: "Birthday Host",
    content: "Organized my husband's 40th. Everyone took selfies to register and boom—custom albums for everyone. No more WhatsApp groups compressing our memories!",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656ec?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "James & Alisha",
    role: "Newlyweds",
    content: "The privacy settings were a big deal for us. We didn't want a public link. Knowing guests could only see their own photos made everyone feel comfortable.",
    avatar: "https://images.unsplash.com/photo-1623091411315-04ff09ebee63?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Tom H.",
    role: "Festival Organizer",
    content: "Handled massive volume without breaking a sweat. The 'One Shot Upload' feature is a lifesaver when you have terabytes of data from multiple shooters.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Sophie V.",
    role: "Event Guest",
    content: "I didn't even know half these photos existed! It found candid shots of me dancing that I will cherish forever. Such a cool surprise to wake up to.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Ryan G.",
    role: "Freelance Photographer",
    content: "My print sales actually went up because people got their digital previews so fast. They were excited and ready to buy frames immediately.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
];

export default function TestimonialsSection() {
  const firstRow = testimonials.slice(0, 5);
  const secondRow = testimonials.slice(5, 10);

  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#4b5563 1px, transparent 1px), linear-gradient(to right, #4b5563 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] -z-10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-4"
        >
          <Star className="w-3 h-3 fill-current" />
          Wall of Love
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
          Loved by{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            thousands
          </span>{" "}
          of users.
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          From intimate events to massive corporate events, see why people trust
          Kwikpic to deliver their memories.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <InfiniteMarquee items={firstRow} direction="left" speed={70} />
        <InfiniteMarquee items={secondRow} direction="right" speed={80} />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 to-transparent z-20" />
    </section>
  );
}

function InfiniteMarquee({ items, direction = "left", speed = 20 }) {
  return (
    <div className="relative flex overflow-hidden group">
      <motion.div
        className="flex gap-6 shrink-0 px-3"
        initial={{ x: direction === "left" ? 0 : "-100%" }}
        animate={{ x: direction === "left" ? "-100%" : 0 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        style={{ width: "max-content" }}
      >
        {[...items, ...items, ...items].map((item, idx) => (
          <TestimonialCard key={`${item.name}-${idx}`} data={item} />
        ))}
      </motion.div>
    </div>
  );
}

function TestimonialCard({ data }) {
  return (
    <div className="relative w-[350px] md:w-[400px] shrink-0 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
      <Quote className="absolute top-6 right-6 text-slate-100 fill-slate-50 w-10 h-10" />

      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="text-[15px] leading-relaxed text-slate-700 mb-6 font-medium relative z-10 min-h-[80px]">
        &ldquo;{data.content}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
          <Image
            src={data.avatar}
            alt={data.name}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{data.name}</h4>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {data.role}
          </p>
        </div>
      </div>
    </div>
  );
}
