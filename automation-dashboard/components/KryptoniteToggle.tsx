"use client";
import { useDashTheme } from "./DashThemeProvider";

export default function KryptoniteToggle() {
  const { theme, toggle } = useDashTheme();
  const isK = theme === "kryptonite";
  return (
    <button
      onClick={toggle}
      title={isK ? "Switch to Normal" : "Switch to Kryptonite"}
      className={`k-toggle${isK ? " k-toggle--active" : ""}`}
    >
      <svg viewBox="0 0 100 100" fill="none" width="16" height="16">
        <polygon points="50,2 90,27 90,73 50,98 10,73 10,27" stroke="currentColor" strokeWidth="4" fill="none"/>
        <polygon points="50,22 74,37 74,63 50,78 26,63 26,37" stroke="currentColor" strokeWidth="2.5" fill="rgba(57,255,20,0.06)"/>
        <polygon points="50,38 62,46 62,54 50,62 38,54 38,46" stroke="currentColor" strokeWidth="2" fill="rgba(57,255,20,0.15)"/>
        <circle cx="50" cy="50" r="5" fill="currentColor"/>
      </svg>
      <span>{isK ? "Normal" : "Kryptonite"}</span>
    </button>
  );
}
