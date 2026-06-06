import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { EssayDetailContent } from "@/components/essays/EssayDetailContent";

export default async function EssayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  return (
    <AppShell>
      <EssayDetailContent essayId={id} />
    </AppShell>
  );
}
