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
  imageButton?: string | null;
};

export type WhatsAppRecipient = {
  name?: string | null;
  phone: string;
};

function cleanPhone(value: string) {
  return value.replace(/\D/g, "");
}

export function hasUazapiEnv() {
  return Boolean(
    process.env.UAZAPI_SERVER_URL &&
      process.env.UAZAPI_INSTANCE_TOKEN &&
      getWhatsAppRecipients().length > 0,
  );
}

export function getWhatsAppRecipients(): WhatsAppRecipient[] {
  const configured = process.env.WHATSAPP_APPROVERS;

  if (configured) {
    return configured
      .split(",")
      .map((entry) => {
        const [name, phone] = entry.split("|").map((value) => value.trim());
        return { name: phone ? name : null, phone: phone || name };
      })
      .filter((recipient) => cleanPhone(recipient.phone));
  }

  if (process.env.WHATSAPP_APPROVER_PHONE) {
    return [
      {
        name: process.env.WHATSAPP_APPROVER_NAME || null,
        phone: process.env.WHATSAPP_APPROVER_PHONE,
      },
    ];
  }

  return [];
}

export async function sendUazapiTextMessage(
  message: string,
  recipient?: WhatsAppRecipient,
): Promise<UazapiSendResult> {
  return sendUazapiRequest({
    recipient,
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
  imageButton,
}: UazapiMenuInput, recipient?: WhatsAppRecipient): Promise<UazapiSendResult> {
  return sendUazapiRequest({
    recipient,
    path: process.env.UAZAPI_SEND_MENU_PATH || "/send/menu",
    payload: {
      type: "button",
      text,
      choices,
      footerText,
      imageButton: imageButton || undefined,
    },
    missingError: "Uazapi não configurada. Rascunho criado sem envio de menu por WhatsApp.",
  });
}

export async function sendUazapiMenuWithTextFallback(
  input: UazapiMenuInput,
  recipient?: WhatsAppRecipient,
) {
  const menu = await sendUazapiMenuMessage(input, recipient);
  if (menu.ok || menu.skipped) return menu;

  return sendUazapiTextMessage(input.text, recipient);
}

async function sendUazapiRequest({
  recipient,
  path,
  payload,
  missingError,
}: {
  recipient?: WhatsAppRecipient;
  path: string;
  payload: Record<string, unknown>;
  missingError: string;
}): Promise<UazapiSendResult> {
  const serverUrl = process.env.UAZAPI_SERVER_URL?.replace(/\/$/, "");
  const token = process.env.UAZAPI_INSTANCE_TOKEN;
  const to = recipient?.phone || process.env.WHATSAPP_APPROVER_PHONE;

  if (!serverUrl || !token || !to) {
    return {
      ok: false,
      skipped: true,
      error: missingError,
    };
  }

  const endpoint = `${serverUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const number = cleanPhone(to);

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
