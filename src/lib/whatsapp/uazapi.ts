export type UazapiSendResult = {
  ok: boolean;
  skipped: boolean;
  status?: number;
  data?: unknown;
  error?: string;
};

type UazapiMenuInput = {
  text: string;
  choices: string[];
  footerText?: string;
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
  return sendUazapiRequest({
    path: process.env.UAZAPI_SEND_TEXT_PATH || "/send/text",
    payload: {
      text: message,
      message,
    },
    missingError: "Uazapi não configurada. Rascunho criado sem envio por WhatsApp.",
  });
}

export async function sendUazapiMenuMessage({
  text,
  choices,
  footerText,
}: UazapiMenuInput): Promise<UazapiSendResult> {
  return sendUazapiRequest({
    path: process.env.UAZAPI_SEND_MENU_PATH || "/send/menu",
    payload: {
      type: "button",
      text,
      choices,
      footerText,
    },
    missingError: "Uazapi não configurada. Rascunho criado sem envio de menu por WhatsApp.",
  });
}

export async function sendUazapiMenuWithTextFallback(input: UazapiMenuInput) {
  const menu = await sendUazapiMenuMessage(input);
  if (menu.ok || menu.skipped) return menu;

  return sendUazapiTextMessage(input.text);
}

async function sendUazapiRequest({
  path,
  payload,
  missingError,
}: {
  path: string;
  payload: Record<string, unknown>;
  missingError: string;
}): Promise<UazapiSendResult> {
  const serverUrl = process.env.UAZAPI_SERVER_URL?.replace(/\/$/, "");
  const token = process.env.UAZAPI_INSTANCE_TOKEN;
  const recipient = process.env.WHATSAPP_APPROVER_PHONE;

  if (!serverUrl || !token || !recipient) {
    return {
      ok: false,
      skipped: true,
      error: missingError,
    };
  }

  const endpoint = `${serverUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const number = cleanPhone(recipient);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify({
      number,
      phone: number,
      to: number,
      ...payload,
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
