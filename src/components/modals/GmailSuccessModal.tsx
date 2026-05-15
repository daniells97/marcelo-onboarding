import React from 'react';
import { Btn } from '../ui/Btn';
import { IconMail, IconGlobe, IconArrowRight } from '../ui/icons';

interface GmailSuccessModalProps {
  proveedor: string;
  email: string;
  onClose: () => void;
  onNavigateDominio: () => void;
}

export function GmailSuccessModal({ proveedor, email, onClose, onNavigateDominio }: GmailSuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,19,34,0.85)' }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden fade-in"
        style={{ boxShadow: '0 32px 80px -20px rgba(10,19,34,0.6)' }}
      >
        <div style={{ background: '#0F1A2E', padding: '2.5rem 2rem 2rem', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#B68436,#D4A14A,#F6E9C9,#D4A14A,#B68436)', backgroundSize: '200% auto', animation: 'sk 3s linear infinite' }} />

          <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '2px solid rgba(212,161,74,0.5)', animation: 'fade 2s ease-out infinite' }} />
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(212,161,74,0.18)', border: '1.5px solid rgba(212,161,74,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D4A14A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L9.5 8.5 3 9.3l4.5 4.4-1.1 6.3L12 17l5.6 3 -1.1-6.3L21 9.3l-6.5-.8L12 2z" />
              </svg>
            </div>
          </div>

          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#D4A14A', margin: '0 0 8px', fontWeight: 500 }}>Tu primera automatización</p>
          <h2 style={{ fontSize: 24, color: '#FBFAF7', margin: '0 0 10px', lineHeight: 1.2, fontWeight: 500 }}>
            Tu CRM ya está trabajando<br />por ti — sin que hagas nada.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(251,250,247,0.6)', margin: 0 }}>Sin llamadas. Sin coordinación manual. Solo resultados.</p>
        </div>

        <div style={{ padding: '1.75rem 2rem' }}>
          <div style={{ borderLeft: '3px solid #D4A14A', background: '#F5F3EC', borderRadius: '0 8px 8px 0', padding: '1rem 1.25rem', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#E6F2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconMail size={18} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#1A1F2A', margin: '0 0 3px' }}>Correo de agendamiento enviado</p>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                Revisa <strong style={{ color: '#1A1F2A' }}>{email || 'tu correo'}</strong> — tu CRM acaba de confirmar una cita con link de {proveedor} incluido.
              </p>
            </div>
          </div>

          <div style={{ borderLeft: '3px solid #378ADD', background: '#F5F3EC', borderRadius: '0 8px 8px 0', padding: '1rem 1.25rem', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" />
                <rect x="3" y="6" width="12" height="12" rx="2" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#1A1F2A', margin: '0 0 3px' }}>Calendario sincronizado con {proveedor}</p>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Cada cita que llegue tendrá su link único. Tus clientes entran solos — tú solo apareces.</p>
            </div>
          </div>

          <div style={{ borderLeft: '3px solid #B85C1E', background: '#FBF5ED', borderRadius: '0 8px 8px 0', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FBEAD9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconGlobe size={18} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#1A1F2A', margin: '0 0 6px' }}>Ese correo llegó desde un dominio genérico</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 12, background: 'rgba(184,92,30,0.1)', border: '1px solid rgba(184,92,30,0.25)', borderRadius: 4, padding: '2px 8px', color: '#B85C1E', textDecoration: 'line-through' }}>noreply@msgsndr.com</span>
                <IconArrowRight size={13} />
                <span style={{ fontFamily: 'monospace', fontSize: 12, background: 'rgba(31,122,90,0.1)', border: '1px solid rgba(31,122,90,0.25)', borderRadius: 4, padding: '2px 8px', color: '#1F7A5A' }}>citas@tu-empresa.com</span>
              </div>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>El siguiente paso conecta tu dominio — así tus clientes ven tu marca, no la nuestra.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="outline" onClick={() => window.open('https://mail.google.com', '_blank')} icon={<IconMail size={15} />}>
              Ver correo
            </Btn>
            <Btn
              kind="gold"
              size="lg"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={onNavigateDominio}
              iconRight={<IconArrowRight size={16} />}
            >
              Conectar mi dominio
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GmailSuccessModal;
