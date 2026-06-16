import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMovementPostBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function MovementPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getMovementPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="grid gap-6">
      <Link
        href="/movimento/conteudos-recentes"
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Conteúdos Recentes
      </Link>

      <Card className="overflow-hidden">
        <header className="border-b border-line bg-[linear-gradient(135deg,rgba(255,201,40,0.14),rgba(255,255,255,0.04))] p-5 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge>{post.category}</Badge>
            <Badge tone="neutral">{formatDate(post.published_at || post.created_at)}</Badge>
          </div>
          <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
            {post.title}
          </h1>
          {post.subtitle ? (
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">{post.subtitle}</p>
          ) : null}
        </header>

        <article className="grid gap-6 p-5 sm:p-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-strong"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="max-w-3xl whitespace-pre-wrap text-base leading-8 text-muted">
            {post.body}
          </div>

          {post.source_url ? (
            <div className="border-t border-line pt-5">
              <ButtonLink href={post.source_url}>
                Ver fonte original
                <ExternalLink className="h-4 w-4" />
              </ButtonLink>
            </div>
          ) : null}
        </article>
      </Card>
    </div>
  );
}
