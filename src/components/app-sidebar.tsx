"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Settings,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: UploadCloud },
  { href: "/summaries", label: "Summaries", icon: FileText },
  { href: "/quizzes", label: "Quizzes", icon: Sparkles },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/chat", label: "Note Chat", icon: MessageSquareText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "min-h-screen w-72 shrink-0 border-r border-white/10 bg-sidebar/80 p-4 backdrop-blur",
        !mobile && "hidden xl:block",
      )}
    >
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 rounded-xl px-2 py-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <BrainCircuit className="size-6" />
        </span>
        <span>
          <span className="block text-lg font-semibold">EduGenie AI</span>
          <span className="text-xs text-muted-foreground">Free-tier study copilot</span>
        </span>
      </Link>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active && "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={logout} className="mt-8">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
          <LogOut className="size-4" />
          Log out
        </Button>
      </form>
    </aside>
  );
}
