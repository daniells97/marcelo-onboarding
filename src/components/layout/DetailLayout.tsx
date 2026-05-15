import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboardingStore';
import { SiteFooter } from './SiteFooter';
import { IconArrowLeft, IconCheck, IconAlert } from '../ui/icons';
import { Badge } from '../ui/Badge';
import type { StepMeta } from '../../types/onboarding';

interface DetailLayoutProps {
  step: StepMeta;
  children: React.ReactNode;
}

export function DetailLayout({ step, children }: DetailLayoutProps) {
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const form = useOnboardingStore(s => s.form);
  const storeLocationId = useOnboardingStore(s => s.locationId);
  const steps = useOnboardingStore(s => s.steps);

  const locId = locationId ?? storeLocationId;
  const Icon = step.icon;
  const status = steps[step.key];
  const completed = status === true;

  return (
    <div>
      {/* compact navy header */}
      <header className="bg-navy-900 text-paper-50 relative overflow-hidden noise">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="max-w-5xl mx-auto px-6 lg:px-10 relative">
          <div className="flex items-center justify-between py-4 border-b border-white/10">
            <a href={`#/${locId}`} className="flex items-center gap-3 group">
              <img src="/assets/marcelo-logo.png" alt="Marcelo" className="w-14 h-14 object-contain" />
              {form?.logoName && form.logoName.startsWith('http') && (
                <img src={form.logoName} alt="Logo empresa" className="w-12 h-12 object-contain rounded-md bg-white/10 p-1" />
              )}
              <div className="leading-tight">
                <div className="font-serif text-[18px] text-paper-50">Marcelo <span className="italic text-gold-300">CRM</span></div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-paper-300/70">Portal de onboarding</div>
              </div>
            </a>
            <div className="hidden md:flex items-center gap-3 text-xs text-paper-300/80">
              <span className="font-mono">{locId}</span>
            </div>
          </div>
          <div className="py-6">
            <button
              onClick={() => navigate(`/${locId}`)}
              className="inline-flex items-center gap-1.5 text-xs text-paper-300 hover:text-gold-300 mb-5 transition-colors"
            >
              <IconArrowLeft size={14} /> Volver al checklist
            </button>
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-gold-300 flex-shrink-0">
                <Icon size={26} />
              </div>
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-gold-300 mb-1">Paso 0{step.idx} · {step.block}</div>
                <h1 className="font-serif text-3xl lg:text-[40px] leading-tight">{step.title}</h1>
                <p className="text-paper-300/80 text-sm mt-2 max-w-xl">{step.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        {/* status banner */}
        <div className={`mb-10 rounded-xl border p-5 flex flex-wrap items-center gap-4 ${completed ? 'bg-okbg border-ok/20' : 'bg-warnbg border-warn/20'}`}>
          <div className={`w-10 h-10 rounded-full grid place-items-center ${completed ? 'bg-ok text-white' : 'bg-warn text-white'}`}>
            {completed ? <IconCheck size={18} stroke={3} /> : <IconAlert size={18} stroke={2} />}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className={`text-[11px] uppercase tracking-[0.14em] ${completed ? 'text-ok' : 'text-warn'}`}>
              {completed ? 'Conectado' : 'Pendiente'}
            </div>
            <div className={`font-medium ${completed ? 'text-ok' : 'text-warn'}`}>
              {completed ? 'Conectado correctamente' : 'Pendiente de conexión'}
            </div>
          </div>
          {!step.required && <Badge tone="neutral">Opcional</Badge>}
          {step.required && <Badge tone={completed ? 'ok' : 'warn'}>{completed ? 'Listo' : 'Requerido'}</Badge>}
        </div>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export default DetailLayout;
