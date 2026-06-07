export type UazapiSendResult = {
  ok: boolean;
  skipped: boolean;
  status?: number;
  data?: unknown;
  error?: string;
};

function cleanPhone(value: string) {
  return value.replace(/\D/g, "");
}

export function hasUazapiEnv() {
  return Boolean(
    process.env.UAZAPI_SERVER_URL &&
      process.env.UAZAPI_INSTANCE_TOKEN &&
      process.env.WHATSAPP_APPROVER_PHONE,
  );
}

export async function sendUazapiTextMessage(message: string): Promise<UazapiSendResult> {
  const serverUrl = process.env.UAZAPI_SERVER_URL?.replace(/\/$/, "");
  const token = process.env.UAZAPI_INSTANCE_TOKEN;
  const recipient = process.env.WHATSAPP_APPROVER_PHONE;

  if (!serverUrl || !token || !recipient) {
    return {
      ok: false,
      skipped: true,
      error: "Uazapi não configurada. Rascunho criado sem envio por WhatsApp.",
    };
  }

  const sendTextPath = process.env.UAZAPI_SEND_TEXT_PATH || "/send/text";
  const endpoint = `${serverUrl}${sendTextPath.startsWith("/") ? sendTextPath : `/${sendTextPath}`}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify({
      number: cleanPhone(recipient),
      phone: cleanPhone(recipient),
      to: cleanPhone(recipient),
      text: message,
      message,
    }),
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = await response.text().catch(() => null);
  }

  return {
    ok: response.ok,
    skipped: false,
    status: response.status,
    data,
    error: response.ok ? undefined : `Uazapi respondeu HTTP ${response.status}.`,
  };
}
