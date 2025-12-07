// src/data/previews.ts
export type StaticPreview = {
  id: number;
  title: string;
  duration: number;
  tags: string[];
  poster?: string;   // thumb SFW (jpg)
  videoUrl: string; // mp4 do teaser
  isSensitive?: boolean;
};

export const STATIC_PREVIEWS: StaticPreview[] = [];
