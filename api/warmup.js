export const config = { runtime: "edge" };

export default async function handler() {
  // Strapi global endpointini pingliyoruz
  const r = await fetch("https://devoted-trust-4456cb932f.strapiapp.com/api/global");
  return new Response("ok", { status: r.ok ? 200 : 500 });
}
