import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { EssaysListContent } from "@/components/essays/EssaysListContent";

export default async function EssaysPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <AppShell>
      <EssaysListContent />
    </AppShell>
  );
}
