import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/src/components/layout/AppShell";
import { EssaysListContent } from "@/src/components/essays/EssaysListContent";

export default async function EssaysPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <AppShell>
      <EssaysListContent />
    </AppShell>
  );
}
