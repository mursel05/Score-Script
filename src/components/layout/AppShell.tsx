"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  PenLine,
  ScrollText,
  LogOut,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/essays/new", label: "New Essay", icon: PenLine },
  { href: "/essays", label: "History", icon: ScrollText },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-stone-200 fixed top-0 left-0 h-full z-20">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-700 rounded-lg flex items-center justify-center">
              <PenLine className="w-3.5 h-3.5 text-white" strokeWidth={2} />
            </div>
            <span className="font-serif text-lg text-stone-800">ScoreScript</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                  active
                    ? "bg-orange-50 text-orange-800"
                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={active ? 2 : 1.5} />
                {label}
                {active && (
                  <ChevronRight className="w-3 h-3 ml-auto text-orange-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-stone-100">
          {session?.user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-7 h-7 rounded-full"
                />
              ) : (
                <div className="w-7 h-7 bg-stone-200 rounded-full flex items-center justify-center text-xs font-medium text-stone-600">
                  {session.user.name?.[0] || "U"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-stone-800 truncate">
                  {session.user.name || "User"}
                </p>
                <p className="text-xs text-stone-400 truncate">
                  {session.user.email}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-stone-400 hover:text-stone-600 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-700 rounded-md flex items-center justify-center">
            <PenLine className="w-3 h-3 text-white" strokeWidth={2} />
          </div>
          <span className="font-serif text-base text-stone-800">ScoreScript</span>
        </div>
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`p-2 rounded-lg transition-colors ${
                  active ? "text-orange-700 bg-orange-50" : "text-stone-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0">{children}</main>
    </div>
  );
}
