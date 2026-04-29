import { AppShell } from "@/components/layout/app-shell";
import { OnboardingGuard } from "@/components/auth/onboarding-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingGuard>
      <AppShell>{children}</AppShell>
    </OnboardingGuard>
  );
}
