import { z } from 'zod';

export function validate(k: string, v: unknown): string | null {
  const s = (v ?? '').toString().trim();
  const REQ = ['empresa','rubro','producto','publico','tono','telefono','email','resultado','cta'];
  if (REQ.includes(k) && !s) return 'Este campo es obligatorio';
  if (k === 'email' && s && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return 'Formato de correo inválido';
  if (k === 'telefono' && s && s.replace(/\D/g,'').length < 7) return 'Número demasiado corto';
  if (k === 'web' && s && !/^https?:\/\//i.test(s)) return 'Debe empezar con http:// o https://';
  return null;
}

export const formSchema = z.object({
  empresa:       z.string().min(1, 'Este campo es obligatorio'),
  rubro:         z.string().min(1, 'Este campo es obligatorio'),
  produto:       z.string().min(1, 'Este campo es obligatorio'),
  publico:       z.string().min(1, 'Este campo es obligatorio'),
  problema:      z.string().optional().default(''),
  resultado:     z.string().min(1, 'Este campo es obligatorio'),
  diferenciador: z.string().optional().default(''),
  objecion:      z.string().optional().default(''),
  cta:           z.string().min(1, 'Este campo es obligatorio'),
  tono:          z.string().min(1, 'Este campo es obligatorio'),
  primary:       z.string().optional().default('#0F1A2E'),
  secondary:     z.string().optional().default('#D4A14A'),
  logoName:      z.string().optional().default(''),
  logoBase64:    z.string().optional(),
  telefono:      z.string().min(7, 'Número demasiado corto'),
  email:         z.string().email('Formato de correo inválido'),
  web:           z.string().refine(v => !v || /^https?:\/\//i.test(v), { message: 'Debe empezar con http:// o https://' }).optional().default(''),
  instagram:     z.string().optional().default(''),
  facebook:      z.string().optional().default(''),
  whats:         z.string().optional().default(''),
  meet:          z.string().optional().default(''),
  cal_nombre:    z.string().optional().default(''),
  cal_duracion:  z.string().default('30'),
  cal_reunion:   z.string().default('googlemeet'),
  cal_max_dia:   z.string().default('0'),
  cal_gestion:   z.string().default('si'),
  cal_omitir:    z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;
