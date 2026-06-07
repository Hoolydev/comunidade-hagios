import { NextRequest, NextResponse } from "next/server";
import {
  buildApprovalMessage,
  createAssistantDraft,
  getApprovalUrl,
  markDraftWhatsappSent,
} from "@/lib/assistant/content-approval";
import { sendUazapiTextMessage } from "@/lib/whatsapp/uazapi";

export const dynamic = "force-dynamic";

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
    const draft = await createAssistantDraft({
      title: body.title,
      subtitle: body.subtitle,
      body: body.body || body.text || body.summary,
      category: body.category,
      tags: body.tags,
      source_name: body.source_name,
      source_url: body.source_url,
    });

    const approvalUrl = getApprovalUrl(draft.review_token);
    const message = buildApprovalMessage({
      draft,
      approvalUrl,
      approverName: process.env.WHATSAPP_APPROVER_NAME,
    });
    const whatsapp = await sendUazapiTextMessage(message);

    if (whatsapp.ok && process.env.WHATSAPP_APPROVER_PHONE) {
      await markDraftWhatsappSent(draft.id, process.env.WHATSAPP_APPROVER_PHONE);
    }

    return NextResponse.json({
      draft_id: draft.id,
      status: draft.status,
      approval_url: approvalUrl,
      whatsapp,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar rascunho." },
      { status: 400 },
    );
  }
}
