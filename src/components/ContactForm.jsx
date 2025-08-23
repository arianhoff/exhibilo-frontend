import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Phone, Mail, Send, CheckCircle, LoaderCircle } from 'lucide-react';
import { api } from '../api';
import { toast } from 'sonner';


export const ContactForm = ({ data }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    industry: '',
    message: ''
  });

  const handleInputChange = (name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await api.postContact(values);
      toast.success("¡Mensaje Enviado!", {
        description: "Gracias por contactarnos. Te responderemos a la brevedad."
      });
      setValues({ name: '', company: '', email: '', phone: '', industry: '', message: '' });
    } catch (error) {
      toast.error("Error al enviar el mensaje", {
        description: "Hubo un problema. Por favor, inténtalo de nuevo más tarde."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4">
            Contactanos
          </h2>
          <p className="text-[#555555] text-lg max-w-3xl mx-auto">
            ¡Estamos listos para hacer realidad tu proyecto! 
            Completa el formulario y recibe tu cotización personalizada.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-[#111111] mb-6">
                Hablemos de tu proyecto
              </h3>
              <p className="text-[#555555] text-lg leading-relaxed mb-8">
                Contanos sobre tu marca y tus objetivos. Nuestro equipo te ayudará 
                a encontrar la mejor solución para destacar en el punto de venta.
              </p>
            </div>

            {/* Contact cards */}
            <div className="space-y-4">
              <Card className="border-l-4 border-l-[#FFB800] hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#FFB800]/10 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-[#FFB800]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#111111] mb-1">Teléfono</h4>
                      <p className="text-[#555555]">{data.company.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#FFB800] hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#FFB800]/10 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#FFB800]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#111111] mb-1">Email</h4>
                      <p className="text-[#555555]">{data.company.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#FFB800] hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#FFB800]/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#FFB800]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#111111] mb-1">Dirección</h4>
                      <p className="text-[#555555]">{data.company.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Benefits */}
            <div className="bg-[#F7F7F7] p-6 rounded-2xl">
              <h4 className="font-semibold text-[#111111] mb-4">¿Por qué elegirnos?</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#FFB800]" />
                  <span className="text-[#555555]">Respuesta en menos de 24 horas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#FFB800]" />
                  <span className="text-[#555555]">Cotización gratuita y sin compromiso</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#FFB800]" />
                  <span className="text-[#555555]">Asesoramiento personalizado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#FFB800]" />
                  <span className="text-[#555555]">8 años de experiencia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <Card className="shadow-2xl">
            <CardHeader className="bg-[#FFB800] text-[#111111]">
              <CardTitle className="text-2xl font-bold">
                Solicitar Cotización
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#111111] font-medium">
                      Nombre completo *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={values.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="border-[#555555]/30 focus:border-[#FFB800] focus:ring-[#FFB800]"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-[#111111] font-medium">
                      Empresa *
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      value={values.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="border-[#555555]/30 focus:border-[#FFB800] focus:ring-[#FFB800]"
                      placeholder="Nombre de tu empresa"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#111111] font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={values.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border-[#555555]/30 focus:border-[#FFB800] focus:ring-[#FFB800]"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#111111] font-medium">
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={values.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="border-[#555555]/30 focus:border-[#FFB800] focus:ring-[#FFB800]"
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-[#111111] font-medium">
                    Industria *
                  </Label>
                  <Select name="industry" value={values.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger className="border-[#555555]/30 focus:border-[#FFB800] focus:ring-[#FFB800]">
                      <SelectValue placeholder="Selecciona tu industria" />
                    </SelectTrigger>
                    <SelectContent>
                      {(data?.Form?.industries ?? []).map((industry, index) => (
                        <SelectItem key={index} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[#111111] font-medium">
                    Mensaje *
                  </Label>
                  <Textarea
                    id="message"
                    value={values.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="border-[#555555]/30 focus:border-[#FFB800] focus:ring-[#FFB800] min-h-[120px]"
                    placeholder="Contanos sobre tu proyecto, necesidades específicas, cantidad aproximada, timeline, etc."
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-[#FFB800] hover:bg-[#e6a600] text-[#111111] font-bold py-4 rounded-full transition-all duration-300 hover:scale-105 group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <LoaderCircle className="w-5 h-5 animate-spin" />
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <>
                      Enviar mensaje
                      <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};