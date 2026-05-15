import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingState, StepKey, FormData } from '../types/onboarding';

const INITIAL_FORM: FormData = {
  empresa: 'Inmobiliaria Horizonte',
  rubro: 'Bienes raíces residenciales',
  produto: 'Venta y alquiler de propiedades residenciales premium en Medellín y el Valle de Aburrá.',
  publico: 'Familias jóvenes y profesionales entre 30 y 50 años.',
  tono: 'cercano',
  primary: '#0F1A2E',
  secondary: '#D4A14A',
  logoName: 'horizonte-logo.svg',
  telefono: '+57 310 482 9105',
  email: 'contacto@horizonte.co',
  web: 'https://horizonte.co',
  instagram: '@horizonte.propiedades',
  facebook: 'facebook.com/horizontepropiedades',
  whats: '+57 310 482 9105',
  meet: 'https://meet.google.com/horizonte-citas',
  problema: '',
  resultado: '',
  diferenciador: '',
  objecion: '',
  cta: '',
  cal_nombre: '',
  cal_duracion: '30',
  cal_reunion: 'googlemeet',
  cal_max_dia: '0',
  cal_gestion: 'si',
  cal_omitir: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      locationId: 'loc_HRZ2042',
      businessName: '',
      contactName: '',
      lastCheck: 'Hace 2 h · 14:20',
      steps: { form: true, gmail: false, whatsapp: false, redes: false, dominio: null },
      form: INITIAL_FORM,
      setStep: (key: StepKey, value: boolean) =>
        set(s => ({ steps: { ...s.steps, [key]: value } })),
      setForm: (data: Partial<FormData>) =>
        set(s => ({ form: { ...s.form, ...data } })),
      patch: (data) => set(s => ({ ...s, ...data })),
    }),
    { name: 'marcelo_onboarding_v1' }
  )
);
