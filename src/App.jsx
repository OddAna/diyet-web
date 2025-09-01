import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;
const LOCALE = import.meta.env.VITE_LOCALE || "tr";

function normalize(item) {
  // v5: alanlar düz; v4: item.attributes içinde
  const a = item?.attributes ?? item ?? {};
  // media: v5 => a.image.url ; v4 => a.image.data.attributes.url (single)
  let imgUrl =
    a.image?.url ??
    a.image?.formats?.medium?.url ??
    a.image?.data?.attributes?.url ??
    null;
  if (imgUrl && !imgUrl.startsWith("http")) imgUrl = `${API}${imgUrl}`;

  return {
    id: item?.id ?? crypto.randomUUID(),
    title: a.title ?? "",
    slug: a.slug ?? "",
    description: typeof a.description === "string" ? a.description : "",
    calories: a.calories ?? null,
    image: imgUrl,
  };
}

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`${API}/api/recipes?populate=image&locale=${LOCALE}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        const list = Array.isArray(data?.data) ? data.data.map(normalize) : [];
        setRecipes(list);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen grid place-items-center text-xl">yükleniyor…</div>;
  if (err) return <div className="p-6 text-red-600">API hatası: {err}</div>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tarifler</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((r) => (
          <article key={r.id} className="rounded-2xl border p-4 hover:shadow transition">
            {r.image && <img className="w-full h-40 object-cover rounded-xl mb-3" src={r.image} alt={r.title || "recipe"} />}
            <h2 className="text-lg font-semibold">{r.title || r.slug || "Adsız tarif"}</h2>
            {r.calories && <p className="text-sm opacity-70">{r.calories} kcal</p>}
            {r.description && <p className="text-sm mt-2 line-clamp-3">{r.description}</p>}
          </article>
        ))}
      </div>
    </main>
  );
}
