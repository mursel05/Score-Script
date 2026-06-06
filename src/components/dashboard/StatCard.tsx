import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  color?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  subtext,
  color = "#c2410c",
}: StatCardProps) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">
          {label}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}12` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color }} strokeWidth={1.5} />
        </div>
      </div>
      <p className="text-2xl font-bold text-stone-900">{value}</p>
      {subtext && <p className="text-xs text-stone-400 mt-1">{subtext}</p>}
    </div>
  );
}
