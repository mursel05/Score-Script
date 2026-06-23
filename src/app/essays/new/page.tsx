import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/src/components/layout/AppShell";
import { EssayForm } from "@/src/components/essays/EssayForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function NewEssayPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </Link>

        <div className="fade-up mb-7">
          <h1 className="font-serif text-3xl text-stone-900 mb-2">New Essay</h1>
          <p className="text-sm text-stone-500">
            Paste your essay below. Up to 500 words. Our AI will evaluate it and return a
            band score.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 fade-up fade-up-delay-1">
          <EssayForm />
        </div>

        <p className="text-xs text-stone-400 text-center mt-5">
          Essays are evaluated by Google Gemini against professional criteria. Results
          typically take 5–15 seconds.
        </p>
      </div>
    </AppShell>
  );
}
