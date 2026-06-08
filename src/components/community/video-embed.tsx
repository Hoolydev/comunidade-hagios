"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lite YouTube facade: renders the real thumbnail with a play overlay and only
 * mounts the (heavy) iframe player after the first click. Keeps pages fast while
 * still showing real video where there should be video.
 */
export function VideoEmbed({
  videoId,
  title,
  thumbnail,
  vertical = false,
  className,
}: {
  videoId: string;
  title: string;
  thumbnail?: string | null;
  vertical?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const poster =
    thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const aspect = vertical
    ? "aspect-[9/16] mx-auto max-h-[76svh]"
    : "aspect-video";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-black",
        aspect,
        className,
      )}
    >
      {active ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Reproduzir vídeo: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          <Image
            src={poster}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 480px"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/15 to-transparent" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-navy-deep/70 backdrop-blur transition group-hover:scale-110 group-hover:border-gold">
              <PlayCircle className="h-9 w-9 text-gold-strong" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
