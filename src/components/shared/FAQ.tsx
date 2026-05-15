import React from 'react';
import { IconChevDown } from '../ui/icons';

interface FAQItem {
  q: string;
  a: string;
}

interface Props {
  items: FAQItem[];
}

export function FAQ({ items }: Props) {
  return (
    <div className="border hairline rounded-xl bg-white overflow-hidden">
      {items.map((it, i) => (
        <details key={i} className={`group ${i > 0 ? 'border-t hairline' : ''}`}>
          <summary className="flex items-center justify-between px-5 py-4 hover:bg-paper-50 transition-colors">
            <span className="text-[15px] font-medium text-navy-900 pr-4">{it.q}</span>
            <IconChevDown size={18} className="chev text-ink-500 flex-shrink-0" />
          </summary>
          <div className="px-5 pb-5 text-sm text-ink-700 leading-relaxed border-t hairline pt-4 bg-paper-50/50">
            {it.a}
          </div>
        </details>
      ))}
    </div>
  );
}

export default FAQ;
