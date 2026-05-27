const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export function getYouTubeVideoId(input?: string | null) {
  if (!input) return "";
  const value = input.trim();

  if (YOUTUBE_ID_PATTERN.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "").slice(0, 11);
    }

    if (url.searchParams.get("v")) {
      return url.searchParams.get("v")?.slice(0, 11) || "";
    }

    const embedMatch = url.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
    if (embedMatch?.[2]) {
      return embedMatch[2].slice(0, 11);
    }
  } catch {
    return "";
  }

  return "";
}

export function getYouTubeEmbedUrl(input?: string | null) {
  const videoId = getYouTubeVideoId(input);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

export function getYouTubeThumbnail(videoId?: string | null) {
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "/window.svg";
}
