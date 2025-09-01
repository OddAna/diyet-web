import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { getGlobal } from "./strapi";

export default function Layout() {
  const [g, setG] = useState(null);
  const Icon = ({ name, className="w-5 h-5" }) => {
  // minimal SVG ikon seti
  if (name === "instagram") return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/></svg>
  );
  if (name === "facebook") return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M13 3h4a1 1 0 1 1 0 2h-3v3h3a1 1 0 1 1 0 2h-3v9a1 1 0 1 1-2 0v-9h-2a1 1 0 1 1 0-2h2V5a2 2 0 0 1 2-2z"/></svg>
  );
  if (name === "x") return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M4 4h3.1l5.2 6.9L16 4h4l-6.3 8.3L20 20h-3.1l-5.6-7.5L8 20H4l6.6-8.7L4 4z"/></svg>
  );
  if (name === "youtube") return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M22 8.6a3 3 0 0 0-2.1-2.1C18.3 6 12 6 12 6s-6.3 0-7.9.5A3 3 0 0 0 2 8.6 31 31 0 0 0 2 12a31 31 0 0 0 .1 3.4 3 3 0 0 0 2.1 2.1C5.7 18 12 18 12 18s6.3 0 7.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0 0-3.4zM10 15V9l5 3-5 3z"/></svg>
  );
  if (name === "linkedin") return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v13H0V8zm7 0h4.8v1.8h.1c.7-1.2 2.5-2.5 5.1-2.5 5.4 0 6.4 3.5 6.4 8.1V21H18v-5.8c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H7V8z"/></svg>
  );
  if (name === "tiktok") return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M15 3a6 6 0 0 0 5 5v3.1a9 9 0 1 1-9-9H15zm-3 6.2A4.8 4.8 0 1 0 16.8 14V9.9a9 9 0 0 1-4.8-1.7v1z"/></svg>
  );
  return null;
};

  useEffect(() => {
    getGlobal().then((data) => {
      console.log("GLOBAL ⤵️", data); // <— kontrol et
      setG(data);
      // theme değişkenleri
      const r = document.documentElement;
      r.style.setProperty("--primary", data.theme.primary);
      r.style.setProperty("--accent", data.theme.accent);
    }).catch(console.error);
  }, []);

  if (!g) return <div className="min-h-screen grid place-items-center">yükleniyor…</div>;

  return (
    <div className="min-h-screen">
      <header className="border-b sticky top-0 bg-white/70 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center gap-4 p-4">
          <Link to="/" className="flex items-center gap-2">
            {g.logo && <img src={g.logo} alt="logo" className="h-8 w-8 rounded" />}
            <span className="font-bold">{g.siteName}</span>
          </Link>
          <nav className="ml-auto hidden sm:flex gap-4">
            {g.headerMenu?.map((m, i) => (
              <Link key={i} to={m.url} className="hover:text-[var(--primary)]">{m.label}</Link>
            ))}
          </nav>
          {g.headerCtaLabel && g.headerCtaUrl && (
            <a href={g.headerCtaUrl} className="ml-4 px-3 py-2 rounded-xl text-white"
               style={{ background: "var(--primary)" }}>
              {g.headerCtaLabel}
            </a>
          )}
        </div>
      </header>

      <Outlet />

      <footer className="mt-16 border-t">
        <div className="max-w-5xl mx-auto p-6 grid sm:grid-cols-3 gap-6">
          {g.footerColumns?.map((col, i) => (
            <div key={i}>
              <h4 className="font-semibold mb-2">{col.title}</h4>
              <ul className="space-y-1">
                {col.items?.map((it, j) => (
                  <li key={j}><a className="hover:underline" href={it.url}>{it.label}</a></li>
                ))}
              </ul>
            </div>
          ))}

          {/* Sosyal ikonlar */}
          {Array.isArray(g.socialLinks) && g.socialLinks.length > 0 && (
            <div className="sm:col-span-1">
              <h4 className="font-semibold mb-2">Bizi takip edin</h4>
              <div className="flex gap-3">
                {g.socialLinks.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer"
                    className="p-2 rounded-lg border hover:border-[var(--primary)]"
                    aria-label={s.platform}>
                    <Icon name={String(s.platform).toLowerCase()} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rich text (HTML) */}
        <div
          className="max-w-5xl mx-auto px-6 pb-10 text-sm opacity-80 leading-relaxed footer-html"
          dangerouslySetInnerHTML={{ __html: g.footerText || "" }}
        />
      </footer>
    </div>
  );
}
