const KNOWN_TAG_STYLES: Record<string, { bg: string; text: string }> = {
  "big tech": { bg: "#E6F1FB", text: "#0C447C" },
  "ai-driven": { bg: "#E1F5EE", text: "#085041" },
  startup: { bg: "#FAECE7", text: "#712B13" },
};

const FALLBACK_TAG_STYLE = { bg: "#F1F1F2", text: "#3F3F46" };

export function getTagStyle(tag: string): { bg: string; text: string } {
  return KNOWN_TAG_STYLES[tag.toLowerCase()] ?? FALLBACK_TAG_STYLE;
}
