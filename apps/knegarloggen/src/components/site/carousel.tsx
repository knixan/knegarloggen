"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import EmblaCarousel from "embla-carousel";
import type { EmblaCarouselType } from "embla-carousel";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const images = [
  { src: "/carousel/carousel-1.png", alt: "Knegarloggen app" },
  { src: "/carousel/carousel-2.png", alt: "Knegarloggen app" },
  { src: "/carousel/carousel-3.png", alt: "Knegarloggen app" },
  { src: "/carousel/carousel-4.png", alt: "Knegarloggen app" },
  { src: "/carousel/carousel-5.png", alt: "Knegarloggen app" },
];

function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Stäng"
        className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ height: "85vh", width: "calc(85vh * 879 / 1178)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={879}
          height={1178}
          className="w-full h-full object-contain"
          priority
        />
      </div>
    </div>
  );
}

export default function AppCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const emblaRef = useRef<EmblaCarouselType | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const onSelect = useCallback(() => {
    const embla = emblaRef.current;
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setCanScrollPrev(embla.canScrollPrev());
    setCanScrollNext(embla.canScrollNext());
  }, []);

  useEffect(() => {
    if (!viewportRef.current) return;

    const embla = EmblaCarousel(viewportRef.current, {
      align: "center",
      containScroll: "trimSnaps",
      dragFree: false,
    });

    emblaRef.current = embla;
    embla.on("select", onSelect);
    embla.on("init", onSelect);
    onSelect();

    return () => embla.destroy();
  }, [onSelect]);

  const scrollPrev = useCallback(() => emblaRef.current?.scrollPrev(), []);
  const scrollNext = useCallback(() => emblaRef.current?.scrollNext(), []);
  const scrollTo = useCallback(
    (index: number) => emblaRef.current?.scrollTo(index),
    [],
  );

  return (
    <>
      <div className="relative w-full select-none">
        {/* Viewport */}
        <div ref={viewportRef} className="overflow-hidden">
          <div className="flex gap-6 px-4">
            {images.map((img, i) => (
              <div key={i} className="flex-[0_0_320px] sm:flex-[0_0_380px]">
                <button
                  className="relative w-full overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 aspect-879/1178 cursor-zoom-in group"
                  onClick={() => setLightbox(img)}
                  aria-label={`Öppna ${img.alt}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 320px, 380px"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next */}
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Föregående"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md transition hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Nästa"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md transition hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Bild ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "w-6 bg-gray-800 dark:bg-white"
                  : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
