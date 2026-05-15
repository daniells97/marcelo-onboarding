import React from 'react';
import { useMarkDone } from '../../hooks/useMarkDone';
import { useOnboardingStore } from '../../store/onboardingStore';
import { GmailSuccessModal } from '../modals/GmailSuccessModal';
import { RedesSuccessModal } from '../modals/RedesSuccessModal';
import { Btn } from '../ui/Btn';
import { IconCheck } from '../ui/icons';
import type { StepKey } from '../../types/onboarding';

interface DetailActionsProps {
  stepKey: StepKey;
}

export function DetailActions({ stepKey }: DetailActionsProps) {
  const email = useOnboardingStore(s => s.form.email);
  const steps = useOnboardingStore(s => s.steps);
  const completed = steps[stepKey] === true;

  const {
    markDone,
    markUndone,
    verificando,
    showGmailModal,
    setShowGmailModal,
    proveedor,
    showRedesModal,
    setShowRedesModal,
    redesData,
    navigateDominio,
    navigateWhatsapp,
  } = useMarkDone(stepKey);

  return (
    <>
      {showGmailModal && (
        <GmailSuccessModal
          proveedor={proveedor}
          email={email}
          onClose={() => setShowGmailModal(false)}
          onNavigateDominio={navigateDominio}
        />
      )}

      {showRedesModal && (
        <RedesSuccessModal
          pagina={redesData.pagina}
          logo={redesData.logo}
          onClose={() => setShowRedesModal(false)}
          onNavigateWhatsapp={navigateWhatsapp}
        />
      )}

      <div className="mt-10 pt-8 border-t hairline flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-ink-500 max-w-md">
          <span className="text-ink-700 font-medium">¿Problemas?</span> Escríbenos por WhatsApp al{' '}
          <span className="font-mono text-navy-900">+57 310 482 9105</span> y te ayudamos a configurarlo en vivo.
        </div>
        <div className="flex gap-2">
          {completed && (
            <Btn kind="outline" onClick={markUndone}>
              Marcar como pendiente
            </Btn>
          )}
          {!completed && (
            <Btn
              kind="gold"
              size="lg"
              onClick={markDone}
              disabled={verificando}
              icon={
                verificando
                  ? <span className="inline-block w-4 h-4 rounded-full border-2 border-navy-900/30 border-t-navy-900 animate-spin" />
                  : <IconCheck size={16} stroke={2.5} />
              }
            >
              {verificando
                ? 'Verificando conexión…'
                : (stepKey === 'gmail' || stepKey === 'redes')
                  ? 'Verificar y completar'
                  : 'Marcar como completado'}
            </Btn>
          )}
        </div>
      </div>
    </>
  );
}

export default DetailActions;
