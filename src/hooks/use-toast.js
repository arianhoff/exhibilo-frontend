import { toast as sonnerToast } from "sonner";

// Hook compatible con tu ContactForm (devuelve { toast })
export function useToast() {
  return { toast: sonnerToast };
}
