import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { Course } from "@/lib/types";

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-line bg-panel shadow-[0_18px_70px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-gold/45">
      <div className="relative aspect-[16/9] bg-white/5">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <BookOpen className="h-10 w-10 text-gold" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/20 to-transparent" />
      </div>
      <div className="p-5">
        <Badge>{course.category}</Badge>
        <h3 className="mt-4 text-lg font-bold">{course.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
          {course.description}
        </p>
        <ButtonLink
          href={`/comunidade/cursos/${course.slug}`}
          variant="secondary"
          className="mt-5 w-full justify-between"
        >
          Acessar
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </ButtonLink>
      </div>
    </article>
  );
}
