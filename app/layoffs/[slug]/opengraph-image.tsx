import { ImageResponse } from "next/og";
import { getAllLayoffs, getLayoffBySlug } from "@/lib/getLayoffs";
import { formatDate } from "@/lib/format";
import { getTagStyle } from "@/lib/tagStyles";
import { loadGoogleFont } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Layoff Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllLayoffs().map((entry) => ({ slug: entry.id }));
}

const INK = "#1c1917";
const SECONDARY = "#736c60";
const ACCENT = "#a3410a";
const PAPER = "#faf8f4";

export default async function OpengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const entry = getLayoffBySlug(params.slug);

  const company = entry?.company ?? "Layoff Tracker";
  const headcount = entry?.employeesAffected.toLocaleString() ?? "";
  const kicker = entry
    ? `${formatDate(entry.dateAnnounced)} · ${entry.industry}`
    : "";

  // Only the company name and headcount render in Fraunces (neither is
  // text-transformed), so the subset only needs their literal characters.
  // The UI text (kicker, tags, wordmark) varies per entry and gets
  // uppercased via CSS, so it isn't safe to subset — fetch full coverage.
  const [fraunces, inter] = await Promise.all([
    loadGoogleFont("Fraunces", 600, `${company}${headcount}`),
    loadGoogleFont("Inter", 500),
  ]);
  const displayFont = fraunces ? "Fraunces" : "serif";
  const uiFont = inter ? "Inter" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: PAPER,
        }}
      >
        <div style={{ display: "flex", height: 14, width: "100%", backgroundColor: ACCENT }} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 72px 56px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: uiFont,
              fontSize: 22,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: SECONDARY,
            }}
          >
            Layoff Tracker
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {kicker ? (
              <div
                style={{
                  display: "flex",
                  fontFamily: uiFont,
                  fontSize: 22,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: ACCENT,
                  marginBottom: 20,
                }}
              >
                {kicker}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                fontFamily: displayFont,
                fontWeight: 600,
                fontSize: company.length > 14 ? 76 : 100,
                lineHeight: 1.05,
                letterSpacing: "-2px",
                color: INK,
                marginBottom: 32,
                maxWidth: 1000,
              }}
            >
              {company}
            </div>

            {entry ? (
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <div
                  style={{
                    display: "flex",
                    fontFamily: displayFont,
                    fontWeight: 600,
                    fontSize: 84,
                    color: ACCENT,
                  }}
                >
                  {headcount}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: uiFont,
                    marginLeft: 20,
                    fontSize: 24,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: SECONDARY,
                  }}
                >
                  employees affected
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {(entry?.tags ?? []).map((tag) => {
              const style = getTagStyle(tag);
              return (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    fontFamily: uiFont,
                    padding: "8px 22px",
                    borderRadius: 999,
                    backgroundColor: style.bg,
                    color: style.text,
                    fontSize: 20,
                  }}
                >
                  {tag}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        ...(inter
          ? [{ name: "Inter", data: inter, weight: 500 as const, style: "normal" as const }]
          : []),
        ...(fraunces
          ? [{ name: "Fraunces", data: fraunces, weight: 600 as const, style: "normal" as const }]
          : []),
      ],
    }
  );
}
