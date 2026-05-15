import React from 'react';
import { IconCheck } from '../ui/icons';

interface WizardStep {
  id: string;
  title: string;
  desc: string;
}

interface WizardProgressProps {
  steps: WizardStep[];
  current: number;
  pct: number;
  onJump: (i: number) => void;
}

export function WizardProgress({ steps, current, pct, onJump }: WizardProgressProps) {
  return (
    <div className="-mt-2">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-[11px] uppercase tracking-[0.14em] text-ink-500">Progreso del formulario</div>
        <div className="text-xs text-ink-500 num-pill">{pct}%</div>
      </div>
      <div className="h-1.5 bg-paper-200 rounded-full overflow-hidden relative">
        <div
          className="absolute inset-y-0 left-0 bg-gold-400 rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {steps.map((s, i) => {
          const state = i < current ? 'done' : i === current ? 'active' : 'todo';
          return (
            <button
              key={s.id}
              onClick={() => onJump(i)}
              disabled={i >= current}
              className={`text-left p-3 rounded-lg border transition-all ${
                state === 'active'
                  ? 'bg-navy-900 text-paper-50 border-navy-900'
                  : state === 'done'
                  ? 'bg-white border-ok/30 hover:border-ok text-navy-900'
                  : 'bg-paper-50/50 border-transparent text-ink-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-5 h-5 rounded-full grid place-items-center text-[10px] font-mono ${
                  state === 'active'
                    ? 'bg-gold-400 text-navy-900'
                    : state === 'done'
                    ? 'bg-ok text-white'
                    : 'bg-paper-200 text-ink-500'
                }`}>
                  {state === 'done' ? <IconCheck size={10} stroke={3} /> : i + 1}
                </span>
                <span className={`text-[10px] uppercase tracking-[0.12em] ${state === 'active' ? 'text-gold-300' : ''}`}>
                  {state === 'active' ? 'En curso' : state === 'done' ? 'Completado' : 'Siguiente'}
                </span>
              </div>
              <div className={`text-sm font-medium ${state === 'active' ? 'text-paper-50' : ''}`}>{s.title}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WizardProgress;
