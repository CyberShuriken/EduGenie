import Link from "next/link";
import { Menu, UploadCloud } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="xl:hidden">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 border-white/10 bg-sidebar p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <AppSidebar mobile />
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-sm text-muted-foreground">Academic workspace</p>
              <h1 className="text-base font-semibold">Study faster on free-tier AI</h1>
            </div>
          </div>
          <Button asChild>
            <Link href="/upload" className="gap-2">
              <UploadCloud className="size-4" />
              Upload note
            </Link>
          </Button>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
