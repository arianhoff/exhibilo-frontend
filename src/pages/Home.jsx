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

// 🔧 Datos mínimos para que todos los componentes funcionen.
// Cambiá textos, links e imágenes por los reales cuando quieras.
const siteData = {
  name: "Exhibilo",
  description:
    "Diseño y producción de exhibidores POP, displays y soluciones para retail.",
  address: "Buenos Aires, Argentina",
  phone: "+54 11 1234-5678",
  email: "hola@exhibilo.com",
  social: {
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
  },
  hero: {
    title: "Diseño y producción de exhibidores",
    subtitle: "POP, displays y soluciones para retail",
    ctaPrimary: "Contactanos",
    ctaSecondary: "Ver proyectos",
    heroImage: "/hero.png", // opcional; poné tu path real o dejalo vacío
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
  return (
    <>
      <Header />
      <main>
        <Hero data={siteData.hero} />
        <Services />            {/* usa api.getServices() con fallback */}
        <ProjectsGrid />        {/* usa api.getProjects() con fallback */}
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
            contactForm: siteData.contactForm,
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
 