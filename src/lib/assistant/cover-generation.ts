import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

type CoverInput = {
  title: string;
  summary: string;
  category: string;
};

type GeminiPart = {
  text?: string;
  inlineData?: {
    mimeType?: string;
    data?: string;
  };
  inline_data?: {
    mime_type?: string;
    data?: string;
  };
};

function buildCoverPrompt({ title, summary, category }: CoverInput) {
  return [
    "Crie uma capa editorial premium para o Movimento Hágios.",
    "Formato obrigatório: 16:9, 1280x720, composição limpa, segura para cards responsivos.",
    "Estética: fundo azul-marinho/grafite, detalhes dourados sofisticados, visual moderno de negócios com IA.",
    "Tema: empresário aplicando inteligência artificial em processos reais da empresa.",
    "Não use textos pequenos, não use logotipos, não use marcas reais, não use interface poluída.",
    "A imagem deve funcionar como thumbnail de conteúdo dentro de um movimento empresarial premium.",
    `Categoria: ${category}.`,
    `Título de contexto: ${title}.`,
    `Resumo visual: ${summary}.`,
  ].join(" ");
}

async function ensureCoverBucket(bucket: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  await supabase.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: 3 * 1024 * 1024,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
  });

  return supabase;
}

async function uploadCoverImage({
  base64,
  mimeType,
  title,
}: {
  base64: string;
  mimeType: string;
  title: string;
}) {
  const bucket = process.env.ASSISTANT_COVER_BUCKET || "assistant-covers";
  const supabase = await ensureCoverBucket(bucket);
  if (!supabase) return null;

  const extension = mimeType.includes("jpeg") ? "jpg" : mimeType.includes("webp") ? "webp" : "png";
  const path = `${new Date().toISOString().slice(0, 10)}/${slugify(title).slice(0, 72)}-${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(base64, "base64");

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: mimeType,
    upsert: true,
  });

  if (error) return null;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function generateAssistantCover(input: CoverInput) {
  const apiKey = process.env.NANO_BANANA_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.NANO_BANANA_MODEL || "gemini-3.1-flash-image";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildCoverPrompt(input) }],
          },
        ],
      }),
    },
  );

  if (!response.ok) return null;

  const data = await response.json();
  const parts = (data?.candidates?.[0]?.content?.parts || []) as GeminiPart[];
  const imagePart = parts.find((part) => part.inlineData?.data || part.inline_data?.data);
  const base64 = imagePart?.inlineData?.data || imagePart?.inline_data?.data;
  const mimeType = imagePart?.inlineData?.mimeType || imagePart?.inline_data?.mime_type || "image/png";

  if (!base64) return null;

  return uploadCoverImage({
    base64,
    mimeType,
    title: input.title,
  });
}
