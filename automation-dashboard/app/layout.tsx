import type { Metadata } from "next";
import "./globals.css";
import { DashThemeProvider } from "@/components/DashThemeProvider";
import KryptoniteToggle from "@/components/KryptoniteToggle";

export const metadata: Metadata = {
  title: "Kryptonite — Automation Dashboard",
  description: "Kryptonite Playwright Automation Analytics Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var t = localStorage.getItem('dash-theme') || 'kryptonite';
            document.documentElement.setAttribute('data-theme', t);
          })()
        `}} />
      </head>
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <DashThemeProvider>
          <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-6">
            <span className="font-bold text-lg text-white">⬡ Kryptonite — Automation Dashboard</span>
            <a href="/" className="text-gray-300 hover:text-white text-sm">Overview</a>
            <a href="/api-performance" className="text-gray-300 hover:text-white text-sm">API Performance</a>
            <a href="/failed-apis" className="text-gray-300 hover:text-white text-sm">Failed APIs</a>
            <a href="/slow-apis" className="text-gray-300 hover:text-white text-sm">Slow APIs</a>
            <div className="ml-auto">
              <KryptoniteToggle />
            </div>
          </nav>
          <main className="p-6">{children}</main>
        </DashThemeProvider>
      </body>
    </html>
  );
}
