"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useDashTheme } from "@/components/DashThemeProvider";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ passed, failed, skipped }: { passed: number; failed: number; skipped: number }) {
  const { theme } = useDashTheme();
  const isK = theme === "kryptonite";
  const legendColor = isK ? "rgba(57,255,20,0.5)" : "#9ca3af";

  const data = {
    labels: ["Passed", "Failed", "Skipped"],
    datasets: [{
      data: [passed, failed, skipped],
      backgroundColor: isK ? ["#22cc44", "#ff3344", "#ffaa00"] : ["#22c55e", "#ef4444", "#eab308"],
      borderColor: isK ? ["#0a6622", "#991b1b", "#92400e"] : ["#16a34a", "#dc2626", "#ca8a04"],
      borderWidth: 2,
    }],
  };
  return (
    <div className="k-chart-wrap bg-gray-900 rounded-xl p-4 border border-gray-800">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Pass / Fail / Skip</h3>
      <div className="max-w-xs mx-auto">
        <Doughnut data={data} options={{ plugins: { legend: { labels: { color: legendColor } } } }} />
      </div>
    </div>
  );
}
