import { IconFile, IconMail, IconShare, IconWhats, IconGlobe } from '../components/ui/icons';
import type { StepKey, StepMeta } from '../types/onboarding';

export const STEPS_META: Record<StepKey, StepMeta> = {
  form:     { key:'form',     idx:1, title:'Formulario de onboarding',     desc:'Información base de tu negocio',            block:'Tu negocio',    icon:IconFile,  required:true,  route:'formulario' },
  gmail:    { key:'gmail',    idx:2, title:'Conectar Gmail / Calendar',     desc:'Sincronización de citas y correo',          block:'Comunicación',  icon:IconMail,  required:true,  route:'gmail' },
  redes:    { key:'redes',    idx:3, title:'Conectar Facebook / Instagram', desc:'Entrada de leads desde tus redes sociales', block:'Captación',     icon:IconShare, required:true,  route:'redes' },
  whatsapp: { key:'whatsapp', idx:4, title:'Conectar WhatsApp Business',    desc:'Atención y notificaciones automáticas',     block:'Captación',     icon:IconWhats, required:true,  route:'whatsapp' },
  dominio:  { key:'dominio',  idx:5, title:'Configurar dominio',            desc:'Para tu landing page y funnels',            block:'Presencia web', icon:IconGlobe, required:false, route:'dominio' },
};
