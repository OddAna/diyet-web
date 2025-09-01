export const API = import.meta.env.VITE_API_URL;
export const LOCALE = import.meta.env.VITE_LOCALE || "tr";

export async function getGlobal() {
  const url = `${API}/api/global?populate=deep&locale=${LOCALE}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  const g = j?.data || j?.data?.attributes || {};
  // v5 düz, v4 attributes
  const a = g.attributes ?? g;

  // logo url normalize
  let logo =
    a.logo?.url ||
    a.logo?.formats?.thumbnail?.url ||
    a.logo?.data?.attributes?.url ||
    null;
  if (logo && !logo.startsWith("http")) logo = `${API}${logo}`;

  return {
    siteName: a.siteName ?? "",
    logo,
    headerMenu: a.headerMenu ?? [],
    headerCtaLabel: a.headerCtaLabel ?? "",
    headerCtaUrl: a.headerCtaUrl ?? "",
    socialLinks: a.socialLinks ?? [],
    footerColumns: a.footerColumns ?? [],
    footerText: typeof a.footerText === "string" ? a.footerText : "",
    theme: {
      primary: a.theme_primary || "#22c55e",
      accent: a.theme_accent || "#0ea5e9",
      dark: !!a.theme_dark,
    },
  };
}
