import { AppShell } from "@/components/layout/app-shell";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgSlug: string };
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/login");
  }

  // Verifica se o usuário tem acesso a esta organização específica no Clerk
  const memberships = await (await clerkClient()).users.getOrganizationMembershipList({ userId });
  const hasAccess = memberships.data.some(m => m.organization.slug === params.orgSlug);

  if (!hasAccess) {
    // Se não tiver acesso, redireciona para a seleção de org ou home
    redirect("/dashboard");
  }

  return (
    <AppShell orgSlug={params.orgSlug}>
      {children}
    </AppShell>
  );
}
