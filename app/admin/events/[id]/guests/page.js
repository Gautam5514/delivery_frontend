"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Loader2,
  Search,
  UserRoundCheck,
  UserRoundX,
  Users,
} from "lucide-react";
import { apiCall } from "@/app/utils/api";
import { useToast } from "@/components/ui/ToastProvider";

const pageSizeOptions = [10, 25, 50, 100];

const getGuestDate = (guest) => {
  const value = new Date(guest.createdAt || 0).getTime();
  return Number.isNaN(value) ? 0 : value;
};

const guestMatchesQuery = (guest, query) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [guest.name, guest.email].some((value) =>
    String(value || "").toLowerCase().includes(normalizedQuery)
  );
};

export default function EventGuestsPage() {
  const toast = useToast();
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selfieFilter, setSelfieFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await apiCall(`/admin/events/${params.id}`);
        if (cancelled) return;

        if (data.success) {
          setEvent(data.event);
        } else {
          router.push("/admin/events");
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          toast.error("Guest list could not be loaded.");
          router.push("/admin/events");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEvent();
    return () => {
      cancelled = true;
    };
  }, [params.id, router, toast]);

  const guests = useMemo(() => event?.guests || [], [event]);

  const filteredGuests = useMemo(() => {
    return guests
      .filter((guest) => guestMatchesQuery(guest, searchTerm))
      .filter((guest) => {
        if (selfieFilter === "with") return Boolean(guest.selfieUrl);
        if (selfieFilter === "without") return !guest.selfieUrl;
        return true;
      })
      .sort((first, second) => {
        if (sortOrder === "oldest") return getGuestDate(first) - getGuestDate(second);
        return getGuestDate(second) - getGuestDate(first);
      });
  }, [guests, searchTerm, selfieFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedGuests = filteredGuests.slice(startIndex, startIndex + pageSize);
  const withSelfieCount = guests.filter((guest) => guest.selfieUrl).length;
  const withoutSelfieCount = guests.length - withSelfieCount;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selfieFilter, sortOrder, pageSize]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-700" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/events/${event._id}`}
            className="shrink-0 rounded-full bg-zinc-100 p-2 transition hover:bg-zinc-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-semibold tracking-tight">
              Registered Guests
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
              <span>{event.name}</span>
              <span className="hidden sm:inline">/</span>
              <span className="font-mono text-zinc-700">{event.code}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Total Guests</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{guests.length}</p>
            </div>
            <div className="rounded-2xl bg-zinc-100 p-3 text-zinc-700">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">With Selfie</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{withSelfieCount}</p>
            </div>
            <div className="rounded-2xl bg-zinc-100 p-3 text-zinc-700">
              <UserRoundCheck className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Without Selfie</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{withoutSelfieCount}</p>
            </div>
            <div className="rounded-2xl bg-zinc-100 p-3 text-zinc-700">
              <UserRoundX className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-zinc-200 p-4 lg:grid-cols-[1fr_auto_auto_auto]">
          <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2">
            <Search className="h-5 w-5 text-zinc-500" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by guest name or email..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={selfieFilter}
            onChange={(event) => setSelfieFilter(event.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="all">All guests</option>
            <option value="with">With selfie</option>
            <option value="without">Without selfie</option>
          </select>

          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          <select
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>{size} / page</option>
            ))}
          </select>
        </div>

        {/* Mobile guest cards (hidden on desktop) */}
        <div className="divide-y divide-zinc-200 md:hidden bg-zinc-50/50">
          {paginatedGuests.length === 0 ? (
            <div className="p-8 text-center text-sm font-bold text-zinc-400">
              No guests match the selected filters.
            </div>
          ) : (
            paginatedGuests.map((guest) => (
              <div key={guest._id} className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-black uppercase text-white">
                      {guest.name?.charAt(0) || "G"}
                    </div>
                    <div>
                      <p className="font-extrabold text-zinc-950 text-sm">{guest.name || "Guest"}</p>
                      <p className="text-xs text-zinc-500 font-semibold">{guest.email || "-"}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 shrink-0">
                    {guest.createdAt ? new Date(guest.createdAt).toLocaleDateString(undefined, { dateStyle: 'short' }) : "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-zinc-100/80 pt-2.5">
                  <span className="text-[10px] font-bold text-zinc-400">Selfie Status</span>
                  {guest.selfieUrl ? (
                    <a 
                      href={guest.selfieUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-bold text-zinc-700 transition hover:bg-zinc-50 shadow-sm"
                    >
                      <Image src={guest.selfieUrl} alt={guest.name || "Guest selfie"} width={16} height={16} className="h-4 w-4 rounded-full object-cover" />
                      View Selfie
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-400">
                      <ImageIcon className="h-3 w-3" />
                      Missing
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop guest table (hidden on mobile/tablet) */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
              <tr>
                <th className="px-5 py-4 font-bold text-zinc-500">Guest</th>
                <th className="px-5 py-4 font-bold text-zinc-500">Email</th>
                <th className="px-5 py-4 font-bold text-zinc-500">Selfie</th>
                <th className="px-5 py-4 font-bold text-right text-zinc-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {paginatedGuests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-sm font-bold text-zinc-400">
                    No guests match the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedGuests.map((guest) => (
                  <tr key={guest._id} className="transition hover:bg-zinc-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold uppercase text-zinc-700">
                          {guest.name?.charAt(0) || "G"}
                        </div>
                        <div>
                          <p className="font-extrabold text-zinc-950">{guest.name || "Guest"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-600 font-semibold">{guest.email || "-"}</td>
                    <td className="px-5 py-4">
                      {guest.selfieUrl ? (
                        <a href={guest.selfieUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50">
                          <Image src={guest.selfieUrl} alt={guest.name || "Guest selfie"} width={24} height={24} className="h-6 w-6 rounded-full object-cover" />
                          View selfie
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-400">
                          <ImageIcon className="h-3.5 w-3.5" />
                          Missing
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right text-zinc-500 font-semibold">
                      {guest.createdAt ? new Date(guest.createdAt).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            Showing {filteredGuests.length ? startIndex + 1 : 0}-{Math.min(startIndex + pageSize, filteredGuests.length)} of {filteredGuests.length} guests
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage <= 1}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <span className="rounded-xl bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700">
              Page {safePage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safePage >= totalPages}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
