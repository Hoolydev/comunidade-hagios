// Popula vídeos de teste nas trilhas que ainda não têm aulas.
// Uso: node scripts/seed-demo-lessons.mjs
// Aditivo e idempotente: pula trilhas que já têm aulas.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const demos = [
  { title: "Aula 1 — Visão geral", url: "https://www.youtube.com/watch?v=M7lc1UVf-VE", vid: "M7lc1UVf-VE" },
  { title: "Aula 2 — Na prática", url: "https://www.youtube.com/watch?v=jNQXAC9IVRw", vid: "jNQXAC9IVRw" },
  { title: "Aula 3 — Próximos passos", url: "https://www.youtube.com/watch?v=ysz5S6PUM-U", vid: "ysz5S6PUM-U" },
];

const { data: courses, error: ce } = await supabase.from("courses").select("id, title");
if (ce) {
  console.error("Erro ao ler trilhas:", ce.message);
  process.exit(1);
}
if (!courses?.length) {
  console.log("Nenhuma trilha encontrada. Crie trilhas primeiro no /admin/trilhas.");
  process.exit(0);
}

const { data: lessons } = await supabase.from("lessons").select("course_id");
const withLessons = new Set((lessons || []).map((l) => l.course_id));

let inserted = 0;
for (const course of courses) {
  if (withLessons.has(course.id)) {
    console.log(`• pulando "${course.title}" (já tem aulas)`);
    continue;
  }
  const rows = demos.map((demo, i) => ({
    course_id: course.id,
    title: demo.title,
    description: "Vídeo de demonstração para visualizar a comunidade.",
    youtube_url: demo.url,
    youtube_video_id: demo.vid,
    order_index: i + 1,
    is_published: true,
  }));
  const { error } = await supabase.from("lessons").insert(rows);
  if (error) {
    console.error(`✗ erro em "${course.title}":`, error.message);
  } else {
    inserted += rows.length;
    console.log(`✓ +${rows.length} aulas em "${course.title}"`);
  }
}

console.log(`\nTotal inserido: ${inserted} aula(s).`);
