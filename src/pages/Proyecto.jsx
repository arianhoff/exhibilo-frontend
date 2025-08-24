import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "@/api";
import Exhibilo3DViewer from "@/components/Exhibilo3DViewer";
import { createSearchParams } from "react-router-dom";

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Proyecto() {
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar todos y encontrar el actual
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

  const project = useMemo(
    () => projects.find((p) => String(p.id) === String(id)),
    [projects, id]
  );

  const media = useMemo(() => {
    if (!project) return [];
    // Si tenés múltiples imágenes en el futuro, usá project.images; por ahora, al menos la principal:
    const imgs = (project.images && project.images.length ? project.images : [project.image]).filter(Boolean);
    const items = imgs.map((src, i) => ({ id: `img-${i}`, type: "image", src }));
    if (project.model) items.push({ id: "3d", type: "3d", src: project.model });
    return items;
  }, [project]);

  const [activeId, setActiveId] = useState(null);
  useEffect(() => {
    if (media.length) setActiveId(media[0].id);
  }, [media.length]);
  const active = useMemo(() => media.find(m => m.id === activeId), [media, activeId]);

  const related = useMemo(() => {
    if (!project) return [];
    return projects.filter(p => p.category === project.category && p.id !== project.id).slice(0, 6);
  }, [projects, project]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10">Cargando…</div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p>No encontramos este proyecto.</p>
          <Link to="/" className="underline">← Volver al inicio</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header simple con back y categoría */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{project.title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs inline-block bg-[#FFB800] text-[#111] px-2 py-0.5 rounded-full">
              {project.category}
            </span>
            <Link to="/#proyectos" className="text-sm underline">← Inicio</Link>
          </div>
        </div>

        {/* GRID principal */}
        <div className="grid grid-cols-12 gap-8">
          {/* Columna izquierda: miniaturas + visor/imagen */}
          <div className="col-span-12 lg:col-span-7">
            <div className="flex gap-4">
              {/* Tira de miniaturas (vertical en desktop) */}
              <div className="hidden sm:flex flex-col gap-3">
                {media.map((m) => {
                  const isActive = activeId === m.id;
                  if (m.type === "image") {
                    return (
                      <button
                        key={m.id}
                        onClick={() => setActiveId(m.id)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border ${isActive ? "border-[#FFB800]" : "border-transparent"} shadow-sm`}
                        title="Imagen"
                      >
                        <img src={m.src} alt="" className="w-full h-full object-cover" />
                      </button>
                    );
                  }
                  // Thumb para 3D
                  return (
                    <button
                      key={m.id}
                      onClick={() => setActiveId(m.id)}
                      className={`w-16 h-16 rounded-lg border flex items-center justify-center text-xs ${isActive ? "border-[#FFB800]" : "border-[#ddd]"} bg-white`}
                      title="Visor 3D"
                    >
                      Visor 3D
                    </button>
                  );
                })}
              </div>

              {/* Área principal */}
              <div className="flex-1">
                <div className="rounded-2xl bg-white shadow overflow-hidden">
                  {active?.type === "3d" ? (
                    <div className="h-[520px]">
                      {/* Pasamos la URL del .glb directo al visor */}
                      <Exhibilo3DViewer modelUrl={active.src} />
                    </div>
                  ) : (
                    <img
                      src={active?.src || project.image}
                      alt={project.title}
                      className="w-full h-[520px] object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: descripción */}
          <div className="col-span-12 lg:col-span-5">
            <div className="rounded-2xl bg-white shadow p-6">
              <h2 className="text-xl font-semibold mb-2">Descripción</h2>
              <p className="text-[#555] leading-relaxed">
                {project.description || "Proyecto de exhibidor para retail."}
              </p>

              {/* (Opcional) ficha técnica rápida */}
              {/* <div className="mt-6 space-y-2 text-sm text-[#444]">
                <div><span className="font-medium">Materiales:</span> Cartón + madera + acrílico</div>
                <div><span className="font-medium">Formato:</span> Isla de góndola</div>
                <div><span className="font-medium">Dimensiones:</span> 120 × 80 × 180 cm</div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Otros proyectos de la misma categoría */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Otros proyectos de la misma categoría</h3>
          {related.length === 0 ? (
            <p className="opacity-70">No hay más proyectos en esta categoría.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => {
                const search = p.model
                  ? `?${createSearchParams({ model: p.model }).toString()}`
                  : "";
                return (
                  <Link
                    key={p.id}
                    to={`/proyecto/${p.id}${search}`}
                    className="block rounded-2xl bg-white shadow hover:shadow-lg transition overflow-hidden"
                  >
                    <div className="aspect-[16/10] bg-gray-100">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="text-xs inline-block bg-[#FFB800] text-[#111] px-2 py-0.5 rounded-full mb-2">
                        {p.category}
                      </div>
                      <h4 className="font-semibold">{p.title}</h4>
                      <p className="text-sm text-[#666]">{p.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
