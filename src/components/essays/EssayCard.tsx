import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileText, Clock, Hash } from "lucide-react";
import { EssayWithEvaluation, getBandColor, getBandLabel } from "@/src/types";

interface EssayCardProps {
  essay: EssayWithEvaluation;
}

export function EssayCard({ essay }: EssayCardProps) {
  const band = essay.evaluation?.overallBand;
  const color = band != null ? getBandColor(band) : "#a8a29e";
  const label = band != null ? getBandLabel(band) : "Gözlənir";

  return (
    <Link href={`/essays/${essay.id}`}>
      <div className="group bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-300 hover:shadow-sm transition-all cursor-pointer">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-stone-900 sm:truncate max-sm:line-clamp-1 mb-1 group-hover:text-orange-800 transition-colors">
              {essay.title}
            </h3>
            <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
              {essay.content.substring(0, 300)}
            </p>
          </div>

          <div className="shrink-0 text-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: `${color}15`, color }}
            >
              {band != null ? band.toFixed(1) : "—"}
            </div>
            <p className="text-xs mt-1" style={{ color }}>
              {label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {essay.wordCount} söz
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(essay.createdAt), { addSuffix: true })}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {band != null ? "Qiymətləndirildi" : "Gözlənir"}
          </span>
        </div>
      </div>
    </Link>
  );
}
