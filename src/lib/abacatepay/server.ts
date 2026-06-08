import { ABACATE_API_BASE } from "@/lib/abacatepay/config";
import { hasAbacatePayEnv } from "@/lib/env";

type AbacateResponse<T> = {
  data: T | null;
  error: string | null;
  success?: boolean;
};

function getApiKey() {
  return process.env.ABACATEPAY_API_KEY || null;
}

function getMethods(): string[] {
  // PIX recorrente + cartão por padrão; ajustável via env (ex: "CARD").
  const raw = process.env.ABACATEPAY_METHODS || "PIX,CARD";
  return raw
    .split(",")
    .map((m) => m.trim().toUpperCase())
    .filter(Boolean);
}

async function abacateFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<AbacateResponse<T>> {
  const key = getApiKey();
  if (!key) return { data: null, error: "AbacatePay não configurado." };

  try {
    const response = await fetch(`${ABACATE_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });

    const json = (await response.json().catch(() => null)) as AbacateResponse<T> | null;

    if (!response.ok) {
      return {
        data: null,
        error: json?.error || `Erro AbacatePay (HTTP ${response.status}).`,
      };
    }

    return json || { data: null, error: "Resposta vazia do AbacatePay." };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Falha ao chamar o AbacatePay.",
    };
  }
}

export type SubscriptionCheckout = {
  id: string;
  url: string;
  status: string;
  externalId?: string;
};

/**
 * Cria um checkout de assinatura recorrente. O preço/ciclo vêm do produto
 * (productId) cadastrado no painel do AbacatePay. Retorna `data.url` para
 * redirecionar o usuário.
 */
export async function createSubscriptionCheckout(params: {
  productId: string;
  externalId: string;
  userId: string;
  completionUrl: string;
  returnUrl: string;
}): Promise<AbacateResponse<SubscriptionCheckout>> {
  if (!hasAbacatePayEnv()) {
    return { data: null, error: "AbacatePay não configurado." };
  }

  return abacateFetch<SubscriptionCheckout>("/v2/subscriptions/create", {
    method: "POST",
    body: JSON.stringify({
      items: [{ id: params.productId, quantity: 1 }],
      externalId: params.externalId,
      completionUrl: params.completionUrl,
      returnUrl: params.returnUrl,
      methods: getMethods(),
      metadata: { user_id: params.userId },
    }),
  });
}
