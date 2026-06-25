import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/src/components/layout/AppShell";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ContactForm from "@/src/components/contact/ContactForm";

export default async function ContactPage() {
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
          Panel
        </Link>

        <div className="fade-up mb-7">
          <h1 className="font-serif text-3xl text-stone-900 mb-2">Əlaqə</h1>
          <p className="text-sm text-stone-500">
            Hər hansı sualınız, təklifiniz və ya rəyiniz varsa, aşağıdakı formdan istifadə
            edərək bizimlə əlaqə saxlaya bilərsiniz. Biz tezliklə sizə cavab verəcəyik.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 fade-up fade-up-delay-1">
          <ContactForm />
        </div>
      </div>
    </AppShell>
  );
}
