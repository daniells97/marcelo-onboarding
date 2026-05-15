import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { STEPS_META } from '../constants/steps';
import { DetailLayout } from '../components/layout/DetailLayout';
import { DetailActions } from '../components/shared/DetailActions';
import { InstructionsList } from '../components/shared/InstructionsList';
import { VideoCard } from '../components/shared/VideoCard';
import { FAQ } from '../components/shared/FAQ';
import { Btn } from '../components/ui/Btn';
import { IconArrowRight, IconCheck } from '../components/ui/icons';

const DEFAULT_LOC = import.meta.env.VITE_DEFAULT_LOCATION_ID as string;

export default function GmailPage() {
  const step = STEPS_META.gmail;
  const { locationId } = useParams<{ locationId: string }>();
  const loc = new URLSearchParams(window.location.search).get('loc') ?? DEFAULT_LOC;
  const [zoomImg, setZoomImg] = useState(false);

  return (
    <DetailLayout step={step}>
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <h2 className="font-serif text-2xl text-navy-900 mb-1">Conecta tu calendario en 3 pasos</h2>
          <p className="text-sm text-ink-500 mb-4">Tiempo estimado: 3 minutos · No requiere conocimientos técnicos.</p>
          <InstructionsList items={[
            {
              title: 'Haz clic en el botón de abajo para ir directo a la sección de Calendarios en tu CRM',
              extra: (
                <div className="mt-3">
                  <Btn
                    as="a"
                    kind="gold"
                    size="lg"
                    iconRight={<IconArrowRight size={16} />}
                    href={`https://app.marcelocrm.com/v2/location/${loc}/settings/calendars/connections`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ir a Integraciones
                  </Btn>
                </div>
              ),
            },
            { title: 'Haz clic en "Añadir nuevo" para agregar tu calendario' },
            { title: 'Conecta tu Calendario de Google y tu plataforma de videoconferencia (Google Meet, Zoom o Teams)' },
          ]} />
          <img
            src="/assets/guia-calendario.png"
            alt="Guía calendario"
            className="w-full rounded-xl border hairline shadow-card mt-4 cursor-zoom-in"
            onClick={() => setZoomImg(true)}
          />
          {zoomImg && (
            <div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
              onClick={() => setZoomImg(false)}
            >
              <img
                src="/assets/guia-calendario.png"
                alt="Guía calendario"
                className="max-w-full max-h-full rounded-xl shadow-2xl"
              />
            </div>
          )}
        </div>
        <aside className="lg:col-span-5 space-y-6">
          <VideoCard duration="3:42" />
          <div className="rounded-xl bg-paper-100 border hairline p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-500 mb-2">Qué obtienes</div>
            <ul className="space-y-2.5 text-sm text-ink-700">
              {[
                'Sincronización de citas con tu calendario',
                'Envío y recepción de correos desde el CRM',
                'Recordatorios automáticos por email',
                'Registro histórico por cada contacto',
              ].map(x => (
                <li key={x} className="flex items-start gap-2.5">
                  <span className="mt-1 w-4 h-4 rounded-full bg-ok/10 text-ok grid place-items-center flex-shrink-0">
                    <IconCheck size={10} stroke={3} />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      <DetailActions stepKey="gmail" />
      <div className="mt-14">
        <h2 className="font-serif text-2xl text-navy-900 mb-4">Preguntas frecuentes</h2>
        <FAQ items={[
          { q: '¿Debo usar mi cuenta personal o la del negocio?', a: 'Siempre la cuenta del negocio. Todas las citas y correos que gestione tu equipo quedarán bajo esa cuenta, y evitarás perder acceso si cambias de correo personal.' },
          { q: '¿Qué permisos estoy otorgando a Google?', a: 'Acceso para leer y enviar correos, y para crear o modificar eventos en el calendario seleccionado. Puedes revocar el acceso cuando quieras desde la sección de seguridad de tu cuenta Google.' },
          { q: '¿Puedo conectar varias cuentas Gmail más adelante?', a: 'Sí. Puedes repetir este proceso con cuentas de asesores individuales desde la misma sección de Integrations.' },
          { q: 'Si cambio de contraseña de Gmail, ¿se desconecta?', a: 'No. La conexión usa un token seguro que sobrevive al cambio de contraseña. Solo se desconecta si revocas el acceso manualmente o lo haces desde el CRM.' },
        ]} />
      </div>
    </DetailLayout>
  );
}
