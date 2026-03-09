"use client";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useDashTheme } from "@/components/DashThemeProvider";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props { labels: string[]; values: number[]; title: string }

export default function LineChart({ labels, values, title }: Props) {
  const { theme } = useDashTheme();
  const isK = theme === "kryptonite";
  const lineColor = isK ? "#39ff14" : "#8b5cf6";
  const fillColor = isK ? "rgba(57,255,20,0.08)" : "rgba(139,92,246,0.15)";
  const gridColor = isK ? "rgba(57,255,20,0.06)" : "#1f2937";
  const tickColor = isK ? "rgba(57,255,20,0.3)" : "#6b7280";
  const titleColor = isK ? "rgba(57,255,20,0.6)" : "#d1d5db";

  const data = {
    labels,
    datasets: [{
      label: "Response Time (ms)",
      data: values,
      borderColor: lineColor,
      backgroundColor: fillColor,
      tension: 0.3,
      pointRadius: 3,
      pointBackgroundColor: lineColor,
    }],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: title, color: titleColor, font: { size: 13, family: isK ? "Orbitron" : undefined } },
    },
    scales: {
      x: { ticks: { color: tickColor, maxRotation: 45 }, grid: { color: gridColor } },
      y: { ticks: { color: tickColor }, grid: { color: gridColor } },
    },
  };
  return (
    <div className="k-chart-wrap bg-gray-900 rounded-xl p-4 border border-gray-800">
      <Line data={data} options={options} />
    </div>
  );
}
