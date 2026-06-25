"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";

interface BandTrendChartProps {
  data: { date: string; band: number }[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const band = payload[0].value;

  const getColor = (b: number) =>
    b >= 8
      ? "#22c55e"
      : b >= 7
        ? "#84cc16"
        : b >= 6
          ? "#eab308"
          : b >= 5
            ? "#f97316"
            : "#ef4444";

  return (
    <div className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-stone-400 mb-1">{label}</p>
      <p className="text-sm font-bold" style={{ color: getColor(band) }}>
        Band {band.toFixed(1)}
      </p>
    </div>
  );
}

export function BandTrendChart({ data }: BandTrendChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-stone-400 text-sm">
        Hələki məlumat yoxdur. İrəliləməni görmək üçün essenizi göndərin.
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: format(new Date(d.date), "MMM d"),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={formatted} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#a8a29e" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 5]}
          ticks={[0, 1, 2, 3, 4, 5]}
          tick={{ fontSize: 11, fill: "#a8a29e" }}
          tickLine={false}
          axisLine={false}
        />
        <ReferenceLine y={6} stroke="#e7e5e4" strokeDasharray="4 4" />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="band"
          stroke="#c2410c"
          strokeWidth={2}
          dot={{ fill: "#c2410c", r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#c2410c" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
