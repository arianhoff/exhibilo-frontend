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
    const fallback = [
      { id: 1, title: "Diseño de exhibidores", description: "…" },
      { id: 2, title: "Producción POP", description: "…" },
      { id: 3, title: "Instalación en punto de venta", description: "…" },
    ];
    return safeFetchJson("/services", fallback);
  },

  async getProjects() {
    const fallback = [
      { id: 1, title: "Proyecto A", image: `${BASE}placeholder1.jpg` },
      { id: 2, title: "Proyecto B", image: `${BASE}placeholder2.jpg` },
    ];
    return safeFetchJson("/projects", fallback);
  },

  async getTestimonials() {
    const fallback = [
      { id: 1, author: "Cliente 1", text: "Excelente trabajo." },
      { id: 2, author: "Cliente 2", text: "Muy profesionales." },
    ];
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
