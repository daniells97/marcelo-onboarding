import React from 'react';

interface StepHeaderProps {
  num: string | number;
  total: number;
  title: string;
  desc: string;
}

export function StepHeader({ num, total, title, desc }: StepHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="font-serif text-5xl text-gold-400 leading-none num-pill">{num}</div>
      <div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-ink-500">Paso {num} de 0{total}</div>
        <h2 className="font-serif text-3xl text-navy-900 mt-1">{title}</h2>
        <p className="text-sm text-ink-500 mt-2 max-w-xl leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default StepHeader;
