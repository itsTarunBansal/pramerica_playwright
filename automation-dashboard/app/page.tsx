"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/summary-cards/StatCard";
import PieChart from "@/components/charts/PieChart";
import BarChart from "@/components/charts/BarChart";
import DataTable from "@/components/tables/DataTable";
import AutoRefresh from "@/components/AutoRefresh";

type Test = { testCaseId: string; status: string; duration: number; error: string | null };
type Summary = { total: number; passed: number; failed: number; skipped: number; totalDuration: number; tests: Test[] };

const EMPTY: Summary = { total: 0, passed: 0, failed: 0, skipped: 0, totalDuration: 0, tests: [] };

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary>(EMPTY);

  useEffect(() => {
    fetch("/api/reports/execution").then((r) => r.json()).then(setSummary).catch(() => {});
  }, []);

  const { total, passed, failed, skipped, totalDuration, tests } = summary;

  const columns = [
    { key: "testCaseId" as const, label: "Test Case" },
    {
      key: "status" as const, label: "Status",
      render: (v: unknown) => (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
          v === "passed" ? "bg-green-900 text-green-300" :
          v === "failed" ? "bg-red-900 text-red-300" : "bg-yellow-900 text-yellow-300"
        }`}>{String(v)}</span>
      ),
    },
    { key: "duration" as const, label: "Duration (ms)" },
    { key: "error" as const, label: "Error" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">📊 Test Execution Dashboard</h1>
        <AutoRefresh />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Tests" value={total} color="blue" />
        <StatCard label="Passed" value={passed} color="green" />
        <StatCard label="Failed" value={failed} color="red" />
        <StatCard label="Skipped" value={skipped} color="yellow" />
        <StatCard label="Total Duration" value={`${(totalDuration / 1000).toFixed(1)}s`} color="purple" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChart passed={passed} failed={failed} skipped={skipped} />
        {tests.length > 0 && (
          <BarChart
            labels={tests.map((t) => t.testCaseId)}
            values={tests.map((t) => t.duration ?? 0)}
            title="Test Duration per Test Case"
            color="#3b82f6"
            yLabel="Duration (ms)"
          />
        )}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">Execution Results</h2>
        <DataTable
          data={tests}
          columns={columns}
          searchKeys={["testCaseId", "status"]}
          rowClass={(row) => row.status === "failed" ? "bg-red-950/30" : ""}
        />
      </div>
    </div>
  );
}
