"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, QrCode, Search } from "lucide-react";
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
          <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Manage all events and view their specific stats.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
          type="button"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2">
        <Search className="h-5 w-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by name or code..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-sm text-zinc-500">
            No events found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-zinc-600">Event Name</th>
                  <th className="px-4 py-3 font-medium text-zinc-600">Code</th>
                  <th className="px-4 py-3 font-medium text-zinc-600">Guests</th>
                  <th className="px-4 py-3 font-medium text-zinc-600">Photos</th>
                  <th className="px-4 py-3 font-medium tracking-tight text-zinc-600">
                    Date Created
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredEvents.map((event) => (
                  <tr key={event._id} className="transition hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium">{event.name}</td>
                    <td className="px-4 py-3">
                      <span className="flex max-w-fit items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-700">
                        <QrCode className="h-3 w-3 text-zinc-600" />
                        {event.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">{event.guestCount || 0}</td>
                    <td className="px-4 py-3">{event.photoCount || 0}</td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/events/${event._id}`}
                        className="inline-block rounded border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-black"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
