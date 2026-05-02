"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useParams } from "next/navigation";

export default function OrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { orgSlug } = useParams();

  return (
    <AppShell orgSlug={orgSlug as string}>
      {children}
    </AppShell>
  );
}
