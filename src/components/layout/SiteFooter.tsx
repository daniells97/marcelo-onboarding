import React from 'react';

export function SiteFooter() {
  return (
    <footer className="border-t hairline mt-16 py-8">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-ink-500">
        <div className="flex items-center gap-3">
          <span className="font-serif text-sm text-navy-900">Marcelo <span className="italic text-gold-500">CRM</span></span>
          <span>· Portal privado · No comparta su enlace</span>
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-navy-900">Soporte</a>
          <a href="#" className="hover:text-navy-900">WhatsApp: +57 310 482 9105</a>
          <a href="#" className="hover:text-navy-900">Privacidad</a>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
