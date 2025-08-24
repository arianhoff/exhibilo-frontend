﻿// frontend/src/api/index.js

// Base para URLs (Vite ajusta BASE_URL según / o /web-clean/)
const BASE = import.meta.env.BASE_URL || "/";

// Si querés pegarle a un backend real, podés usar estas variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const USE_BACKEND =
  (import.meta.env.PROD && !!BACKEND_URL) ||
  (import.meta.env.DEV && import.meta.env.VITE_USE_BACKEND === "true");

// Helper con fallback para DEV / sin backend
async function safeFetchJson(path, fallback) {
  try {
    if (!USE_BACKEND) return fallback;
    const base = import.meta.env.DEV ? "/api" : BACKEND_URL;
    if (!base) return fallback;
    const url = `${base.replace(/\/$/, "")}${path}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`API fallback for ${path}:`, e);
    return fallback;
  }
}

// 👇 ÚNICA definición de la API. Agregá/quitá métodos acá.
export const api = {
  async getServices() {
    const fallback = {
      services: [
        {
          title: "Conceptualización",
          description: "Etapa inicial del proceso creativo donde transformamos ideas en conceptos estratégicos y visuales. Aquí definimos la esencia del proyecto, alineando objetivos, identidad de marca y propuesta de valor para sentar las bases de un diseño sólido y coherente.",
          icon: "Palette",
        },
        {
          title: "Briefing y diseño",
          description: "Partimos de la recopilación de objetivos, público y necesidades para luego transformarlos en propuestas visuales claras y funcionales. Este proceso asegura que la creatividad esté alineada con la estrategia y que cada pieza transmita identidad, impacto y coherencia con la marca.",
          icon: "Factory",
        },
        {
          title: "Desarrollo 3D y planos técnicos",
          description: "Transformamos las ideas en modelos tridimensionales y documentación técnica precisa. Esta etapa permite visualizar el diseño con realismo, optimizar detalles constructivos y garantizar una producción eficiente y fiel al concepto original. Es el puente entre la creatividad y la fabricación.",
          icon: "Truck",
        },
      ],
    };
    return safeFetchJson("/services", fallback);
  },

 async getProjects() {
  const fallback = {
    projects: [
      {
        id: 1,
        title: "Cabecera",
        description: "Línea premium",
        category: "Cabecera",
        image: `${import.meta.env.BASE_URL}proyectos/Cabecera.jpg`,
        model: `${import.meta.env.BASE_URL}modelos/ModeloV1.glb`,
      },
      {
        id: 2,
        title: "Chuponera",
        description: "Impacto en góndola",
        category: "Chuponera",
        image: `${import.meta.env.BASE_URL}proyectos/Chuponera.jpg`,
        model: `${import.meta.env.BASE_URL}modelos/ModeloV2.glb`,
      },
      {
        id: 3,
        title: "Exhibidor",
        description: "Alta rotación",
        category: "Exhibidor",
        image: `${import.meta.env.BASE_URL}proyectos/Exhibidor.jpg`,
      },
      {
        id: 4,
        title: "Isla",
        description: "Alta rotación",
        category: "Isla",
        image: `${import.meta.env.BASE_URL}proyectos/Isla.jpg`,
      },
      {
        id: 5,
        title: "Shelf Extender",
        description: "Línea premium",
        category: "Shelf Extender",
        image: `${import.meta.env.BASE_URL}proyectos/Shelfextender.jpg`,
      },
      {
        id: 6,
        title: "Sidekick",
        description: "Impacto en góndola",
        category: "Sidekick",
        image: `${import.meta.env.BASE_URL}proyectos/Sidekick.jpg`,
      },
    ],
  };
  return safeFetchJson("/projects", fallback);
},

  async getTestimonials() {
    const fallback = {
      testimonials: [
        { author: "María G.", company: "Retail SA", quote: "Excelente calidad y tiempos." },
        { author: "J. Pérez", company: "Bebidas XYZ", quote: "Diseños que venden." },
        { author: "Lucía R.", company: "Cosmética Pro", quote: "Equipo muy profesional." },
      ]
    };
    return safeFetchJson("/testimonials", fallback);
  },

  // Envío del formulario de contacto al PHP en DonWeb
  async postContact(payload) {
    // Usar ruta relativa para el proxy de desarrollo, y BASE para producción
    const url = import.meta.env.DEV ? '/api/contact.php' : `${BASE}api/contact.php`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.error || `Error HTTP ${res.status}`);
    }
    return json;
  },
};
