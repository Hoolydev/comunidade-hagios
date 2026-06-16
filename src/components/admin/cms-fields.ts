import type { CrudField } from "@/components/admin/crud-section";

export const videoFormatOptions = [
  { label: "Horizontal 16:9 (desktop)", value: "desktop" },
  { label: "Vertical 9:16 (mobile)", value: "vertical" },
];

export const contentTypeOptions = [
  { label: "Vídeo do YouTube", value: "video" },
  { label: "Conteúdo escrito", value: "text" },
];

const priorityOptions = [
  { label: "Alta (destaque)", value: "high" },
  { label: "Média", value: "medium" },
  { label: "Baixa", value: "low" },
];

const eventTypeOptions = [
  { label: "Mentoria", value: "Mentoria" },
  { label: "Votação", value: "Votação" },
  { label: "Desafio", value: "Desafio" },
];

const toolCategoryOptions = [
  "Prompts",
  "Templates",
  "Checklists",
  "Planilhas",
  "Fluxogramas",
  "E-books",
  "Guias",
  "Ferramentas recomendadas",
  "Automações",
];

export const nextActionFields: CrudField[] = [
  { name: "title", label: "Título", type: "text", required: true, fullWidth: true },
  { name: "description", label: "Descrição", type: "textarea", fullWidth: true },
  { name: "href", label: "Link (rota interna)", type: "text", createDefault: "/movimento" },
  { name: "label", label: "Texto do botão", type: "text", createDefault: "Abrir" },
  { name: "priority", label: "Prioridade", type: "select", options: priorityOptions },
  { name: "order_index", label: "Ordem", type: "number", createDefault: "1" },
  { name: "is_published", label: "Publicado", type: "checkbox", defaultChecked: true },
];

export const eventFields: CrudField[] = [
  { name: "type", label: "Tipo", type: "select", options: eventTypeOptions },
  { name: "title", label: "Título", type: "text", required: true },
  { name: "description", label: "Descrição", type: "textarea", fullWidth: true },
  { name: "date", label: "Data e hora", type: "datetime", format: "datetime" },
  { name: "href", label: "Link", type: "text", createDefault: "/movimento" },
  { name: "is_published", label: "Publicado", type: "checkbox", defaultChecked: true },
];

export const mentorshipFields: CrudField[] = [
  { name: "title", label: "Título", type: "text", required: true, fullWidth: true },
  { name: "description", label: "Descrição", type: "textarea", fullWidth: true },
  { name: "teacher", label: "Responsável", type: "text", createDefault: "Time Hágios" },
  { name: "date", label: "Data e hora", type: "datetime", format: "datetime" },
  { name: "recording_url", label: "Link da gravação (YouTube)", type: "text", fullWidth: true },
  {
    name: "materials",
    label: "Materiais (um por linha)",
    type: "textarea",
    format: "lines",
    fullWidth: true,
    placeholder: "Roteiro de diagnóstico\nPlanilha de priorização",
  },
  { name: "related_challenge", label: "Desafio relacionado", type: "text", fullWidth: true },
  { name: "is_published", label: "Publicado", type: "checkbox", defaultChecked: true },
];

export const challengeFields: CrudField[] = [
  { name: "theme", label: "Tema", type: "text", required: true, fullWidth: true },
  { name: "description", label: "Descrição", type: "textarea", fullWidth: true },
  { name: "objective", label: "Objetivo", type: "textarea", fullWidth: true },
  { name: "material_url", label: "Link do material", type: "text" },
  { name: "expected_result", label: "Resultado esperado", type: "textarea", fullWidth: true },
  { name: "participants", label: "Participantes", type: "number", createDefault: "0" },
  { name: "completion_rate", label: "Taxa de conclusão (%)", type: "number", createDefault: "0" },
  {
    name: "days",
    label: "Dias (JSON)",
    type: "textarea",
    format: "json",
    fullWidth: true,
    rows: 6,
    placeholder: '[{"day":1,"title":"...","description":"...","completed":false}]',
  },
  {
    name: "ranking",
    label: "Ranking (JSON)",
    type: "textarea",
    format: "json",
    fullWidth: true,
    rows: 4,
    placeholder: '[{"name":"Ana P.","points":300}]',
  },
  { name: "is_published", label: "Publicado", type: "checkbox", defaultChecked: true },
];

export const toolFields: CrudField[] = [
  { name: "title", label: "Título", type: "text", required: true, fullWidth: true },
  { name: "description", label: "Descrição", type: "textarea", fullWidth: true },
  { name: "category", label: "Categoria", type: "select", options: toolCategoryOptions },
  { name: "url", label: "Link", type: "text", required: true },
  { name: "is_published", label: "Publicado", type: "checkbox", defaultChecked: true },
];

export const questionFields: CrudField[] = [
  { name: "question", label: "Pergunta", type: "text", required: true, fullWidth: true },
  { name: "answer", label: "Resposta", type: "textarea", fullWidth: true, rows: 5 },
  { name: "category", label: "Categoria", type: "text", createDefault: "Jornada" },
  { name: "author", label: "Autor", type: "text", createDefault: "Membro do Movimento" },
  { name: "answered_by", label: "Respondido por", type: "text", createDefault: "Time Hágios" },
  { name: "is_published", label: "Publicado", type: "checkbox", defaultChecked: true },
];
