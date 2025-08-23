// src/pages/Proyecto.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "@/api";
import Exhibilo3DViewer from "@/components/Exhibilo3DViewer";

export default function Proyecto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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

  const project = useMemo(
    () => projects.find(p => String(p.id) === String(id)),
    [projects, id]
  );

  // Si tiene model y la URL no lo trae, agregamos ?model=... para que el visor lo tome.
  useEffect(() => {
    if (!project?.model) return;
    const params = new URLSearchParams(location.search);
    if (!params.get("model")) {
      params.set("model", project.model);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [project, location.pathname, location.search, navigate]);

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            {project ? project.title : "Proyecto"}
          </h1>
          <div className="flex gap-4 text-sm">
            <Link to="/" className="underline">← Inicio</Link>
            {project?.category && (
              <Link
                to={`/categoria/${project.category.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`}
                className="underline"
              >
                Ver más de {project.category}
              </Link>
            )}
          </div>
        </div>

        {loading && <p className="opacity-70">Cargando…</p>}

        {!loading && !project && (
          <p className="opacity-70">No encontramos este proyecto.</p>
        )}

        {project && (
          <>
            <div className="mb-6">
              <p className="text-sm inline-block bg-[#FFB800] text-[#111] px-2 py-0.5 rounded-full">
                {project.category}
              </p>
              <p className="text-[#555] mt-2">{project.description}</p>
            </div>

            <Exhibilo3DViewer />

            {/* (Opcional) Imagen/es de apoyo debajo */}
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <img src={project.image} alt={project.title} className="rounded-xl shadow" />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
