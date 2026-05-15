import React from 'react';

interface InstructionsItem {
  title: string;
  sub?: string;
  code?: string;
  extra?: React.ReactNode;
}

interface Props {
  items: InstructionsItem[];
}

export function InstructionsList({ items }: Props) {
  return (
    <ol className="space-y-0">
      {items.map((it, i) => (
        <li key={i} className="grid grid-cols-[auto,1fr] gap-x-5 gap-y-1 py-5 border-b hairline last:border-b-0">
          <div className="flex flex-col items-center">
            <span className="w-8 h-8 rounded-full bg-navy-900 text-paper-50 grid place-items-center font-serif text-[15px] num-pill">
              {i + 1}
            </span>
            {i < items.length - 1 && <span className="w-px flex-1 mt-1 vert-dash" />}
          </div>
          <div className="pb-1">
            <div className="font-medium text-navy-900 text-[15px]">{it.title}</div>
            {it.sub && <div className="text-sm text-ink-500 mt-1 leading-relaxed">{it.sub}</div>}
            {it.code && (
              <div className="mt-2 inline-flex items-center gap-2 bg-paper-100 border hairline rounded-md px-2.5 py-1.5 text-xs font-mono text-navy-900">
                {it.code}
              </div>
            )}
            {it.extra}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default InstructionsList;
