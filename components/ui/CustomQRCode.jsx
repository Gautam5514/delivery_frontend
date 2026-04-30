"use client";

import { useMemo } from "react";
import QRCodeLib from "qrcode";

function isInFinderPattern(row, col, size) {
  return (
    (row < 7 && col < 7) ||
    (row < 7 && col >= size - 7) ||
    (row >= size - 7 && col < 7)
  );
}

/**
 * CustomQRCode
 *
 * Props:
 *   value                 – URL / string to encode
 *   size                  – SVG pixel size (default 268)
 *   fgColor / bgColor     – module and background colors
 *   errorCorrectionLevel  – "L" | "M" | "Q" | "H" (default "H")
 *   logoSrc               – data-URL or remote URL for a brand logo
 *                           overlaid in the centre.  Use errorCorrectionLevel="H"
 *                           (the default) so the 25% centre coverage is recoverable.
 *   logoPadding           – white space (px) around the logo (default 6)
 *   className / …props    – forwarded to <svg>
 */
export default function CustomQRCode({
  value,
  size = 268,
  fgColor = "#18181b",
  bgColor = "#ffffff",
  errorCorrectionLevel = "H",
  logoSrc = null,
  logoPadding = 6,
  className = "",
  ...props
}) {
  const qrData = useMemo(() => {
    try {
      return QRCodeLib.create(value, { errorCorrectionLevel });
    } catch {
      return null;
    }
  }, [value, errorCorrectionLevel]);

  if (!qrData) return null;

  const moduleCount = qrData.modules.size;
  const moduleSize  = size / moduleCount;
  const moduleInset = Math.max(0.35, moduleSize * 0.08);

  const finderPositions = [
    [0, 0],
    [0, moduleCount - 7],
    [moduleCount - 7, 0],
  ];
  const finderSize      = 7 * moduleSize;
  const innerPadding    = moduleSize;
  const innerWhiteSize  = 5 * moduleSize;
  const innerBlackSize  = 3 * moduleSize;

  const modules = [];
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qrData.modules.get(row, col) && !isInFinderPattern(row, col, moduleCount)) {
        modules.push({ x: col * moduleSize + moduleInset, y: row * moduleSize + moduleInset });
      }
    }
  }

  // Logo geometry — 24 % of QR size; white padding ring around it
  const logoSize   = Math.round(size * 0.24);
  const logoBg     = logoSize + logoPadding * 2;
  const logoBgX    = (size - logoBg)  / 2;
  const logoBgY    = (size - logoBg)  / 2;
  const logoX      = (size - logoSize) / 2;
  const logoY      = (size - logoSize) / 2;
  const logoBgR    = Math.round(logoBg  * 0.18);
  const logoR      = Math.round(logoSize * 0.15);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-label={`QR code for ${value}`}
      className={className}
      {...props}
    >
      {/* Clip path for rounded logo corners */}
      {logoSrc && (
        <defs>
          <clipPath id="gopo-logo-clip">
            <rect x={logoX} y={logoY} width={logoSize} height={logoSize} rx={logoR} ry={logoR} />
          </clipPath>
        </defs>
      )}

      {/* Background */}
      <rect width={size} height={size} fill={bgColor} rx="18" ry="18" />

      {/* Finder patterns */}
      {finderPositions.map(([row, col]) => {
        const x = col * moduleSize;
        const y = row * moduleSize;
        return (
          <g key={`${row}-${col}`}>
            <rect x={x} y={y} width={finderSize} height={finderSize} fill={fgColor} rx="10" ry="10" />
            <rect x={x + innerPadding} y={y + innerPadding} width={innerWhiteSize} height={innerWhiteSize} fill={bgColor} rx="7" ry="7" />
            <rect x={x + innerPadding * 2} y={y + innerPadding * 2} width={innerBlackSize} height={innerBlackSize} fill={fgColor} rx="3" ry="3" />
          </g>
        );
      })}

      {/* Data modules */}
      {modules.map(({ x, y }, i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={moduleSize - moduleInset * 2}
          height={moduleSize - moduleInset * 2}
          rx={Math.max(0.5, moduleSize * 0.18)}
          ry={Math.max(0.5, moduleSize * 0.18)}
          fill={fgColor}
        />
      ))}

      {/* Brand logo overlay */}
      {logoSrc && (
        <g>
          {/* White background square with rounded corners */}
          <rect
            x={logoBgX}
            y={logoBgY}
            width={logoBg}
            height={logoBg}
            fill={bgColor}
            rx={logoBgR}
            ry={logoBgR}
          />
          {/* Logo image clipped to rounded rect */}
          <image
            href={logoSrc}
            x={logoX}
            y={logoY}
            width={logoSize}
            height={logoSize}
            preserveAspectRatio="xMidYMid meet"
            clipPath="url(#gopo-logo-clip)"
          />
        </g>
      )}
    </svg>
  );
}
