export const API = import.meta.env.VITE_API_URL;
export const LOCALE = import.meta.env.VITE_LOCALE || "tr";

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// Strapi Blocks/RichText basit HTML dönüştürücü
function blocksToHtml(val) {
  if (!val) return "";
  if (typeof val === "string") return val; // Rich Text (HTML string)

  // Blocks (array/object) => çok basit paragraph/text birleştirme
  const walk = (node) => {
    if (!node) return "";
    if (Array.isArray(node)) return node.map(walk).join("");
    const type = node.type || node.kind;
    const children = node.children || node.content || [];
    if (type === "paragraph") {
      return `<p>${children.map(walk).join("")}</p>`;
    }
    if (type === "text") {
      let t = node.text || "";
      if (node.bold) t = `<strong>${t}</strong>`;
      if (node.italic) t = `<em>${t}</em>`;
      if (node.underline) t = `<u>${t}</u>`;
      return t;
    }
    if (type === "link") {
      const url = node.url || "#";
      return `<a href="${url}">${children.map(walk).join("")}</a>`;
    }
    // fallback: içeriği dolaş
    return walk(children);
  };
  return walk(val);
}

function mediaUrl(m) {
  let u =
    m?.url ||
    m?.formats?.medium?.url ||
    m?.data?.attributes?.url ||
    (Array.isArray(m?.data) ? m.data[0]?.attributes?.url : null) ||
    null;
  if (u && !u.startsWith("http")) u = `${API}${u}`;
  return u;
}

export async function getGlobal() {
  const base = `${API}/api/global?populate=*`;
  let j;
  try {
    j = await fetchJson(`${base}${LOCALE ? `&locale=${LOCALE}` : ""}`);
  } catch {
    j = await fetchJson(base);
  }

  // v5: data düz; v4: data.attributes
  const raw = j?.data || {};
  const a = raw.attributes ?? raw;

  // sosyal linkleri normalize et (platform/name + url/href)
  const rawSocial = a.socialLinks || a.sociallinks || [];
  const socialLinks = (Array.isArray(rawSocial) ? rawSocial : []).map((s) => ({
    platform: String(s.platform || s.name || "").toLowerCase(),
    url: s.url || s.href || "",
  })).filter((x) => x.platform && x.url);

  return {
    siteName: a.siteName ?? a.sitename ?? "",
    logo: mediaUrl(a.logo),
    headerMenu: a.headerMenu || a.headermenu || [],
    headerCtaLabel: a.headerCtaLabel || a.headerctalabel || "",
    headerCtaUrl: a.headerCtaUrl || a.headerctaurl || "",
    socialLinks,
    footerColumns: a.footerColumns || a.footercolumns || [],
    footerText: blocksToHtml(a.footerText || a.footertext),
    theme: {
      primary: a.theme_primary || a.themePrimary || "#22c55e",
      accent: a.theme_accent || a.themeAccent || "#0ea5e9",
      dark: !!a.theme_dark,
    },
  };
}
