import { InternalShell } from "@/components/community/internal-shell";
import { requireActiveAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireActiveAccess();

  return <InternalShell isAdmin={profile.role === "admin"}>{children}</InternalShell>;
}
