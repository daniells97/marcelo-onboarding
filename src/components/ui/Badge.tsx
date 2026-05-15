import React from 'react';

type BadgeTone = 'ok' | 'warn' | 'neutral' | 'gold' | 'navy';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  tone?: BadgeTone;
  size?: BadgeSize;
  children?: React.ReactNode;
}

const tones: Record<BadgeTone, string> = {
  ok:      'bg-okbg text-ok',
  warn:    'bg-warnbg text-warn',
  neutral: 'bg-paper-100 text-ink-700',
  gold:    'bg-gold-100 text-gold-600',
  navy:    'bg-navy-900 text-paper-50',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-[11px] px-2 py-0.5',
};

export function Badge({ tone = 'neutral', size = 'md', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full uppercase tracking-[0.08em] font-medium ${tones[tone]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

export default Badge;
