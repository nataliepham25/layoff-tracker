const KNOWN_TAG_STYLES: Record<string, { bg: string; text: string }> = {
  "big tech": { bg: "#E4EAEF", text: "#1F3A5F" },
  "ai-driven": { bg: "#E1EBE2", text: "#2C4A31" },
  startup: { bg: "#F4E1D3", text: "#8A3B12" },
};

const FALLBACK_TAG_STYLE = { bg: "#EFEAE0", text: "#57503F" };

export function getTagStyle(tag: string): { bg: string; text: string } {
  return KNOWN_TAG_STYLES[tag.toLowerCase()] ?? FALLBACK_TAG_STYLE;
}
