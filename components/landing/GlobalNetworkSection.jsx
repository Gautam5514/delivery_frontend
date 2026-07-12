"use client";

import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";
import WorldMap from "@/components/ui/map";

// Hub cities keep visible label pills; dense Indian capitals use
// hideLabel so they stay hover/tap-discoverable without cluttering the map
const cities = {
  newDelhi: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
  mumbai: { lat: 19.076, lng: 72.8777, label: "Mumbai", hideLabel: true },
  bengaluru: { lat: 12.9716, lng: 77.5946, label: "Bengaluru", hideLabel: true },
  chennai: { lat: 13.0827, lng: 80.2707, label: "Chennai", hideLabel: true },
  kolkata: { lat: 22.5726, lng: 88.3639, label: "Kolkata", hideLabel: true },
  hyderabad: { lat: 17.385, lng: 78.4867, label: "Hyderabad", hideLabel: true },
  jaipur: { lat: 26.9124, lng: 75.7873, label: "Jaipur", hideLabel: true },
  lucknow: { lat: 26.8467, lng: 80.9462, label: "Lucknow", hideLabel: true },
  bhopal: { lat: 23.2599, lng: 77.4126, label: "Bhopal", hideLabel: true },
  patna: { lat: 25.5941, lng: 85.1376, label: "Patna", hideLabel: true },
  dispur: { lat: 26.1445, lng: 91.7362, label: "Dispur", hideLabel: true },
  thiruvananthapuram: {
    lat: 8.5241,
    lng: 76.9366,
    label: "Thiruvananthapuram",
    hideLabel: true,
  },
  chandigarh: { lat: 30.7333, lng: 76.7794, label: "Chandigarh", hideLabel: true },
  bhubaneswar: { lat: 20.2961, lng: 85.8245, label: "Bhubaneswar", hideLabel: true },
  gandhinagar: { lat: 23.2156, lng: 72.6369, label: "Gandhinagar", hideLabel: true },
  srinagar: { lat: 34.0837, lng: 74.7973, label: "Srinagar", hideLabel: true },
  raipur: { lat: 21.2514, lng: 81.6296, label: "Raipur", hideLabel: true },
  ranchi: { lat: 23.3441, lng: 85.3096, label: "Ranchi", hideLabel: true },
  london: { lat: 51.5074, lng: -0.1278, label: "London" },
  newYork: { lat: 40.7128, lng: -74.006, label: "New York" },
  sanFrancisco: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
  saoPaulo: { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
  dubai: { lat: 25.2048, lng: 55.2708, label: "Dubai" },
  nairobi: { lat: -1.2921, lng: 36.8219, label: "Nairobi" },
  singapore: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
  tokyo: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
  sydney: { lat: -33.8688, lng: 151.2093, label: "Sydney" },
};

const routes = [
  // Domestic starburst — New Delhi to state capitals across India
  { start: cities.newDelhi, end: cities.srinagar },
  { start: cities.newDelhi, end: cities.chandigarh },
  { start: cities.newDelhi, end: cities.jaipur },
  { start: cities.newDelhi, end: cities.lucknow },
  { start: cities.newDelhi, end: cities.gandhinagar },
  { start: cities.newDelhi, end: cities.bhopal },
  { start: cities.newDelhi, end: cities.patna },
  { start: cities.newDelhi, end: cities.ranchi },
  { start: cities.newDelhi, end: cities.raipur },
  { start: cities.newDelhi, end: cities.kolkata },
  { start: cities.newDelhi, end: cities.dispur },
  { start: cities.newDelhi, end: cities.bhubaneswar },
  { start: cities.newDelhi, end: cities.mumbai },
  { start: cities.newDelhi, end: cities.hyderabad },
  { start: cities.newDelhi, end: cities.bengaluru },
  { start: cities.newDelhi, end: cities.chennai },
  { start: cities.newDelhi, end: cities.thiruvananthapuram },
  // Global routes
  { start: cities.newDelhi, end: cities.dubai },
  { start: cities.newDelhi, end: cities.london },
  { start: cities.london, end: cities.newYork },
  { start: cities.newYork, end: cities.sanFrancisco },
  { start: cities.saoPaulo, end: cities.london },
  { start: cities.mumbai, end: cities.nairobi },
  { start: cities.newDelhi, end: cities.singapore },
  { start: cities.newDelhi, end: cities.tokyo },
  { start: cities.singapore, end: cities.sydney },
];

export default function GlobalNetworkSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700"
          >
            <Globe2 className="h-3 w-3" />
            Global Network
          </motion.div>

          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            From every Indian state,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              to the world.
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            FaceDeliver powers events in every Indian state capital and across
            six continents - weddings in Jaipur, summits in Singapore, and
            festivals in São Paulo, all delivered instantly.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-4"
        >
          <WorldMap
            dots={routes}
            lineColor="#2563eb"
            labelClassName="text-[10px] font-semibold"
          />
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500 sm:gap-5 sm:text-xs">
          <span>18 Indian State Capitals</span>
          <span className="h-1 w-1 rounded-full bg-zinc-400/70" />
          <span>6 Continents</span>
          <span className="h-1 w-1 rounded-full bg-zinc-400/70" />
          <span>Instant Photo Delivery Anywhere</span>
        </div>
      </div>
    </section>
  );
}
