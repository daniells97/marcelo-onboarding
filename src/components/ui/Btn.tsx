import React from 'react';

type BtnKind = 'primary' | 'gold' | 'ghost' | 'outline' | 'quiet';
type BtnSize = 'sm' | 'md' | 'lg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

interface BtnOwnProps {
  kind?: BtnKind;
  size?: BtnSize;
  as?: React.ElementType;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

const base = 'inline-flex items-center gap-2 justify-center font-medium rounded-md transition-all ring-focus select-none';

const kinds: Record<BtnKind, string> = {
  primary: 'bg-navy-900 text-paper-50 hover:bg-navy-800 shadow-sm',
  gold:    'bg-gold-400 text-navy-900 hover:bg-gold-300 shadow-sm',
  ghost:   'text-ink-700 hover:text-navy-900 hover:bg-paper-100',
  outline: 'border hairline-strong text-navy-900 hover:bg-paper-100',
  quiet:   'text-navy-900 hover:bg-paper-100',
};

const sizes: Record<BtnSize, string> = {
  sm: 'text-xs px-3 h-8',
  md: 'text-sm px-4 h-10',
  lg: 'text-[15px] px-5 h-12',
};

export function Btn({
  kind = 'primary',
  size = 'md',
  as: Cmp = 'button',
  icon,
  iconRight,
  children,
  className = '',
  ...rest
}: BtnOwnProps) {
  const Tag = Cmp as React.ElementType;
  return (
    <Tag className={`${base} ${kinds[kind]} ${sizes[size]} ${className}`} {...(rest as AnyProps)}>
      {icon}{children}{iconRight}
    </Tag>
  );
}

export default Btn;
