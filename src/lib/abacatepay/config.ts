// Exibição/preço. O valor e o ciclo (MONTHLY) são definidos no PRODUTO criado
// no painel do AbacatePay; aqui é só para a UI e referência.
export const ABACATE_BILLING = {
  productName: "Movimento Hágios",
  priceLabel: "R$49,90",
  amountInCents: 4990,
  interval: "MONTHLY" as const,
};

export const ABACATE_API_BASE = "https://api.abacatepay.com";
