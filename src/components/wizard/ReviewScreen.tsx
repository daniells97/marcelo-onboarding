import React from 'react';
import { TONOS } from '../../constants/rubros';
import { StepHeader } from './StepHeader';
import { Btn } from '../ui/Btn';
import { IconCheck, IconEdit, IconArrowLeft } from '../ui/icons';

interface DraftValues {
  empresa: string;
  rubro: string;
  produto: string;
  publico: string;
  problema: string;
  resultado: string;
  diferenciador: string;
  objecion: string;
  cta: string;
  tono: string;
  primary: string;
  secondary: string;
  logoName: string;
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
  [key: string]: unknown;
}

interface ReviewScreenProps {
  draft: DraftValues;
  onBack: () => void;
  onSubmit: () => void;
  onEdit: (i: number) => void;
}

export function ReviewScreen({ draft, onBack, onSubmit, onEdit }: ReviewScreenProps) {
  const sections = [
    {
      idx: 0, title: 'Identidad del negocio', items: [
        ['Empresa', draft.empresa],
        ['Rubro', draft.rubro],
        ['Producto/servicio', draft.produto],
        ['Público objetivo', draft.publico],
      ] as [string, string, string?][],
    },
    {
      idx: 1, title: 'Tu propuesta de valor', items: [
        ['Problema que resuelves', draft.problema],
        ['Resultado para el cliente', draft.resultado],
        ['Diferenciador', draft.diferenciador],
        ['Principal objeción', draft.objecion],
        ['CTA principal', draft.cta],
      ] as [string, string, string?][],
    },
    {
      idx: 2, title: 'Voz y marca', items: [
        ['Tono', (TONOS.find(t => t.id === draft.tono)?.label) || draft.tono],
        ['Color primario', draft.primary, 'color'],
        ['Color secundario', draft.secondary, 'color'],
        ['Logo', draft.logoName],
      ] as [string, string, string?][],
    },
    {
      idx: 3, title: 'Contacto operativo', items: [
        ['Teléfono', draft.telefono],
        ['Email', draft.email],
        ['Sitio web', draft.web],
      ] as [string, string, string?][],
    },
    {
      idx: 4, title: 'Redes y canales', items: [
        ['Instagram', draft.instagram],
        ['Facebook', draft.facebook],
        ['WhatsApp', draft.whats],
        ['Link de reunión', draft.meet],
      ] as [string, string, string?][],
    },
  ];

  return (
    <div className="fade-in slide-in-right mt-10">
      <StepHeader num="✦" total={4} title="Revisa antes de enviar" desc="Verifica que todo se vea correcto. Puedes editar cualquier sección antes de confirmar." />
      <div className="mt-8 space-y-4">
        {sections.map(s => (
          <div key={s.title} className="bg-white border hairline rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-paper-50 border-b hairline">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-ok text-white grid place-items-center">
                  <IconCheck size={12} stroke={3} />
                </span>
                <div className="font-serif text-[17px] text-navy-900">{s.title}</div>
              </div>
              <button
                onClick={() => onEdit(s.idx)}
                className="text-xs text-navy-900 hover:text-gold-500 inline-flex items-center gap-1.5 transition-colors"
              >
                <IconEdit size={12} /> Editar
              </button>
            </div>
            <dl className="grid md:grid-cols-2 gap-x-6 gap-y-3 px-5 py-4">
              {s.items.map(([k, v, kind]) => (
                <div key={k} className="min-w-0">
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-500">{k}</dt>
                  <dd className="text-[14px] text-navy-900 mt-0.5 flex items-center gap-2 truncate">
                    {kind === 'color' && v && (
                      <span className="w-4 h-4 rounded-sm border hairline flex-shrink-0" style={{ background: v }} />
                    )}
                    <span className="truncate">
                      {v || <span className="text-ink-400 italic">Sin definir</span>}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        {!draft.cal_omitir && draft.cal_nombre && (
          <div className="bg-white border hairline rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-paper-50 border-b hairline">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-ok text-white grid place-items-center">
                  <IconCheck size={12} stroke={3} />
                </span>
                <div className="font-serif text-[17px] text-navy-900">Tu calendario de citas</div>
              </div>
              <button
                onClick={() => onEdit(5)}
                className="text-xs text-navy-900 hover:text-gold-500 inline-flex items-center gap-1.5 transition-colors"
              >
                <IconEdit size={12} /> Editar
              </button>
            </div>
            <dl className="grid md:grid-cols-2 gap-x-6 gap-y-3 px-5 py-4">
              {([
                ['Nombre de la cita', draft.cal_nombre],
                ['Duración', draft.cal_duracion ? `${draft.cal_duracion} min` : ''],
                ['Plataforma', ({ googlemeet: 'Google Meet', zoom: 'Zoom', teams: 'Microsoft Teams', telefono: 'Llamada telefónica', presencial: 'Presencial' } as Record<string, string>)[draft.cal_reunion] || draft.cal_reunion],
                ['Máx. citas por día', draft.cal_max_dia === '0' ? 'Sin límite' : draft.cal_max_dia],
                ['Reagendar/cancelar', draft.cal_gestion === 'si' ? 'Sí, solos' : 'No, me contactan'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-500">{k}</dt>
                  <dd className="text-[14px] text-navy-900 mt-0.5 truncate">
                    {v || <span className="text-ink-400 italic">Sin definir</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
      <div className="mt-8 pt-6 border-t hairline flex items-center justify-between gap-4">
        <Btn kind="ghost" onClick={onBack} icon={<IconArrowLeft size={16} />}>
          Volver al formulario
        </Btn>
        <Btn kind="gold" size="lg" onClick={onSubmit} iconRight={<IconCheck size={16} stroke={2.5} />}>
          Confirmar y enviar
        </Btn>
      </div>
    </div>
  );
}

export default ReviewScreen;
