import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { n8nClient } from '../lib/n8nClient';
import { useOnboardingStore } from '../store/onboardingStore';
import type { OnboardingLoadResponse } from '../types/onboarding';

const DEFAULT_LOC = import.meta.env.VITE_DEFAULT_LOCATION_ID as string;

export function useOnboardingLoad() {
  const loc = new URLSearchParams(window.location.search).get('loc') ?? DEFAULT_LOC;
  const { setForm, setStep, patch } = useOnboardingStore();

  const query = useQuery({
    queryKey: ['onboarding-load', loc],
    queryFn: () => n8nClient.get<OnboardingLoadResponse>('onboarding-load', { loc }),
    staleTime: 60_000,
    retry: 1,
  });

  useEffect(() => {
    const data = query.data;
    if (!data) return;
    setForm({
      empresa:       data.nombre_empresa    ?? '',
      rubro:         data.sector            ?? '',
      produto:       data.produto ?? data.producto ?? '',
      publico:       data.publico           ?? '',
      tono:          data.tono              || 'cercano',
      primary:       data.color_primario    || '#0F1A2E',
      secondary:     data.color_secundario  || '#D4A14A',
      logoName:      data.logo              ?? '',
      instagram:     data.instagram         ?? '',
      whats:         data.whatsapp          ?? '',
      facebook:      data.facebook          ?? '',
      telefono:      data.telefono          ?? '',
      email:         data.onboarding_email  ?? '',
      web:           data.sitio_web         ?? '',
      problema:      data.problema          ?? '',
      resultado:     data.resultado         ?? '',
      diferenciador: data.diferenciador     ?? '',
      objecion:      data.objecion          ?? '',
      cta:           data.cta               ?? '',
      cal_nombre:    data.cal_nombre        ?? '',
      cal_duracion:  data.cal_duracion      ?? '30',
      cal_reunion:   data.cal_reunion       ?? 'googlemeet',
      cal_max_dia:   data.cal_max_dia       ?? '0',
      cal_gestion:   data.cal_gestion       ?? 'si',
      cal_omitir:    data.cal_omitir        ?? false,
    });
    if (data.validador_correo   !== '') setStep('gmail',    data.validador_correo   === 'si');
    if (data.validador_whatsapp !== '') setStep('whatsapp', data.validador_whatsapp === 'si');
    if (data.validador_redes    !== '') setStep('redes',    data.validador_redes    === 'si');
    if (data.validador_dominio  !== '') setStep('dominio',  data.validador_dominio  === 'si');
    if (data.nombre_contacto) patch({ contactName: data.nombre_contacto });
    if (data.nombre_empresa)  patch({ businessName: data.nombre_empresa });
  }, [query.data]);

  return query;
}
