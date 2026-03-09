"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/summary-cards/StatCard";
import DataTable from "@/components/tables/DataTable";
import AutoRefresh from "@/components/AutoRefresh";

type Log = Record<string, unknown>;

export default function FailedApisPage() {
  const [failed, setFailed] = useState<Log[]>([]);

  useEffect(() => {
    fetch("/api/reports/failed").then((r) => r.json()).then(setFailed).catch(() => {});
  }, []);

  const columns = [
    { key: "apiEndpoint" as const, label: "API Endpoint", render: (v: unknown) => <span className="text-red-400 text-xs break-all">{String(v)}</span> },
    { key: "apiDomain" as const, label: "Domain" },
    { key: "method" as const, label: "Method" },
    {
      key: "statusCode" as const, label: "Status Code",
      render: (v: unknown) => <span className="bg-red-900 text-red-300 px-2 py-0.5 rounded text-xs font-bold">{String(v)}</span>,
    },
    { key: "testCase" as const, label: "Test Case" },
    { key: "responseTime" as const, label: "Response Time (ms)" },
    { key: "responseBody" as const, label: "Error Message", render: (v: unknown) => <span className="text-xs text-gray-400">{String(v ?? "-").slice(0, 80)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">🔴 Failed API Monitoring</h1>
        <AutoRefresh />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Failed APIs" value={failed.length} color="red" />
        <StatCard label="Unique Endpoints" value={new Set(failed.map((f) => f.apiEndpoint)).size} color="red" />
        <StatCard label="Unique Domains" value={new Set(failed.map((f) => f.apiDomain)).size} color="red" />
      </div>
      {failed.length === 0 ? (
        <div className="bg-green-950/40 border border-green-800 rounded-xl p-8 text-center text-green-400">
          ✅ No failed third-party API calls detected
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold text-gray-200 mb-3">Failed API Calls</h2>
          <DataTable data={failed} columns={columns} searchKeys={["apiEndpoint", "apiDomain", "testCase"]} rowClass={() => "bg-red-950/20"} />
        </div>
      )}
    </div>
  );
}
