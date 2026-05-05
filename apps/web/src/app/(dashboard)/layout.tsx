import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Proteção Server-Side: Impede a renderização de qualquer conteúdo se não estiver logado.
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
