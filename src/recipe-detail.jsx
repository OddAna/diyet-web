import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;
const LOCALE = import.meta.env.VITE_LOCALE || "tr";

export default function RecipeDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const url = `${API}/api/recipes?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=image&locale=${LOCALE}`;
    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        const a = (j.data?.[0]?.attributes ?? j.data?.[0] ?? {});
        const img =
          a.image?.url ||
          a.image?.formats?.large?.url ||
          a.image?.data?.attributes?.url ||
          null;
        let imgUrl = img && !img.startsWith("http") ? `${API}${img}` : img;
        setItem({ ...a, image: imgUrl });
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen grid place-items-center text-xl">yükleniyor…</div>;
  if (err) return <div className="p-6 text-red-600">API hatası: {err}</div>;
  if (!item) return <div className="p-6">Bulunamadı. <Link className="underline" to="/">Geri dön</Link></div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-sm underline">← Tüm tarifler</Link>
      <h1 className="text-3xl font-bold mt-2">{item.title || "Tarif"}</h1>
      {item.image && <img className="w-full rounded-2xl my-4" src={item.image} alt={item.title} />}
      {item.calories && <p className="opacity-70 mb-2">{item.calories} kcal</p>}
      {item.description && <article className="prose prose-invert max-w-none">{item.description}</article>}
    </main>
  );
}
