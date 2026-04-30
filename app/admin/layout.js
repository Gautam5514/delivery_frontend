"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { apiCall, clearAuthSession, getAuthUser } from "../utils/api";
import { useToast } from "@/components/ui/ToastProvider";

export default function AdminLayout({ children }) {
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [billingStatus, setBillingStatus] = useState({
    subscription: null,
    usage: null,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentUser(getAuthUser());
      setAuthChecked(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    if (!currentUser || currentUser.role !== "admin") {
      clearAuthSession().catch(() => {});
      router.replace("/login");
    }
  }, [authChecked, router, currentUser]);

  useEffect(() => {
    const syncAuthUser = () => setCurrentUser(getAuthUser());
    window.addEventListener("admin-profile-updated", syncAuthUser);
    return () => window.removeEventListener("admin-profile-updated", syncAuthUser);
  }, []);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") return;

    let cancelled = false;

    const loadBillingStatus = async () => {
      try {
        const data = await apiCall("/billing/status");
        if (!cancelled) {
          setBillingStatus({
            subscription: data.subscription,
            usage: data.usage,
          });
        }
      } catch {
        if (!cancelled) {
          setBillingStatus({ subscription: null, usage: null });
          toast.warning("Billing status could not be refreshed.");
        }
      }
    };

    loadBillingStatus();
    return () => {
      cancelled = true;
    };
  }, [currentUser, pathname, toast]);

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = async () => {
    await clearAuthSession();
    router.push("/login");
  };

  if (!authChecked || !currentUser) return null;

  const displayName = currentUser?.name || "Admin";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="h-screen overflow-hidden bg-[#FAFAFA] font-sans text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm md:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      <div className="flex h-full">
        <Sidebar
          currentUser={currentUser}
          displayName={displayName}
          initials={initials}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          pathname={pathname}
        />

        <main className="relative h-screen flex-1 overflow-y-auto overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-indigo-50/40 blur-[120px]" />
            <div className="absolute -right-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-blue-50/40 blur-[100px]" />
          </div>

          <Header
            billingStatus={billingStatus}
            currentUser={currentUser}
            displayName={displayName}
            initials={initials}
            onLogout={handleLogout}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            pathname={pathname}
          />

          <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
