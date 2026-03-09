"use client";
import { useState } from "react";

interface Column<T> { key: keyof T; label: string; render?: (v: unknown, row: T) => React.ReactNode }

interface Props<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  rowClass?: (row: T) => string;
}

export default function DataTable<T extends Record<string, unknown>>({ data, columns, searchKeys = [], rowClass }: Props<T>) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? data.filter((row) =>
        searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(query.toLowerCase()))
      )
    : data;

  return (
    <div>
      {searchKeys.length > 0 && (
        <input
          className="k-search mb-3 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}
      <div className="k-table-wrap overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className="px-4 py-3 text-left whitespace-nowrap">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center py-8 text-gray-500">No data available</td></tr>
            ) : (
              filtered.map((row, i) => (
                <tr key={i} className={`border-t border-gray-800 hover:bg-gray-800/50 transition-colors ${rowClass?.(row) ?? ""}`}>
                  {columns.map((c) => (
                    <td key={String(c.key)} className="px-4 py-3 whitespace-nowrap">
                      {c.render ? c.render(row[c.key], row) : String(row[c.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="k-record-count text-xs text-gray-600 mt-2">{filtered.length} of {data.length} records</p>
    </div>
  );
}
