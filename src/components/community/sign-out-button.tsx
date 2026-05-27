"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function signOut() {
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted transition hover:bg-white/8 hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </button>
  );
}
