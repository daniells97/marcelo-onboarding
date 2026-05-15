import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOnboardingStore } from '../store/onboardingStore';
import { useOnboardingLoad } from '../hooks/useOnboardingLoad';
import { STEPS_META } from '../constants/steps';
import { Header } from '../components/layout/Header';
import { SiteFooter } from '../components/layout/SiteFooter';
import { SkeletonChecklist } from '../components/shared/SkeletonChecklist';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Btn } from '../components/ui/Btn';
import { StatusIcon } from '../components/ui/StatusIcon';
import { IconArrowRight, IconSpark } from '../components/ui/icons';
import type { StepMeta } from '../types/onboarding';

function StepCard({ meta, status }: { meta: StepMeta; status: boolean | 'error' | null }) {
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const Icon = meta.icon;
  const statusLabel = status === true ? 'Completado' : status === 'error' ? 'Requiere atención' : meta.required ? 'Requerido' : 'Opcional';
  const statusTone = (status === true ? 'ok' : status === 'error' ? 'warn' : meta.required ? 'navy' : 'neutral') as 'ok' | 'warn' | 'navy' | 'neutral';
  const stateClasses = status === true
    ? 'bg-white border-ok/20'
    : status === 'error' ? 'bg-white border-warn/30' : 'bg-white';

  return (
    <Card
      as="button"
      onClick={() => navigate(`/${locationId}/${meta.route}`)}
      hover
      className={`w-full text-left p-5 flex items-center gap-5 group ${stateClasses}`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <StatusIcon status={status} />
          <span className="text-[10px] font-mono text-ink-500 num-pill">0{meta.idx}</span>
        </div>
        <div className="w-px self-stretch vert-dash" />
        <div className="w-11 h-11 rounded-lg bg-paper-100 text-navy-900 grid place-items-center flex-shrink-0 group-hover:bg-gold-100 transition-colors">
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[15px] text-navy-900">{meta.title}</span>
            <Badge tone={statusTone} size="sm">{statusLabel}</Badge>
          </div>
          <div className="text-sm text-ink-500 mt-0.5 truncate">{meta.desc}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-ink-500 group-hover:text-navy-900 transition-colors flex-shrink-0">
        <span className="hidden sm:inline text-xs">{status === true ? 'Ver detalles' : 'Configurar'}</span>
        <IconArrowRight size={16} />
      </div>
    </Card>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const state = useOnboardingStore();

  const query = useOnboardingLoad();
  const loading = query.isLoading;

  const blocks = useMemo(() => {
    const grouped: Record<string, StepMeta[]> = {};
    Object.values(STEPS_META).forEach(m => {
      grouped[m.block] = grouped[m.block] || [];
      grouped[m.block].push(m);
    });
    return Object.entries(grouped);
  }, []);

  const requiredKeys = Object.values(STEPS_META).filter(m => m.required).map(m => m.key);
  const done = requiredKeys.filter(k => state.steps[k] === true).length + (state.steps.dominio === true ? 1 : 0);
  const total = 5;

  const nextPending = useMemo(() => {
    return Object.values(STEPS_META).find(m => m.required && state.steps[m.key] !== true);
  }, [state.steps]);

  return (
    <div>
      <Header
        locationId={locationId ?? state.locationId}
        businessName={state.businessName}
        contactName={state.contactName}
        logoEmpresa={state.form?.logoName || ''}
        progress={{ done, total }}
        loading={loading}
      />
      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        {/* intro row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 pb-6 border-b hairline">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2">Tu checklist</div>
            <h2 className="font-serif text-3xl lg:text-4xl text-navy-900">5 pasos para activar tu cuenta</h2>
          </div>
          {nextPending && (
            <Btn
              kind="gold"
              size="lg"
              onClick={() => navigate(`/${locationId}/${nextPending.route}`)}
              iconRight={<IconArrowRight size={16} />}
            >
              Ver siguiente paso pendiente
            </Btn>
          )}
          {!nextPending && <Badge tone="ok" size="md">Todos los requeridos completos</Badge>}
        </div>

        {loading ? <SkeletonChecklist /> : (
          <div className="space-y-12 fade-in">
            {blocks.map(([blockName, items], bi) => (
              <section key={blockName} className="grid lg:grid-cols-12 gap-6 lg:gap-10">
                <div className="lg:col-span-3">
                  <div className="flex items-start gap-3">
                    <div className="font-serif text-4xl text-gold-400 leading-none num-pill">0{bi + 1}</div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">Bloque</div>
                      <div className="font-serif text-xl text-navy-900 mt-0.5">{blockName}</div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-9 space-y-3">
                  {items.map(meta => (
                    <StepCard key={meta.key} meta={meta} status={state.steps[meta.key] as boolean | 'error' | null} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t hairline flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3 text-sm text-ink-500">
            <div className="mt-0.5 w-7 h-7 rounded-md bg-paper-100 grid place-items-center flex-shrink-0">
              <IconSpark size={14} />
            </div>
            <div>
              <div className="text-ink-700">Verificación automática cada 6 horas</div>
              <div className="text-xs text-ink-500 mt-0.5">
                n8n revisa el estado de tus integraciones y actualiza este panel. Última revisión: {state.lastCheck}.
              </div>
            </div>
          </div>
          <div className="text-xs text-ink-500 font-mono">{locationId ?? state.locationId}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
