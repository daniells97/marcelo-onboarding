import React from 'react';
import { Btn } from '../ui/Btn';
import { IconArrowRight } from '../ui/icons';

interface RedesSuccessModalProps {
  pagina: string;
  logo: string;
  onClose: () => void;
  onNavigateWhatsapp: () => void;
}

export function RedesSuccessModal({ pagina, logo, onClose, onNavigateWhatsapp }: RedesSuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,19,34,0.85)' }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden fade-in"
        style={{ boxShadow: '0 32px 80px -20px rgba(10,19,34,0.6)' }}
      >
        {/* Header navy */}
        <div style={{ background: '#0F1A2E', padding: '2.5rem 2rem 2rem', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#B68436,#D4A14A,#F6E9C9,#D4A14A,#B68436)', backgroundSize: '200% auto', animation: 'sk 3s linear infinite' }} />

          <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '2px solid rgba(212,161,74,0.5)', animation: 'fade 2s ease-out infinite' }} />
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(212,161,74,0.18)', border: '1.5px solid rgba(212,161,74,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#D4A14A" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </div>
          </div>

          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#D4A14A', margin: '0 0 8px', fontWeight: 500 }}>Redes sociales conectadas</p>
          <h2 style={{ fontSize: 24, color: '#FBFAF7', margin: '0 0 10px', lineHeight: 1.2, fontWeight: 500 }}>Tu página está conectada</h2>
          <p style={{ fontSize: 14, color: 'rgba(251,250,247,0.6)', margin: 0 }}>Facebook ya está enviando tus leads directo al CRM</p>
        </div>

        {/* Body */}
        <div style={{ padding: '1.75rem 2rem' }}>
          {/* Card verde — página conectada */}
          <div style={{ borderLeft: '3px solid #1F7A5A', background: '#F5F3EC', borderRadius: '0 8px 8px 0', padding: '1rem 1.25rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 8, background: '#E6F2EC', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(31,122,90,0.2)' }}>
              {logo
                ? <img src={logo} alt="Logo página" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F7A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              }
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#1A1F2A', margin: '0 0 2px' }}>Página detectada y conectada</p>
              <p style={{ fontSize: 13, color: '#1F7A5A', margin: 0, fontWeight: 500 }}>{pagina || 'Tu página de Facebook'}</p>
            </div>
          </div>

          {/* Card azul — Instagram tip */}
          <div style={{ borderLeft: '3px solid #378ADD', background: '#F5F3EC', borderRadius: '0 8px 8px 0', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#1A1F2A', margin: '0 0 3px' }}>Valida también Instagram</p>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                Si tu cuenta profesional está vinculada a esta página, los DMs y leads de Instagram también entrarán automáticamente.
              </p>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="outline" onClick={() => window.open('https://facebook.com', '_blank')} icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            }>
              Ver mi página
            </Btn>
            <Btn
              kind="gold"
              size="lg"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={onNavigateWhatsapp}
              iconRight={<IconArrowRight size={16} />}
            >
              Continuar con WhatsApp
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RedesSuccessModal;
