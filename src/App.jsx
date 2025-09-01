import { useEffect, useState, useMemo } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const RAW = import.meta.env.VITE_API_URL; // dev için
const PROXY = "/api/strapi";              // prod için Vercel Edge
const isProd = import.meta.env.PROD;

// API kökü (prod: proxy; dev: strapi)
export const API = isProd ? PROXY : RAW;
export const LOCALE = import.meta.env.VITE_LOCALE || "tr";

function normalize(item) {
  const a = item?.attributes ?? item ?? {};
  let img = a.image?.url || a.image?.formats?.large?.url || a.image?.formats?.medium?.url || a.image?.data?.attributes?.url || null;
  if (img && !img.startsWith("http")) img = `${API}${img}`;
  return {
    id: item?.id ?? crypto.randomUUID(),
    title: a.title ?? "",
    slug: a.slug ?? "",
    description: typeof a.description === "string" ? a.description : "",
    calories: a.calories ?? null,
    image: img,
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
        setRecipes(Array.isArray(data?.data) ? data.data.map(normalize) : []);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  // Sections
  const features = useMemo(
    () => [
      { t: "Kişiye Özel Program", d: "Hedef, sağlık durumu ve yaşam tarzına göre planlama." },
      { t: "Online Takip", d: "Haftalık kontrol ve motivasyon hatırlatmaları." },
      { t: "Tarif Kitaplığı", d: "Kolay, pratik ve lezzetli tarifler." },
    ],
    []
  );

  if (err) {
    return <div className="min-h-screen grid place-items-center p-6 text-red-600">API hatası: {err}</div>;
  }

  return (
    <div>
      {/* Scroll progress */}
      <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 h-1 origin-left z-50" 
        initial={{ background: "var(--primary)" }} />

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden">
        {/* animated blobs */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-40"
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle at 30% 30%, var(--primary), transparent 60%)" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-40"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle at 70% 70%, var(--accent), transparent 60%)" }}
        />

        <div className="max-w-6xl mx-auto px-6 pt-14 pb-24 sm:pb-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
          >
            Dengeli Beslen, <span className="text-[var(--primary)]">İyi Hisset</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 text-lg sm:text-xl opacity-80 max-w-2xl"
          >
            Diyetisyen danışmanlığı, takip ve lezzetli tariflerle hedeflerine ulaş.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 flex gap-3"
          >
            <a href="#packages" className="px-5 py-3 rounded-2xl text-white" style={{ background: "var(--primary)" }}>Paketleri Gör</a>
            <a href="#contact" className="px-5 py-3 rounded-2xl border">Ücretsiz Ön Görüşme</a>
          </motion.div>

          {/* hero cards */}
          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border p-5 bg-white/70 backdrop-blur"
              >
                <h3 className="font-semibold text-lg">{f.t}</h3>
                <p className="opacity-70 text-sm mt-1">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 gap-10 items-center">
          <motion.img
            src={recipes[0]?.image || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop"}
            alt="healthy"
            className="rounded-3xl border"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />
          <div>
            <motion.h2 className="text-3xl sm:text-4xl font-bold" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Hakkımda</motion.h2>
            <motion.p className="mt-4 opacity-80" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              Bilimsel temelli, sürdürülebilir beslenme yaklaşımıyla danışanlarıma eşlik ediyorum. Kilo yönetimi, sporcu beslenmesi ve duyarlı yeme başlıklarında çalışıyorum.
            </motion.p>
            <div className="mt-6 flex gap-3">
              <a href="#contact" className="px-5 py-3 rounded-2xl text-white" style={{ background: "var(--primary)" }}>Randevu Al</a>
              <a href="#recipes" className="px-5 py-3 rounded-2xl border">Örnek Tarifler</a>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES / PRICING */}
      <section id="packages" className="py-20 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_80%),radial-gradient(50%_50%_at_20%_0%,rgba(34,197,94,0.08),transparent_60%),radial-gradient(50%_50%_at_80%_0%,rgba(14,165,233,0.08),transparent_60%)]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">Danışmanlık Paketleri</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: "Başlangıç", price: "₺", desc: "Tek seans değerlendirme + plan." },
              { name: "Takip", price: "₺₺", desc: "4 hafta takip ve güncelleme." },
              { name: "Premium", price: "₺₺₺", desc: "8 hafta yoğun takip + ek kaynaklar." },
            ].map((p, i) => (
              <motion.div key={i} className="rounded-3xl border p-6 bg-white/70 backdrop-blur"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              >
                <h3 className="font-semibold text-xl">{p.name}</h3>
                <p className="mt-2 opacity-70 text-sm">{p.desc}</p>
                <div className="mt-4 text-3xl">{p.price}</div>
                <a href="#contact" className="mt-5 inline-block px-4 py-2 rounded-xl text-white" style={{ background: "var(--primary)" }}>Başla</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RECIPES */}
      <section id="recipes" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Tarifler</h2>
          {loading ? (
            <div className="grid place-items-center h-32">yükleniyor…</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((r) => (
                <motion.article key={r.id} className="rounded-2xl border p-4 hover:shadow transition bg-white/70 backdrop-blur"
                  whileHover={{ y: -4 }}>
                  {r.image && <img className="w-full h-40 object-cover rounded-xl mb-3" src={r.image} alt={r.title} />}
                  <h3 className="text-lg font-semibold">{r.title || r.slug}</h3>
                  {r.description && <p className="text-sm opacity-70 mt-1 line-clamp-2">{r.description}</p>}
                  <a href={`/recipe/${r.slug || r.id}`} className="text-sm mt-2 inline-block underline">Detaya git</a>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">Danışan Yorumları</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {["2 ayda hedefime ulaştım.", "Tarifler çok pratik.", "Sürekli iletişimde olmak motive etti."].map((q, i) => (
              <motion.blockquote key={i} className="rounded-2xl border p-5 bg-white/70 backdrop-blur"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p>“{q}”</p>
                <footer className="mt-2 text-sm opacity-60">— Danışan {i + 1}</footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">İletişim</h2>
          <div className="rounded-3xl border p-6 grid sm:grid-cols-2 gap-6 bg-white/70 backdrop-blur">
            <div>
              <p className="opacity-80">Randevu ve sorular için formu doldurun; en kısa sürede dönüş yapalım.</p>
              <ul className="mt-4 space-y-2 text-sm opacity-80">
                <li>📍 İstanbul</li>
                <li>✉️ info@diyetisyen.com</li>
                <li>📱 WhatsApp: <a className="underline" href="https://wa.me/905000000000">+90 500 000 00 00</a></li>
              </ul>
            </div>
            <form onSubmit={(e)=>e.preventDefault()} className="grid gap-3">
              <input className="border rounded-xl px-3 py-2" placeholder="Ad Soyad" />
              <input className="border rounded-xl px-3 py-2" placeholder="E-posta" />
              <textarea className="border rounded-xl px-3 py-2" rows={4} placeholder="Mesajınız" />
              <button className="px-4 py-2 rounded-xl text-white" style={{ background: "var(--primary)" }}>Gönder</button>
            </form>
          </div>
        </div>
      </section>

      {/* BACK TO TOP */}
      <a href="#hero" className="fixed bottom-5 right-5 px-3 py-2 rounded-2xl border bg-white/70 backdrop-blur text-sm">Yukarı</a>
    </div>
  );
}
