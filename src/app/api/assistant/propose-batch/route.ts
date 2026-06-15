import { NextRequest, NextResponse } from "next/server";
import {
  type AssistantDraftInput,
  buildBatchApprovalMessage,
  createAssistantDrafts,
  markDraftsWhatsappSent,
} from "@/lib/assistant/content-approval";
import { sendUazapiTextMessage } from "@/lib/whatsapp/uazapi";

export const dynamic = "force-dynamic";

type BatchProposalItem = Partial<AssistantDraftInput> & {
  text?: string;
  summary?: string;
};

function isAuthorized(request: NextRequest) {
  const secret = process.env.ASSISTANT_API_SECRET;
  if (!secret) return false;

  const authorization = request.headers.get("authorization") || "";
  const headerSecret = request.headers.get("x-assistant-secret") || "";

  return authorization === `Bearer ${secret}` || headerSecret === secret;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Não autorizado. Configure e envie ASSISTANT_API_SECRET." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const items: BatchProposalItem[] = Array.isArray(body.items) ? body.items : [];

    const drafts = await createAssistantDrafts(
      items.map((item) => ({
        title: String(item.title || ""),
        subtitle: item.subtitle,
        body: String(item.body || item.text || item.summary || ""),
        category: item.category,
        tags: item.tags,
        source_name: item.source_name,
        source_url: item.source_url,
      })),
    );

    const message = buildBatchApprovalMessage({
      drafts,
      approverName: process.env.WHATSAPP_APPROVER_NAME,
    });
    const whatsapp = await sendUazapiTextMessage(message);

    if (whatsapp.ok && process.env.WHATSAPP_APPROVER_PHONE) {
      await markDraftsWhatsappSent(
        drafts.map((draft) => draft.id),
        process.env.WHATSAPP_APPROVER_PHONE,
      );
    }

    return NextResponse.json({
      count: drafts.length,
      draft_ids: drafts.map((draft) => draft.id),
      status: "pending",
      whatsapp,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar lote de rascunhos." },
      { status: 400 },
    );
  }
}
