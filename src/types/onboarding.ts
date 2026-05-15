import type { ComponentType } from 'react';

export type StepKey = 'form' | 'gmail' | 'whatsapp' | 'redes' | 'dominio';

export interface StepsState {
  form: boolean;
  gmail: boolean;
  whatsapp: boolean;
  redes: boolean;
  dominio: boolean | null;
}

export interface FormData {
  empresa: string;
  rubro: string;
  produto: string;
  publico: string;
  tono: string;
  problema: string;
  resultado: string;
  diferenciador: string;
  objecion: string;
  cta: string;
  primary: string;
  secondary: string;
  logoName: string;
  logoBase64?: string;
  telefono: string;
  email: string;
  web: string;
  instagram: string;
  facebook: string;
  whats: string;
  meet: string;
  cal_nombre: string;
  cal_duracion: string;
  cal_reunion: string;
  cal_max_dia: string;
  cal_gestion: string;
  cal_omitir: boolean;
}

export interface OnboardingState {
  locationId: string;
  businessName: string;
  contactName: string;
  lastCheck: string;
  steps: StepsState;
  form: FormData;
  setStep: (key: StepKey, value: boolean) => void;
  setForm: (data: Partial<FormData>) => void;
  patch: (data: Partial<Omit<OnboardingState, 'setStep' | 'setForm' | 'patch'>>) => void;
}

export interface StepMeta {
  key: StepKey;
  idx: number;
  title: string;
  desc: string;
  block: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  required: boolean;
  route: string;
}

export interface OnboardingLoadResponse {
  nombre_empresa?: string;
  nombre_contacto?: string;
  sector?: string;
  produto?: string;
  producto?: string;
  publico?: string;
  problema?: string;
  resultado?: string;
  diferenciador?: string;
  objecion?: string;
  cta?: string;
  tono?: string;
  color_primario?: string;
  color_secundario?: string;
  logo?: string;
  telefono?: string;
  onboarding_email?: string;
  sitio_web?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  validador_correo?: string;
  validador_whatsapp?: string;
  validador_redes?: string;
  validador_dominio?: string;
  cal_nombre?: string;
  cal_duracion?: string;
  cal_reunion?: string;
  cal_max_dia?: string;
  cal_gestion?: string;
  cal_omitir?: boolean;
}

export interface VerifyCalendarioResponse {
  status: 'ok' | 'error';
  proveedor?: string;
}

export interface VerifyRedesResponse {
  status: 'ok' | 'error';
  red?: string;
  pagina?: string;
  logo?: string;
}

export interface ToastData {
  id: string;
  kind?: 'ok' | 'warn';
  title: string;
  desc?: string;
}
