export const API = import.meta.env.VITE_API_URL;
export const LOCALE = import.meta.env.VITE_LOCALE || "tr";

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export async function getGlobal() {
  // önce populate=*, locale ile dene; 400 olursa locale'siz tekrar dene
  const base = `${API}/api/global?populate=*`;
  let j;
  try {
    j = await fetchJson(`${base}${LOCALE ? `&locale=${LOCALE}` : ""}`);
  } catch (e) {
    // 400 ise (çoğunlukla i18n kapalı) locale'siz dene
    j = await fetchJson(base);
  }

  const raw = j?.data || j?.data?.attributes || {};
  const a = raw.attributes ?? raw;

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
