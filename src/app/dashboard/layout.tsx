import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/study-data";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <DashboardShell>{children}</DashboardShell>;
}
