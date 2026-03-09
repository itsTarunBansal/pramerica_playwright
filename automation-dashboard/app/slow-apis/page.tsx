"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/summary-cards/StatCard";
import BarChart from "@/components/charts/BarChart";
import DataTable from "@/components/tables/DataTable";
import AutoRefresh from "@/components/AutoRefresh";

type Log = Record<string, unknown>;
const SLOW_THRESHOLD = 2000;

export default function SlowApisPage() {
  const [slow, setSlow] = useState<Log[]>([]);

  useEffect(() => {
    fetch("/api/reports/slow").then((r) => r.json()).then(setSlow).catch(() => {});
  }, []);

  const maxDelay = slow.length > 0 ? Math.max(...slow.map((l) => l.responseTime as number)) : 0;

  const endpointMap: Record<string, { count: number; max: number }> = {};
  for (const l of slow) {
    const ep = l.apiEndpoint as string;
    if (!endpointMap[ep]) endpointMap[ep] = { count: 0, max: 0 };
    endpointMap[ep].count++;
    endpointMap[ep].max = Math.max(endpointMap[ep].max, l.responseTime as number);
  }
  const aggregated = Object.entries(endpointMap)
    .map(([ep, v]) => ({ apiEndpoint: ep, slowCalls: v.count, maxResponseTime: v.max }))
    .sort((a, b) => b.maxResponseTime - a.maxResponseTime);

  const barLabels = aggregated.slice(0, 10).map((a) => { try { return new URL(a.apiEndpoint).pathname.slice(0, 30); } catch { return a.apiEndpoint.slice(0, 30); } });

  const columns = [
    { key: "apiEndpoint" as const, label: "API Endpoint", render: (v: unknown) => <span className="text-yellow-400 text-xs break-all">{String(v)}</span> },
    { key: "apiDomain" as const, label: "Domain" },
    { key: "method" as const, label: "Method" },
    {
      key: "responseTime" as const, label: "Response Time (ms)",
      render: (v: unknown) => <span className="bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded text-xs font-bold">{String(v)}ms</span>,
    },
    { key: "testCase" as const, label: "Test Case" },
    { key: "statusCode" as const, label: "Status" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">🟡 Slow API Monitoring</h1>
        <AutoRefresh />
      </div>
      <div className="bg-yellow-950/30 border border-yellow-800 rounded-xl px-4 py-2 text-yellow-400 text-sm">
        ⚠️ Threshold: APIs with response time &gt; {SLOW_THRESHOLD}ms are flagged as slow
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Slow API Calls" value={slow.length} color="yellow" />
        <StatCard label="Max Delay" value={`${maxDelay}ms`} color="yellow" />
        <StatCard label="Unique Slow Endpoints" value={aggregated.length} color="yellow" />
      </div>
      {barLabels.length > 0 && (
        <BarChart labels={barLabels} values={aggregated.slice(0, 10).map((a) => a.maxResponseTime)} title="Slow APIs vs Max Response Time" color="#eab308" yLabel="Max ms" />
      )}
      {slow.length === 0 ? (
        <div className="bg-green-950/40 border border-green-800 rounded-xl p-8 text-center text-green-400">
          ✅ No slow third-party API calls detected
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-gray-200 mb-3">Slow API Calls</h2>
          <DataTable data={slow} columns={columns} searchKeys={["apiEndpoint", "apiDomain", "testCase"]} rowClass={() => "bg-yellow-950/20"} />
        </div>
      )}
    </div>
  );
}
