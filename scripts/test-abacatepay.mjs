// Teste seguro: cria uma URL de checkout de assinatura (NÃO cobra ninguém).
// Uso: node scripts/test-abacatepay.mjs
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const key = env.ABACATEPAY_API_KEY;
const productId = env.ABACATEPAY_PRODUCT_ID;
const methods = (env.ABACATEPAY_METHODS || "PIX,CARD").split(",").map((m) => m.trim().toUpperCase());

console.log("Chave:", key ? `${key.slice(0, 12)}…` : "(ausente)");
console.log("Produto:", productId || "(ausente)");
console.log("Métodos:", methods.join(", "));
console.log("Criando checkout de assinatura (sem cobrança)...\n");

const res = await fetch("https://api.abacatepay.com/v2/subscriptions/create", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    items: [{ id: productId, quantity: 1 }],
    externalId: "teste-integracao",
    completionUrl: "http://localhost:3000/movimento?checkout=success",
    returnUrl: "http://localhost:3000/checkout?canceled=1",
    methods,
    metadata: { user_id: "teste-integracao" },
  }),
});

const json = await res.json().catch(() => null);
console.log("HTTP:", res.status);
console.log("Resposta:", JSON.stringify(json, null, 2));

if (json?.data?.url) {
  console.log("\n✅ FUNCIONANDO. URL de pagamento gerada:");
  console.log(json.data.url);
  console.log("\n(É essa página que abre pro cliente digitar cartão/PIX.)");
} else {
  console.log("\n❌ Não retornou URL. Veja o erro acima (chave, produto ou método).");
}
