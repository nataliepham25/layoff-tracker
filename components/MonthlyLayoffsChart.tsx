"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import type { MonthlyTotal } from "@/lib/stats";

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;
  const { total, count } = payload[0].payload as MonthlyTotal;

  if (total === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs shadow-sm">
        <p className="text-text-secondary">{label}</p>
        <p className="text-text-secondary">No layoffs tracked</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface-2 px-3 py-2 shadow-sm">
      <p className="mb-0.5 text-xs text-text-secondary">{label}</p>
      <p className="font-serif text-lg font-medium text-text-primary">
        {total.toLocaleString()}
        <span className="ml-1 text-xs font-sans font-normal text-text-secondary">
          affected
        </span>
      </p>
      <p className="text-xs text-text-secondary">
        {count.toLocaleString()} {count === 1 ? "layoff" : "layoffs"}
      </p>
    </div>
  );
}

export default function MonthlyLayoffsChart({ data }: { data: MonthlyTotal[] }) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="month"
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            width={48}
            allowDecimals={false}
            tickFormatter={(value: number) => value.toLocaleString()}
          />
          <Tooltip
            cursor={{ fill: "var(--surface-1)" }}
            content={(props) => <ChartTooltip {...props} />}
          />
          <Bar
            dataKey="total"
            fill="var(--text-accent)"
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
          />
        </BarChart>
      </ResponsiveContainer>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-xs uppercase tracking-wide text-text-secondary">
          View as table
        </summary>
        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary">
              <th className="py-2 pr-4 font-medium">Month</th>
              <th className="py-2 pr-4 font-medium">People affected</th>
              <th className="py-2 font-medium">Layoffs</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.month} className="border-b border-border last:border-b-0">
                <td className="py-2 pr-4 text-text-primary">{row.month}</td>
                <td className="py-2 pr-4 tabular-nums text-text-primary">
                  {row.total.toLocaleString()}
                </td>
                <td className="py-2 tabular-nums text-text-primary">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
