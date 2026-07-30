// Satori (used by next/og's ImageResponse) can't consume next/font — it needs
// raw font bytes. Google's default CSS response uses woff2, which Satori
// can't parse, but an old-browser User-Agent makes Google serve ttf instead.
const LEGACY_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.1 (KHTML, like Gecko) Chrome/6.0.472.63 Safari/534.1";

/**
 * Loads a static (non-variable) weight of a Google Font as raw bytes.
 * Pass `text` to subset to just those characters (only safe when that exact
 * string is what gets rendered, with no CSS text-transform applied to it —
 * otherwise the transformed glyphs won't be in the subset). Omit it to fetch
 * full Latin coverage for text whose content isn't known in advance.
 */
export async function loadGoogleFont(
  family: string,
  weight: number,
  text?: string
): Promise<ArrayBuffer | null> {
  try {
    const textParam = text ? `&text=${encodeURIComponent(text)}` : "";
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family
    )}:wght@${weight}${textParam}`;
    const css = await fetch(cssUrl, {
      headers: { "User-Agent": LEGACY_USER_AGENT },
    }).then((res) => res.text());

    const fontUrlMatch = css.match(/src: url\(([^)]+)\)/);
    if (!fontUrlMatch) return null;

    const fontResponse = await fetch(fontUrlMatch[1]);
    if (!fontResponse.ok) return null;
    return await fontResponse.arrayBuffer();
  } catch {
    return null;
  }
}
