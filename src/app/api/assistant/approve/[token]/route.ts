import { NextRequest, NextResponse } from "next/server";
import { approveAssistantDraft, rejectAssistantDraft } from "@/lib/assistant/content-approval";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const formData = await request.formData();
  const decision = String(formData.get("decision") || "");

  try {
    if (decision === "approve") {
      await approveAssistantDraft(token);
      return NextResponse.redirect(
        new URL(`/assistente/aprovacao/${token}?status=approved`, request.url),
      );
    }

    if (decision === "reject") {
      await rejectAssistantDraft(token);
      return NextResponse.redirect(
        new URL(`/assistente/aprovacao/${token}?status=rejected`, request.url),
      );
    }

    return NextResponse.redirect(
      new URL(`/assistente/aprovacao/${token}?status=invalid`, request.url),
    );
  } catch (error) {
    const message = encodeURIComponent(
      error instanceof Error ? error.message : "Erro ao revisar rascunho.",
    );
    return NextResponse.redirect(
      new URL(`/assistente/aprovacao/${token}?status=error&message=${message}`, request.url),
    );
  }
}
