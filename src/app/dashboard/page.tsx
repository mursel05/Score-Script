import { DashboardContent } from "@/src/components/dashboard/DashboardContent";
import { AppShell } from "@/src/components/layout/AppShell";
import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
