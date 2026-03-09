export default function StatCard({
  label, value, color = "blue", sub,
}: { label: string; value: string | number; color?: string; sub?: string }) {
  const colors: Record<string, string> = {
    blue: "border-blue-500 text-blue-400",
    green: "border-green-500 text-green-400",
    red: "border-red-500 text-red-400",
    yellow: "border-yellow-500 text-yellow-400",
    purple: "border-purple-500 text-purple-400",
  };
  return (
    <div className={`k-stat-card bg-gray-900 rounded-xl border-l-4 p-4 ${colors[color] ?? colors.blue}`}>
      <p className="k-stat-label text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`k-stat-value text-3xl font-bold mt-1 ${colors[color]?.split(" ")[1]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
