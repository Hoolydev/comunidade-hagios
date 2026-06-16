import { expect, test } from "@playwright/test";

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(hasOverflow).toBe(false);
}

test.describe("Movimento Hagios public flow", () => {
  test("landing page presents the offer and the simplified member flow", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Implemente IA em pelo menos 3 áreas/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Entrar no Movimento/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Já sou assinante/i }).first()).toBeVisible();
    await expect(page.getByText("R$49,90").first()).toBeVisible();

    await expectNoHorizontalOverflow(page);
  });

  test("signup CTA opens the stepped checkout", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Entrar no Movimento/i }).first().click();

    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByRole("heading", { name: /Seus dados/i })).toBeVisible();
  });

  test("checkout page is clear and keeps the monthly price", async ({ page }) => {
    await page.goto("/checkout");

    await expect(page.getByRole("heading", { name: /Acesso premium/i })).toBeVisible();
    await expect(page.getByText("R$49,90").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Finalizar agora/i })).toBeVisible();
    await expect(page.getByText(/PIX/i)).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  });

  test("protected movement pages redirect anonymous visitors to login", async ({ page }) => {
    await page.goto("/movimento");

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Entrar no Movimento" })).toBeVisible();
  });

  test("admin redirects anonymous visitors to login", async ({ page }) => {
    await page.goto("/admin");

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Entrar no Movimento" })).toBeVisible();
  });
});

test.describe("PWA and API guardrails", () => {
  test("serves a web app manifest with Hagios branding", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.ok()).toBe(true);

    const manifest = await response.json();
    expect(manifest.name).toContain("Movimento");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/movimento");
  });

  test("checkout API requires authentication", async ({ request }) => {
    const response = await request.post("/api/abacatepay/checkout");

    expect(response.status()).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringMatching(/login|comprar/i),
    });
  });

  test("assistant proposal API requires authorization", async ({ request }) => {
    const response = await request.post("/api/assistant/propose", {
      data: {
        title: "Teste de aprovação",
        body: "Conteúdo de teste",
      },
    });

    expect(response.status()).toBe(401);
  });
});

test.describe("Mobile responsive basics", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const path of ["/", "/login", "/checkout"]) {
    test(`${path} does not create page-level horizontal overflow`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalOverflow(page);
    });
  }
});
