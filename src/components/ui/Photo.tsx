import React from "react";

/* Warm gradient placeholder used until real portfolio images exist.
   Deterministic color per `seed` so the same subject looks consistent. */
const TONES = [
  ["#E8C9A8", "#C98A5A"],
  ["#D9A98A", "#B06A45"],
  ["#E3CFA6", "#C2922F"],
  ["#CBB89C", "#8B6B50"],
  ["#E9B79A", "#C75D3F"],
  ["#D6C2A0", "#A2781F"],
];

interface PhotoProps {
  seed?: number;
  aspect?: string;
  radius?: string;
  label?: string;
  style?: React.CSSProperties;
}

export function Photo({ seed = 0, aspect = "4/3", radius = "0px", label, style }: PhotoProps) {
  const [a, b] = TONES[seed % TONES.length];
  return (
    <div
      style={{
        aspectRatio: aspect,
        background: `linear-gradient(145deg, ${a}, ${b})`,
        borderRadius: radius,
        position: "relative",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        ...style,
      }}
    >
      <svg width="32%" height="32%" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.28 }}>
        <path d="M15 6C15 15 33 17 33 24 33 31 15 33 15 42" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <path d="M33 6C33 15 15 17 15 24 15 31 33 33 33 42" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      </svg>
      {label && (
        <span
          style={{
            position: "absolute",
            bottom: 10,
            left: 12,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "rgba(255,255,255,.92)",
            background: "rgba(0,0,0,.22)",
            padding: "2px 7px",
            borderRadius: 6,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
