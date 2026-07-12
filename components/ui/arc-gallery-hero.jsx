"use client";

import { useEffect, useState } from "react";

/**
 * ArcGalleryHero — hero section with photo cards fanned along an arc.
 *
 * Props:
 * - images:      string[] — image srcs placed along the arc
 * - startAngle / endAngle: arc span in degrees (0° = right, 90° = top)
 * - radiusLg/Md/Sm:   arc radius per breakpoint
 * - cardSizeLg/Md/Sm: card size per breakpoint
 * - children:    hero content rendered below/inside the arc (heading, CTAs…)
 * - background:  optional node rendered full-bleed behind the arc (e.g. an
 *                animated canvas background)
 * - className:   extra classes on the outer section
 */
export function ArcGalleryHero({
  images,
  startAngle = 20,
  endAngle = 160,
  radiusLg = 480,
  radiusMd = 360,
  radiusSm = 260,
  cardSizeLg = 120,
  cardSizeMd = 100,
  cardSizeSm = 80,
  className = "",
  background = null,
  children,
}) {
  const [dimensions, setDimensions] = useState({
    radius: radiusLg,
    cardSize: cardSizeLg,
    visible: images.length,
  });

  // Keep the arc geometry in sync with the viewport width. The radius is
  // capped so the outermost cards (at startAngle) always stay on screen,
  // and small screens show fewer cards so they don't pile up on the
  // tighter arc.
  useEffect(() => {
    const maxCos = Math.abs(Math.cos((startAngle * Math.PI) / 180));

    const fitRadius = (maxRadius, cardSize, gutter) => {
      const available = window.innerWidth / 2 - cardSize / 2 - gutter;
      return Math.round(Math.min(maxRadius, available / maxCos));
    };

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({
          radius: fitRadius(radiusSm, cardSizeSm, 10),
          cardSize: cardSizeSm,
          visible: Math.min(images.length, 7),
        });
      } else if (width < 1024) {
        setDimensions({
          radius: fitRadius(radiusMd, cardSizeMd, 16),
          cardSize: cardSizeMd,
          visible: Math.min(images.length, 9),
        });
      } else {
        setDimensions({
          radius: fitRadius(radiusLg, cardSizeLg, 24),
          cardSize: cardSizeLg,
          visible: images.length,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [
    radiusLg,
    radiusMd,
    radiusSm,
    cardSizeLg,
    cardSizeMd,
    cardSizeSm,
    startAngle,
    images.length,
  ]);

  const visibleImages = images.slice(0, dimensions.visible);

  // At least 2 points so the angle step is well-defined
  const count = Math.max(visibleImages.length, 2);
  const step = (endAngle - startAngle) / (count - 1);

  return (
    <section
      className={`relative isolate flex min-h-[100svh] flex-col overflow-hidden ${className}`}
    >
      {background && (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          {background}
        </div>
      )}

      {/* Arc geometry container */}
      <div
        className="relative z-10 mx-auto w-full"
        style={{ height: dimensions.radius * 1.2 }}
      >
        {/* Bottom-center pivot every card is positioned around */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          {visibleImages.map((src, i) => {
            const angle = startAngle + step * i;
            const angleRad = (angle * Math.PI) / 180;
            // Round to whole pixels — full-precision floats get normalized by
            // the browser and trigger SSR hydration mismatches
            const x = Math.round(Math.cos(angleRad) * dimensions.radius);
            const y = Math.round(Math.sin(angleRad) * dimensions.radius);

            return (
              <div
                key={i}
                className="arc-card absolute opacity-0"
                style={{
                  width: dimensions.cardSize,
                  height: dimensions.cardSize,
                  left: `calc(50% + ${x}px)`,
                  bottom: `${y}px`,
                  transform: "translate(-50%, 50%)",
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: "forwards",
                  zIndex: count - i,
                }}
              >
                <div
                  className="h-full w-full overflow-hidden rounded-2xl bg-white shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200 transition-transform duration-300 hover:scale-105"
                  style={{ transform: `rotate(${angle / 4}deg)` }}
                >
                  <img
                    src={src}
                    alt={`Event memory ${i + 1}`}
                    className="block h-full w-full object-cover"
                    draggable={false}
                    onError={(e) => {
                      e.target.src = `https://placehold.co/400x400/e4e4e7/52525b?text=Memory`;
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero content pulled up into the arc opening — the overlap scales
          with the radius so every screen size keeps the same proportions */}
      <div
        className="relative z-10 flex flex-1 items-center justify-center px-4 pb-14 sm:px-6 sm:pb-16"
        style={{ marginTop: -Math.round(dimensions.radius * 0.55) }}
      >
        <div
          className="arc-content max-w-2xl px-2 text-center opacity-0 sm:px-6"
          style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes arc-fade-in-up {
          from {
            opacity: 0;
            transform: translate(-50%, 60%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 50%);
          }
        }
        @keyframes arc-fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .arc-card {
          animation: arc-fade-in-up 0.8s ease-out;
        }
        .arc-content {
          animation: arc-fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}

export default ArcGalleryHero;
