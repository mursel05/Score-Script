import { PenLine } from "lucide-react";
import Link from "next/link";

export default function BlockedPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-orange-700 rounded-lg flex items-center justify-center">
              <PenLine className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="font-serif text-xl text-stone-800">ScoreScript</span>
          </div>

          <h1 className="text-xl font-semibold text-stone-900 mb-1 text-center">
            Hesabınız bloklanıb
          </h1>

          <div className="flex justify-center w-full mt-4">
            <Link
              href="/"
              className="cursor-pointer flex items-center justify-center gap-3 bg-stone-900 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Ana səhifəyə qayıt
            </Link>
          </div>

          <p className="text-xs text-stone-400 text-center mt-6 leading-relaxed">
            Ətraflı məlumat üçün dəstək komandamızla{" "}
            <Link href="/#contact" className="text-blue-500 hover:underline">
              əlaqə
            </Link>{" "}
            saxlayın.
          </p>
        </div>
      </div>
    </div>
  );
}
