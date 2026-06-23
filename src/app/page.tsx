import { redirect } from "next/navigation";
import { LandingHero } from "../components/layout/LandingHero";
import { auth } from "../lib/auth";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return <LandingHero />;
}
