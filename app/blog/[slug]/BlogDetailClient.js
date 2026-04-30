"use client";

import { useEffect, useState } from "react";

export default function BlogDetailClient() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-zinc-100">
      <div
        className="h-full bg-zinc-900 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
