// api/strapi/[...path].js
export const config = { runtime: "edge" };

const ORIGIN = process.env.STRAPI_URL || "https://devoted-trust-4456cb932f.strapiapp.com";

export default async (req) => {
  // gelen path'i Strapi'ye yönlendir
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/strapi/, ""); // /recipes?..
  const target = `${ORIGIN}${path}${url.search}`;

  // Strapi'den çek
  const r = await fetch(target, {
    // cache'i Vercel Edge/CDN’e anlat
    cache: "no-store", // origin'e giderken; CDN için header ile yönetiyoruz
    headers: { "accept": "application/json" },
    // gerekiyorsa: headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` }
  });

  // CDN cache header’ları
  const hdrs = new Headers(r.headers);
  // 5 dk CDN, 1 gün stale-while-revalidate (zevkine göre ayarla)
  hdrs.set("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");
  hdrs.set("CDN-Cache", "hit-me-please");

  return new Response(await r.arrayBuffer(), {
    status: r.status,
    headers: hdrs,
  });
};
