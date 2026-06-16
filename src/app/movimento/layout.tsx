import { InternalShell } from "@/components/movement/internal-shell";
import { requireActiveAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MovementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireActiveAccess();

  return <InternalShell isAdmin={profile.role === "admin"}>{children}</InternalShell>;
}
