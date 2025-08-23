// src/pages/Categoria.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/api";

function slugify(str) {
  return String(str).toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Categoria() {
  const { slug } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.getProjects();
        if (!on) return;
        setProjects(res.projects || []);
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, []);

  const filtered = useMemo(() => {
    if (slug === "todos") return projects;
    return projects.filter(p => slugify(p.category) === slug);
  }, [projects, slug]);

  const categoryName =
    slug === "todos"
      ? "Todos"
      : (filtered[0]?.category ?? slug.replace(/-/g, " "));

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            Proyectos — {categoryName}
          </h1>
          <Link to="/" className="text-sm underline">← Volver</Link>
        </div>

        {loading ? (
          <p className="opacity-70">Cargando…</p>
        ) : filtered.length === 0 ? (
          <p className="opacity-70">No hay proyectos en esta categoría.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(p => (
              <article key={p.id} className="rounded-2xl shadow bg-white overflow-hidden">
                <div className="aspect-[16/10] bg-gray-100">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-4">
                  <div className="text-xs inline-block bg-[#FFB800] text-[#111] px-2 py-0.5 rounded-full mb-2">
                    {p.category}
                  </div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm opacity-75">{p.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
