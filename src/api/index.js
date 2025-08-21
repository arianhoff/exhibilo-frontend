// src/api/index.js
 const BASE_URL = import.meta.env.VITE_BACKEND_URL;
 const USE_BACKEND =
   (import.meta.env.PROD && !!BASE_URL) ||
   (import.meta.env.DEV && import.meta.env.VITE_USE_BACKEND === 'true');

// helper para fetch opcional
async function safeFetchJson(path, fallback) {
   try {
     if (!USE_BACKEND) return fallback;
     if (!BASE_URL) return fallback;
     const url = `${BASE_URL.replace(/\/$/, "")}${path}`;
     if (!USE_BACKEND) return fallback;
     const base = import.meta.env.DEV ? DEV_BASE : BASE_URL;
     if (!base) return fallback;
     const res = await fetch(url, { headers: { Accept: "application/json" } });
     if (!res.ok) throw new Error(`HTTP ${res.status}`);
     const json = await res.json().catch(() => ({}));
     return json;
   } catch (e) {
     console.warn(`API fallback for ${path}:`, e);
     return fallback;
   }
}

// ====== SERVICES ======
async function getServices() {
  // Estructura que espera Services.jsx: { title, description, icon }
  const fallback = {
    services: [
      { title: "Diseño 3D", description: "Exhibidores a medida", icon: "Palette" },
      { title: "Producción", description: "Cartón, madera, metal, acrílico", icon: "Factory" },
      { title: "Implementación", description: "Logística e instalación", icon: "Truck" },
    ],
  };
  return safeFetchJson("/services", fallback);
}

// ====== PROJECTS ======
async function getProjects() {
  // Estructura esperada por ProjectsGrid.jsx:
  // { id, title, description, category, image }
  const fallback = {
    projects: [
      { id: 1, title: "Display Cosmética", description: "Línea premium", category: "Cosmética", image: "/img/proj1.jpg" },
      { id: 2, title: "Isla Bebidas", description: "Impacto en góndola", category: "Bebidas", image: "/img/proj2.jpg" },
      { id: 3, title: "Exhibidor Alimentos", description: "Alta rotación", category: "Alimentos", image: "/img/proj3.jpg" },
    ],
  };
  return safeFetchJson("/projects", fallback);
}

// ====== TESTIMONIALS ======
async function getTestimonials() {
  // Estructura esperada por Testimonials.jsx:
  // { author, company, quote }
  const fallback = {
    testimonials: [
      { author: "María G.", company: "Retail SA", quote: "Excelente calidad y tiempos." },
      { author: "J. Pérez", company: "Bebidas XYZ", quote: "Diseños que venden." },
      { author: "Lucía R.", company: "Cosmética Pro", quote: "Equipo muy profesional." },
    ],
  };
  return safeFetchJson("/testimonials", fallback);
}

// ====== CONTACT ======
async function submitContact(data) {
  if (!BASE_URL) {
    // Simula éxito sin backend para dev/build
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, message: "Mensaje simulado (sin BACKEND_URL definido)." };
  }
  try {
    const res = await fetch(`${BASE_URL.replace(/\/$/, "")}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json().catch(() => ({}));
    return { success: true, message: json?.message || "¡Gracias! Te contactaremos a la brevedad." };
  } catch (err) {
    return { success: false, message: err?.message || "Error de red" };
  }
}

export const api = { getServices, getProjects, getTestimonials, submitContact };
