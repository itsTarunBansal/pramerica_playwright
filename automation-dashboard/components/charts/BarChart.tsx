"use client";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useDashTheme } from "@/components/DashThemeProvider";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  labels: string[];
  values: number[];
  title: string;
  color?: string;
  yLabel?: string;
}

export default function BarChart({ labels, values, title, color = "#3b82f6", yLabel = "ms" }: Props) {
  const { theme } = useDashTheme();
  const isK = theme === "kryptonite";
  const barColor = isK ? "#22cc44" : color;
  const gridColor = isK ? "rgba(57,255,20,0.06)" : "#1f2937";
  const tickColor = isK ? "rgba(57,255,20,0.3)" : "#6b7280";
  const titleColor = isK ? "rgba(57,255,20,0.6)" : "#d1d5db";

  const data = {
    labels,
    datasets: [{
      label: yLabel,
      data: values,
      backgroundColor: barColor,
      borderRadius: isK ? 0 : 4,
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
    <div className={`k-chart-wrap bg-gray-900 rounded-xl p-4 border border-gray-800`}>
      <Bar data={data} options={options} />
    </div>
  );
}
