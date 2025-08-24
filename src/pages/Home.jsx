// src/pages/Home.jsx
import { Header } from "@/components/Header.jsx";
import { Hero } from "@/components/Hero.jsx";
import { Services } from "@/components/Services.jsx";
import { ProjectsGrid } from "@/components/ProjectsGrid.jsx";
import { Testimonials } from "@/components/Testimonials.jsx";
import { ClientLogos } from "@/components/ClientLogos.jsx";
import { CTASection } from "@/components/CTASection.jsx";
import { ContactForm } from "@/components/ContactForm.jsx";
import { Footer } from "@/components/Footer.jsx";
import Chuponera from "@/assets/Chuponera.png";
import Exhibilo3DViewer from "../components/Exhibilo3DViewer";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

// 🔧 Datos mínimos para que todos los componentes funcionen.
// Cambiá textos, links e imágenes por los reales cuando quieras.
const siteData = {
  name: "Exhibilo",
  description:
    "Diseño y producción de exhibidores POP, displays y soluciones para retail.",
  address: "Córdoba, Argentina",
  phone: "+54 11 1234-5678",
  email: "ventas@exhibilo.com.ar",
  social: {
    linkedin: "https://www.linkedin.com/company/exhibilo",
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
  },
  hero: {
    title: "Diseño y producción de exhibidores",
    subtitle: "POP, displays y soluciones para retail",
    ctaPrimary: "Contactanos",
    ctaSecondary: "Ver proyectos",
    heroImage: Chuponera, // opcional; poné tu path real o dejalo vacío
  },
  contactForm: {
    industries: ["Retail", "Alimentos", "Bebidas", "Cosmética"],
  },
  clients: [
    { name: "Marca 1", logo: "/logos/m1.svg" },
    { name: "Marca 2", logo: "/logos/m2.svg" },
    { name: "Marca 3", logo: "/logos/m3.svg" },
    { name: "Marca 4", logo: "/logos/m4.svg" },
    { name: "Marca 5", logo: "/logos/m5.svg" },
  ],
};

export default function Home() {
  const location = useLocation();

  // Scroll suave al hash (#proyectos) cuando volvés desde otra página
  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        // Espera un frame para asegurar que todo montó
        requestAnimationFrame(() =>
          target.scrollIntoView({ behavior: "smooth", block: "start" })
        );
      }
    }
  }, [location]);

  return (
    <>
      <Header />
      <main>
        <Hero data={siteData.hero} />
        <Services />            {/* usa api.getServices() con fallback */}
        <ProjectsGrid  />        {/* sección con id="proyectos" */}
        <Exhibilo3DViewer />
        <Testimonials />        {/* usa api.getTestimonials() con fallback */}
        <ClientLogos data={siteData.clients} />
        <CTASection data={{ phone: siteData.phone, email: siteData.email }} />
        <ContactForm
          data={{
            company: {
              phone: siteData.phone,
              email: siteData.email,
              address: siteData.address,
            },
            Form: siteData.contactForm,
          }}
        />
      </main>
      <Footer
        data={{
          name: siteData.name,
          description: siteData.description,
          address: siteData.address,
          social: siteData.social,
          phone: siteData.phone,
          email: siteData.email,
        }}
      />
    </>
  );
}
