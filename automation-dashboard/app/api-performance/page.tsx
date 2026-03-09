"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/summary-cards/StatCard";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import DataTable from "@/components/tables/DataTable";
import AutoRefresh from "@/components/AutoRefresh";

type Log = Record<string, unknown>;
type Stat = { apiEndpoint: string; domain: string; method: string; avgResponseTime: number; minResponseTime: number; maxResponseTime: number; totalCalls: number };

export default function ApiPerformancePage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    fetch("/api/reports/third-party").then((r) => r.json()).then((d) => {
      setLogs(d.logs ?? []);
      setStats(d.stats ?? []);
    }).catch(() => {});
  }, []);

  const totalCalls = logs.length;
  const avgTime = totalCalls > 0 ? Math.round(logs.reduce((a, l) => a + (l.responseTime as number), 0) / totalCalls) : 0;
  const fastest = stats.length > 0 ? stats.reduce((a, b) => a.minResponseTime < b.minResponseTime ? a : b) : null;
  const slowest = stats.length > 0 ? stats.reduce((a, b) => a.maxResponseTime > b.maxResponseTime ? a : b) : null;
  const top10 = [...stats].sort((a, b) => b.avgResponseTime - a.avgResponseTime).slice(0, 10);

  const barLabels = top10.map((s) => { try { return new URL(s.apiEndpoint).pathname.slice(0, 30); } catch { return s.apiEndpoint.slice(0, 30); } });
  const trendLabels = logs.slice(-50).map((_, i) => String(i + 1));
  const trendValues = logs.slice(-50).map((l) => l.responseTime as number);

  const columns = [
    { key: "apiEndpoint" as const, label: "API Endpoint", render: (v: unknown) => <span className="text-blue-400 text-xs break-all">{String(v)}</span> },
    { key: "domain" as const, label: "Domain" },
    { key: "method" as const, label: "Method" },
    { key: "avgResponseTime" as const, label: "Avg (ms)" },
    { key: "minResponseTime" as const, label: "Min (ms)" },
    { key: "maxResponseTime" as const, label: "Max (ms)" },
    { key: "totalCalls" as const, label: "Calls" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">📊 Third-Party API Performance</h1>
        <AutoRefresh />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total API Calls" value={totalCalls} color="blue" />
        <StatCard label="Avg Response Time" value={`${avgTime}ms`} color="purple" />
        <StatCard label="Fastest API" value={fastest ? `${fastest.minResponseTime}ms` : "N/A"} color="green" sub={fastest?.domain} />
        <StatCard label="Slowest API" value={slowest ? `${slowest.maxResponseTime}ms` : "N/A"} color="red" sub={slowest?.domain} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {barLabels.length > 0 && <BarChart labels={barLabels} values={top10.map((s) => s.avgResponseTime)} title="Top 10 Endpoints by Avg Response Time" color="#8b5cf6" yLabel="Avg ms" />}
        {trendValues.length > 0 && <LineChart labels={trendLabels} values={trendValues} title="Response Time Trend (last 50 calls)" />}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">Top 10 Slowest Third-Party APIs</h2>
        <DataTable data={top10} columns={columns} searchKeys={["apiEndpoint", "domain", "method"]} />
      </div>
    </div>
  );
}
