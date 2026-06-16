"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, QrCode, Search } from "lucide-react";
import { motion } from "framer-motion";
import CreateEventModal from "@/components/admin/CreateEventModal";
import { apiCall } from "@/app/utils/api";
import { useToast } from "@/components/ui/ToastProvider";

export default function EventsPage() {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiCall("/admin/events");
      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
      toast.error("Events could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();

    window.addEventListener("admin-event-created", fetchEvents);
    return () => window.removeEventListener("admin-event-created", fetchEvents);
  }, [fetchEvents]);

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950">Events</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage all events and view their specific stats.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-black shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)]"
          type="button"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.02)]">
        <Search className="h-5 w-5 text-zinc-400" />
        <input
          type="text"
          placeholder="Search by name or code..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-zinc-400"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-700" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-sm font-bold text-zinc-400">
            No events found.
          </div>
        ) : (
          <>
            {/* Mobile/Tablet Card Grid (hidden on desktop) */}
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:hidden bg-zinc-50/50">
              {filteredEvents.map((event) => (
                <motion.div
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  key={event._id}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow duration-300 hover:shadow-lg hover:shadow-zinc-900/5"
                >
                  <div className="flex flex-col justify-between h-full gap-4">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-black text-zinc-950 truncate text-base group-hover:text-zinc-700 transition-colors">
                          {event.name}
                        </h3>
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-black text-zinc-700">
                          <QrCode className="h-3 w-3 text-zinc-600" />
                          {event.code}
                        </span>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                        <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-2.5">
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400">Guests</span>
                          <span className="block mt-0.5 text-sm font-black text-zinc-900">{event.guestCount || 0}</span>
                        </div>
                        <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-2.5">
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400">Photos</span>
                          <span className="block mt-0.5 text-sm font-black text-zinc-900">{event.photoCount || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                      <span className="text-[10px] font-bold text-zinc-400">
                        {new Date(event.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                      <Link
                        href={`/admin/events/${event._id}`}
                        className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-3.5 py-2 text-xs font-black text-white transition hover:bg-black"
                      >
                        Manage Event
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop table (hidden on mobile/tablet) */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50">
                  <tr>
                    <th className="px-5 py-4 font-bold text-zinc-500">Event Name</th>
                    <th className="px-5 py-4 font-bold text-zinc-500">Code</th>
                    <th className="px-5 py-4 font-bold text-zinc-500">Guests</th>
                    <th className="px-5 py-4 font-bold text-zinc-500">Photos</th>
                    <th className="px-5 py-4 font-bold tracking-tight text-zinc-500">
                      Date Created
                    </th>
                    <th className="px-5 py-4 text-right font-bold text-zinc-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="transition hover:bg-zinc-50/50">
                      <td className="px-5 py-4 font-extrabold text-zinc-950">{event.name}</td>
                      <td className="px-5 py-4">
                        <span className="flex max-w-fit items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs font-bold text-zinc-700">
                          <QrCode className="h-3.5 w-3.5 text-zinc-500" />
                          {event.code}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-zinc-600">{event.guestCount || 0}</td>
                      <td className="px-5 py-4 font-semibold text-zinc-600">{event.photoCount || 0}</td>
                      <td className="px-5 py-4 text-zinc-500 font-semibold">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/events/${event._id}`}
                          className="inline-block rounded-xl border border-zinc-950 bg-zinc-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-black"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchEvents}
      />
    </div>
  );
}
