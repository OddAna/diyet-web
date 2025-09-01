import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { getGlobal } from "./strapi";

export default function Layout() {
  const [g, setG] = useState(null);

  useEffect(() => {
    getGlobal().then((data) => {
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
        </div>
        <div className="max-w-5xl mx-auto px-6 pb-10 text-sm opacity-70"
             dangerouslySetInnerHTML={{ __html: g.footerText }} />
      </footer>
    </div>
  );
}
