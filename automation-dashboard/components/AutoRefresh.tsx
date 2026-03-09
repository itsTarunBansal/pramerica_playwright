"use client";
import { useEffect, useState } from "react";

export default function AutoRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
  const [enabled, setEnabled] = useState(false);
  const [countdown, setCountdown] = useState(intervalMs / 1000);

  useEffect(() => {
    if (!enabled) { setCountdown(intervalMs / 1000); return; }
    const tick = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { window.location.reload(); return intervalMs / 1000; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [enabled, intervalMs]);

  return (
    <div className="k-autorefresh flex items-center gap-3 text-sm">
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)}
          className="w-4 h-4 accent-blue-500" />
        <span className="text-gray-400">Auto-refresh</span>
      </label>
      {enabled && <span className="text-blue-400">Refreshing in {countdown}s</span>}
    </div>
  );
}
