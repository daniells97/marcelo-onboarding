import React from 'react';
import { IconClock } from '../ui/icons';

interface HeaderProps {
  locationId: string;
  businessName: string;
  contactName: string;
  logoEmpresa: string;
  progress: { done: number; total: number };
  loading: boolean;
}

export function Header({ locationId, businessName, contactName, logoEmpresa, progress, loading }: HeaderProps) {
  const { done, total } = progress;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <header className="bg-navy-900 text-paper-50 relative overflow-hidden noise">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="max-w-6xl mx-auto px-6 lg:px-10 relative">
        <div className="flex items-center justify-between py-4 border-b border-white/10">
          <a href={`#/${locationId}`} className="flex items-center gap-3 group">
            <img src="/assets/marcelo-logo.png" alt="Marcelo" className="w-14 h-14 object-contain" />
            <div className="leading-tight">
              <div className="font-serif text-[18px] text-paper-50">Marcelo <span className="italic text-gold-300">CRM</span></div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-paper-300/70">Portal de onboarding</div>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-3 text-xs text-paper-300/80">
            <span className="font-mono">{locationId}</span>
            <span className="w-1 h-1 rounded-full bg-paper-300/40" />
            <span className="flex items-center gap-1.5"><IconClock size={12} /> Verificado hace 2 h</span>
          </div>
        </div>

        <div className="py-10 lg:py-14 grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="flex gap-6">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-gold-300 mb-3">Hola, {contactName}</div>
                <h1 className="font-serif text-[44px] lg:text-[60px] leading-[1.02] text-paper-50">
                  Conectemos <span className="italic text-gold-300">{businessName || 'la empresa'}</span><br />
                  con las herramientas correctas.
                </h1>
                <p className="mt-5 text-paper-300/90 text-[15px] max-w-xl leading-relaxed">
                  Cinco pasos rápidos para dejar tu CRM listo: integraciones con tus canales de comunicación, fuentes de leads y presencia web. La mayoría toma menos de 5 minutos.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            {logoEmpresa && logoEmpresa.startsWith('http') && (
              <div className="flex justify-center mb-4">
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm inline-flex items-center justify-center">
                  <img src={logoEmpresa} alt="Logo empresa" className="w-28 h-28 object-contain" />
                </div>
              </div>
            )}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="flex items-baseline justify-between mb-3">
                <div className="text-xs uppercase tracking-[0.12em] text-paper-300/80">Progreso general</div>
                <div className="text-xs text-paper-300/60">{pct}%</div>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                {loading ? (
                  <div className="skeleton h-9 w-24" />
                ) : (
                  <>
                    <span className="font-serif text-5xl text-paper-50 num-pill">{done}</span>
                    <span className="text-ink-400/90">/ {total}</span>
                    <span className="ml-2 text-xs text-paper-300/70">pasos completados</span>
                  </>
                )}
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gold-400 transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-3 flex gap-1">
                {Array.from({ length: total }).map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i < done ? 'bg-gold-400' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
