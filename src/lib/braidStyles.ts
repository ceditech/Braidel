import stylesPack from "../../docs/african_hair_braids_33_styles_pack/AFRICAN_HAIR_BRAIDS_33_STYLES.json";

export interface BraidStyle {
  id: number;
  name: string;
  slug: string;
  description: string;
  imagePrompt: string;
  imagePath: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const BRAID_STYLES: BraidStyle[] = stylesPack.styles.map((style) => {
  const slug = slugify(style.name);
  return {
    ...style,
    slug,
    imagePath: `/braid-styles/${slug}.png`,
  };
});

export const BRAID_STYLE_NAMES = BRAID_STYLES.map((style) => style.name);

export function findBraidStyle(name: string): BraidStyle | undefined {
  return BRAID_STYLES.find((style) => style.name === name);
}
