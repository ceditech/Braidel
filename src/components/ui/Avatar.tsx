import React from "react";

type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizes: Record<AvatarSize, { dim: number; font: number }> = {
  sm: { dim: 32, font: 13 },
  md: { dim: 40, font: 15 },
  lg: { dim: 52, font: 18 },
  xl: { dim: 68, font: 24 },
};

const PALETTE = [
  ["#E8C9A8", "#C98A5A"],
  ["#D9A98A", "#B06A45"],
  ["#E3CFA6", "#C2922F"],
  ["#CBB89C", "#8B6B50"],
  ["#E9B79A", "#C75D3F"],
  ["#D6C2A0", "#A2781F"],
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function colorIndex(name: string) {
  return name.charCodeAt(0) % PALETTE.length;
}

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  src?: string;
  ring?: boolean;
}

export function Avatar({ name, size = "md", src, ring }: AvatarProps) {
  const { dim, font } = sizes[size];
  const [a, b] = PALETTE[colorIndex(name)];
  return (
    <div
      style={{
        width: dim,
        height: dim,
        borderRadius: "50%",
        background: src ? "transparent" : `linear-gradient(135deg, ${a}, ${b})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: font,
        color: "#fff",
        flexShrink: 0,
        overflow: "hidden",
        boxShadow: ring ? "0 0 0 3px var(--brand-soft), 0 0 0 5px var(--terracotta-300)" : undefined,
      }}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials(name)
      )}
    </div>
  );
}
