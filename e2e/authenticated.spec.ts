import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env.local");

  try {
    const contents = readFileSync(envPath, "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    }
  } catch {
    // Optional for CI environments that inject env vars directly.
  }
}

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

function getAdminClient(): SupabaseClient | null {
  loadEnvFile();
  const url = getSupabaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function inputWithValue(page: Page, value: string) {
  return page.locator(`input[value="${value}"]`);
}

test.describe("Authenticated community and admin flow", () => {
  test("admin can enter the community and register a training lesson with resources", async ({
    page,
  }, testInfo) => {
    test.setTimeout(60_000);
    test.skip(testInfo.project.name !== "desktop", "Run authenticated CRUD once.");

    const supabase = getAdminClient();
    test.skip(!supabase, "Supabase service role is required for authenticated E2E.");

    const id = randomUUID().slice(0, 8);
    const email = `hagios-e2e-${id}@example.com`;
    const password = `Hagios-${id}-Teste!`;
    const courseTitle = `Treinamento E2E ${id}`;
    const lessonTitle = `Aula vertical E2E ${id}`;
    const materialTitle = `Checklist E2E ${id}`;
    const slug = `treinamento-e2e-${id}`;
    let userId: string | undefined;

    try {
      const createdUser = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      expect(createdUser.error).toBeNull();
      userId = createdUser.data.user?.id;
      expect(userId).toBeTruthy();

      await supabase.from("profiles").upsert(
        {
          user_id: userId,
          email,
          name: "Admin E2E",
          role: "admin",
          subscription_status: "active",
        },
        { onConflict: "user_id" },
      );

      await page.goto("/login");
      await page.getByLabel("E-mail").fill(email);
      await page.getByLabel("Senha").fill(password);
      await page.getByRole("button", { name: "Entrar como assinante" }).click();
      await expect(page).toHaveURL(/\/comunidade/, { timeout: 15_000 });
      await expect(page.getByRole("heading", { name: /Olá, Admin/ })).toBeVisible();

      await page.goto("/admin");
      await expect(page.getByRole("heading", { name: "Painel administrativo" })).toBeVisible();

      await page.goto("/admin/trilhas");
      const courseForm = page.getByTestId("create-course-form");
      await courseForm.getByLabel("Nome").fill(courseTitle);
      await courseForm.getByLabel("Slug automático ou customizado").fill(slug);
      await courseForm.getByLabel("Descrição").fill("Curso temporário criado pelo teste E2E.");
      await courseForm.getByLabel("Categoria").selectOption("Marketing com IA");
      await courseForm.getByRole("button", { name: "Criar trilha" }).click();
      await expect(inputWithValue(page, courseTitle)).toBeVisible();

      await page.goto("/admin/aulas");
      const lessonForm = page.getByTestId("create-lesson-form");
      await lessonForm.getByLabel("Trilha relacionada").selectOption({ label: courseTitle });
      await lessonForm.getByLabel("Título").fill(lessonTitle);
      await lessonForm.getByLabel("Descrição").fill("Aula temporária com vídeo vertical.");
      await lessonForm
        .getByLabel("Link do YouTube ou ID")
        .fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      await lessonForm.getByLabel("Formato do vídeo").selectOption("vertical");
      await lessonForm.getByRole("button", { name: "Criar aula" }).click();
      await expect(page.getByText(lessonTitle)).toBeVisible();

      await page.goto("/admin/materiais");
      const materialForm = page.getByTestId("create-material-form");
      await materialForm.getByLabel("Trilha relacionada").selectOption({ label: courseTitle });
      await materialForm.getByLabel("Aula relacionada").selectOption({ label: lessonTitle });
      await materialForm.getByLabel("Título").fill(materialTitle);
      await materialForm
        .getByLabel("Descrição")
        .fill("Material temporário criado pelo teste E2E.");
      await materialForm.getByLabel("Link externo").fill("https://example.com/checklist.pdf");
      await materialForm.getByLabel("Categoria").selectOption("Marketing com IA");
      await materialForm.getByRole("button", { name: "Criar material" }).click();
      await expect(inputWithValue(page, materialTitle)).toBeVisible();

      const videoFormatCheck = await supabase
        .from("lessons")
        .select("video_format")
        .eq("title", lessonTitle)
        .maybeSingle();
      const supportsVideoFormat = !videoFormatCheck.error;

      await page.goto(`/comunidade/cursos/${slug}`);
      await expect(page.getByRole("heading", { name: courseTitle })).toBeVisible();
      await expect(
        page.getByText(
          supportsVideoFormat
            ? "Formato vertical 9:16 definido no painel admin."
            : "Formato desktop 16:9 definido no painel admin.",
        ),
      ).toBeVisible();
      await expect(page.getByText(materialTitle)).toBeVisible();

      await page.goto("/comunidade/whatsapp");
      await expect(page.getByRole("link", { name: "Entrar no grupo" })).toHaveAttribute(
        "href",
        "https://chat.whatsapp.com/LrjCUbrxG3HAcqQKbn2Ejv",
      );
    } finally {
      await supabase.from("materials").delete().eq("title", materialTitle);
      await supabase.from("lessons").delete().eq("title", lessonTitle);
      await supabase.from("courses").delete().eq("slug", slug);
      if (userId) {
        await supabase.from("profiles").delete().eq("user_id", userId);
        await supabase.auth.admin.deleteUser(userId);
      }
    }
  });
});
