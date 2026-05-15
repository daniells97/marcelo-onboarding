import React from 'react';
import { STEPS_META } from '../constants/steps';
import { DetailLayout } from '../components/layout/DetailLayout';
import { DetailActions } from '../components/shared/DetailActions';
import { InstructionsList } from '../components/shared/InstructionsList';
import { VideoCard } from '../components/shared/VideoCard';
import { FAQ } from '../components/shared/FAQ';

export default function RedesPage() {
  const step = STEPS_META.redes;

  return (
    <DetailLayout step={step}>
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <h2 className="font-serif text-2xl text-navy-900 mb-1">Cómo conectarlo</h2>
          <p className="text-sm text-ink-500 mb-4">Tiempo estimado: 4 minutos · Necesitas ser administrador de la página.</p>
          <InstructionsList items={[
            { title: 'Ve a Settings → Integrations en GoHighLevel', sub: 'Encontrarás integraciones nativas con Facebook e Instagram en la misma sección que Google.' },
            { title: 'Busca "Facebook" y haz clic en Connect', sub: 'Una ventana emergente te llevará al login de Facebook. Permite ventanas emergentes en tu navegador.' },
            { title: 'Inicia sesión con el perfil administrador', sub: 'Importante: debes ser administrador de la Página, no solo editor. Si no lo eres, pide el acceso primero.' },
            { title: 'Selecciona la Página correcta', sub: 'Si administras varias páginas, marca únicamente la del negocio. Puedes conectar más adelante si lo necesitas.' },
            { title: 'Autoriza acceso a Instagram si está vinculado', sub: 'Si tu Instagram está conectado a esa Página como cuenta profesional, aparecerá automáticamente en la misma autorización.' },
          ]} />
        </div>
        <aside className="lg:col-span-5 space-y-6">
          <VideoCard duration="4:12" />
          <div className="rounded-xl bg-paper-100 border hairline p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-500 mb-3">Leads que podrás capturar</div>
            <div className="space-y-2.5 text-sm">
              {[
                { src: 'Formularios de Facebook Lead Ads', desc: 'Entran automáticamente al CRM' },
                { src: 'Mensajes Messenger',              desc: 'Bandeja unificada con WhatsApp y correo' },
                { src: 'DMs de Instagram',                desc: 'Respuestas desde el mismo panel' },
                { src: 'Comentarios en publicaciones',    desc: 'Respuesta privada automatizada (opcional)' },
              ].map(x => (
                <div key={x.src} className="flex items-start gap-2.5">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                  <div>
                    <span className="text-navy-900 font-medium">{x.src}</span>
                    <span className="text-ink-500"> — {x.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
      <DetailActions stepKey="redes" />
      <div className="mt-14">
        <h2 className="font-serif text-2xl text-navy-900 mb-4">Preguntas frecuentes</h2>
        <FAQ items={[
          { q: '¿Qué pasa si no soy administrador de la página?', a: 'No podrás completar la conexión. Pide al administrador actual que te asigne el rol de Admin desde la sección de Roles de Página en Facebook Business Suite.' },
          { q: '¿Necesito tener cuenta profesional de Instagram?', a: 'Sí. Instagram debe estar configurado como cuenta profesional o de creador, y estar vinculado a una Página de Facebook. Puedes cambiarlo gratis desde la app de Instagram.' },
          { q: '¿Se mostrarán mis leads existentes?', a: 'Solo los nuevos que entren a partir de la conexión. Los históricos de Facebook Lead Ads puedes importarlos aparte si lo necesitas.' },
          { q: '¿Qué datos ve el CRM de mis perfiles?', a: 'Únicamente los mensajes, formularios y comentarios públicos que gestionas como página. No accede a tu perfil personal ni a mensajes privados de tu cuenta personal.' },
        ]} />
      </div>
    </DetailLayout>
  );
}
