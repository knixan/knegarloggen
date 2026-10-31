// component som visar bilderna för ett jobb i översikten och dialogen, med möjlighet att klicka på en bild för att se den i större format
"use client";

import Image from "next/image";
import { ImagePlus } from "lucide-react";
import type { Job } from "@/lib/job-schema";

export function JobOverviewImages({
  job,
  onSelectImage,
}: {
  job: Job;
  onSelectImage: (url: string) => void;
}) {
  if (!job.bilder || job.bilder.length === 0) return null;

  return (
    <section className="space-y-3">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <ImagePlus className="h-4 w-4" /> Bilder
      </h4>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {job.bilder.map((bild) => (
          <button
            key={bild.key}
            type="button"
            className="group relative aspect-square overflow-hidden rounded-md border"
            onClick={() => onSelectImage(bild.url)}
          >
            <Image
              src={bild.url}
              alt="Jobbild"
              fill
              sizes="(max-width: 640px) 50vw, 200px"
              className="object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
