"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "normal" | "kryptonite";
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "kryptonite", toggle: () => {} });

export function DashThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("kryptonite");

  // Sync from localStorage after mount (client only) — no hydration mismatch
  useEffect(() => {
    const saved = localStorage.getItem("dash-theme") as Theme | null;
    if (saved && saved !== theme) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("dash-theme", theme);
  }, [theme]);

  return (
    <Ctx.Provider value={{ theme, toggle: () => setTheme(t => t === "normal" ? "kryptonite" : "normal") }}>
      {children}
    </Ctx.Provider>
  );
}

export const useDashTheme = () => useContext(Ctx);
