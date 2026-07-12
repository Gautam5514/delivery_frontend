"use client";

import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";

/**
 * WorldMap — dotted world map with animated arc connections.
 *
 * Props:
 * - dots: Array<{ start, end }> where each point is
 *   { lat, lng, label?, hideLabel? } — hideLabel keeps the hover tooltip
 *   but skips the static pill (for dense clusters like Indian capitals)
 * - lineColor:        stroke/dot color of the routes
 * - showLabels:       master switch for the static label pills
 * - labelClassName:   classes applied to each label pill
 * - animationDuration / loop: path drawing behaviour
 */
export function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
  showLabels = true,
  labelClassName = "text-sm",
  animationDuration = 2,
  loop = true,
}) {
  const svgRef = useRef(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const map = useMemo(
    () => new DottedMap({ height: 100, grid: "diagonal" }),
    []
  );

  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: "#00000040",
        shape: "circle",
        backgroundColor: "white",
      }),
    [map]
  );

  const projectPoint = (lat, lng) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (start, end) => {
    const midX = (start.x + end.x) / 2;
    // Arc height scales with distance so short domestic hops stay subtle
    const distance = Math.hypot(end.x - start.x, end.y - start.y);
    const arc = Math.min(50, Math.max(6, distance * 0.35));
    const midY = Math.min(start.y, end.y) - arc;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  // Unique endpoints — hub cities appear in many routes but should render
  // a single pulse/label, not one per route
  const uniquePoints = useMemo(() => {
    const seen = new Map();
    dots.forEach((dot) => {
      [dot.start, dot.end].forEach((point) => {
        const key = `${point.lat},${point.lng}`;
        if (!seen.has(key)) {
          seen.set(key, point);
        } else if (!seen.get(key).label && point.label) {
          seen.set(key, point);
        }
      });
    });
    return Array.from(seen.values());
  }, [dots]);

  // Animation timing
  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 2; // hold once every path is drawn
  const fullCycleDuration = totalAnimationTime + pauseTime;

  return (
    <div className="relative aspect-[1.6/1] w-full overflow-hidden rounded-2xl bg-white font-sans sm:aspect-[2/1]">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none h-full w-full select-none object-cover [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
        unoptimized
        priority
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="pointer-events-auto absolute inset-0 h-full w-full select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <filter id="glow">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const path = createCurvedPath(startPoint, endPoint);

          // Keyframe times for this path within the full cycle
          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime =
            (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={path}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={
                  loop
                    ? { pathLength: [0, 0, 1, 1, 0] }
                    : { pathLength: 1 }
                }
                transition={
                  loop
                    ? {
                        duration: fullCycleDuration,
                        times: [0, startTime, endTime, resetTime, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0,
                      }
                    : {
                        duration: animationDuration,
                        delay: i * staggerDelay,
                        ease: "easeInOut",
                      }
                }
              />

              {loop && (
                <motion.circle
                  r="2.5"
                  fill={lineColor}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: [null, "0%", "100%", "100%", "100%"],
                    opacity: [0, 0, 1, 0, 0],
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                  style={{ offsetPath: `path('${path}')` }}
                />
              )}
            </g>
          );
        })}

        {uniquePoints.map((point, i) => {
          const { x, y } = projectPoint(point.lat, point.lng);

          return (
            <g key={`point-${point.lat}-${point.lng}`}>
              <motion.g
                onHoverStart={() =>
                  setHoveredLocation(point.label || `Location ${i + 1}`)
                }
                onHoverEnd={() => setHoveredLocation(null)}
                onTapStart={() =>
                  setHoveredLocation(point.label || `Location ${i + 1}`)
                }
                className="cursor-pointer"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill={lineColor}
                  filter="url(#glow)"
                  className="drop-shadow-lg"
                />
                <circle cx={x} cy={y} r="2.5" fill={lineColor} opacity="0.5">
                  <animate
                    attributeName="r"
                    from="2.5"
                    to="10"
                    dur="2s"
                    begin={`${(i % 4) * 0.5}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0"
                    dur="2s"
                    begin={`${(i % 4) * 0.5}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </motion.g>

              {showLabels && point.label && !point.hideLabel && (
                <motion.g
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * i + 0.3, duration: 0.5 }}
                  className="pointer-events-none"
                >
                  <foreignObject
                    x={x - 50}
                    y={y - 26}
                    width="100"
                    height="22"
                    className="hidden sm:block"
                  >
                    <div className="flex h-full items-center justify-center">
                      <span
                        className={`rounded-md border border-zinc-200 bg-white/95 px-1.5 py-0.5 font-medium text-zinc-900 shadow-sm ${labelClassName}`}
                      >
                        {point.label}
                      </span>
                    </div>
                  </foreignObject>
                </motion.g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover / tap tooltip */}
      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 rounded-lg border border-zinc-200 bg-white/90 px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur-sm"
          >
            {hoveredLocation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WorldMap;
