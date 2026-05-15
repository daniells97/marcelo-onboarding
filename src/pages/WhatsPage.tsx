import React from 'react';
import { STEPS_META } from '../constants/steps';
import { DetailLayout } from '../components/layout/DetailLayout';
import { DetailActions } from '../components/shared/DetailActions';
import { InstructionsList } from '../components/shared/InstructionsList';
import { VideoCard } from '../components/shared/VideoCard';
import { FAQ } from '../components/shared/FAQ';
import { IconAlert } from '../components/ui/icons';

export default function WhatsPage() {
  const step = STEPS_META.whatsapp;

  return (
    <DetailLayout step={step}>
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <h2 className="font-serif text-2xl text-navy-900 mb-1">Cómo conectarlo</h2>
          <p className="text-sm text-ink-500 mb-4">Tiempo estimado: 10–20 minutos · Requiere verificación Meta Business.</p>
          <InstructionsList items={[
            { title: 'Asegúrate de tener una cuenta de WhatsApp Business activa', sub: 'No confundir con WhatsApp personal. Si aún no la tienes, descarga "WhatsApp Business" y regístrala con el número del negocio.' },
            { title: 'En GoHighLevel, ve a Settings → Phone Numbers', sub: 'Encontrarás la opción en el menú lateral, dentro de la configuración de la subcuenta.' },
            { title: 'Selecciona "WhatsApp" e inicia la verificación', sub: 'El sistema te redirigirá a Meta Business Suite para iniciar el proceso oficial de verificación.' },
            { title: 'Completa Meta Business Verification', sub: 'Meta pedirá documentos de la empresa (RUT, cámara de comercio o equivalente). Revisión promedio: 1–3 días hábiles.' },
            { title: 'Asigna el número a tu subcuenta', sub: 'Cuando Meta apruebe, vuelve al CRM y asigna el número verificado. A partir de ese momento, todos los mensajes entran al panel unificado.' },
          ]} />
        </div>
        <aside className="lg:col-span-5 space-y-6">
          <VideoCard duration="6:18" />
          <div className="rounded-xl border border-warn/20 bg-warnbg p-5">
            <div className="flex items-start gap-3">
              <IconAlert size={18} className="text-warn flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-warn">Este paso toma más tiempo</div>
                <div className="text-xs text-warn/80 mt-1.5 leading-relaxed">
                  La verificación de Meta es externa y puede tardar entre 1 y 3 días hábiles. Puedes continuar con los otros pasos mientras tanto.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <DetailActions stepKey="whatsapp" />
      <div className="mt-14">
        <h2 className="font-serif text-2xl text-navy-900 mb-4">Preguntas frecuentes</h2>
        <FAQ items={[
          { q: '¿Puedo usar el mismo número que ya tengo en WhatsApp?', a: 'Solo si no está activo en WhatsApp personal. Meta requiere que el número esté exclusivamente en WhatsApp Business API. Si ya lo usas en personal, tendrás que desvincularlo primero.' },
          { q: '¿Qué documentos pide Meta para verificar?', a: 'Típicamente: nombre legal del negocio, dirección verificable, sitio web o red social activa, y un documento que pruebe la existencia legal (RUT, cámara de comercio o equivalente).' },
          { q: '¿Cuánto cuesta enviar mensajes desde WhatsApp Business API?', a: 'Meta cobra por conversación según país y tipo (marketing, utilidad, servicio, autenticación). Para Colombia, rondan entre USD $0.005 y $0.04 por conversación. Hay 1000 conversaciones gratis al mes de servicio.' },
          { q: '¿Puedo automatizar respuestas?', a: 'Sí. Una vez conectado, podrás crear flujos automáticos desde el constructor de automatizaciones del CRM.' },
        ]} />
      </div>
    </DetailLayout>
  );
}
