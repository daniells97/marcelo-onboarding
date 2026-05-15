import React, { useState } from 'react';
import { STEPS_META } from '../constants/steps';
import { DetailLayout } from '../components/layout/DetailLayout';
import { DetailActions } from '../components/shared/DetailActions';
import { InstructionsList } from '../components/shared/InstructionsList';
import { VideoCard } from '../components/shared/VideoCard';
import { FAQ } from '../components/shared/FAQ';
import { Badge } from '../components/ui/Badge';
import { Btn } from '../components/ui/Btn';
import { IconArrowRight, IconArrowLeft, IconGlobe, IconAlert, IconCheck } from '../components/ui/icons';

const DEFAULT_LOC = import.meta.env.VITE_DEFAULT_LOCATION_ID as string;

const PROVIDERS = [
  { id: 'cloudflare', label: 'Cloudflare' },
  { id: 'hostinger',  label: 'Hostinger' },
  { id: 'godaddy',    label: 'GoDaddy' },
  { id: 'namecheap',  label: 'Namecheap' },
  { id: 'google',     label: 'Google Domains' },
  { id: 'porkbun',    label: 'Porkbun' },
  { id: 'otro',       label: 'Otro' },
];

function DnsRecord({ fields }: { fields: [string, string][] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {fields.map(([k, v]) => (
        <span key={k} className="inline-flex items-center gap-1.5 bg-paper-100 border hairline rounded-md px-2.5 py-1.5 text-xs font-mono text-navy-900">
          <span className="text-ink-400">{k}:</span> {v}
        </span>
      ))}
    </div>
  );
}

const PROVIDER_STEPS: Record<string, { title: string; sub: string; extra?: React.ReactNode }[]> = {
  cloudflare: [
    { title: 'Ingresa a Cloudflare y selecciona tu dominio', sub: 'Ve a dash.cloudflare.com, inicia sesión y selecciona el dominio que quieres conectar.' },
    { title: 'Ve a DNS → Records → Add Record', sub: 'En el panel izquierdo selecciona DNS, luego haz clic en "Add Record".' },
    { title: 'Crea el registro CNAME con estos valores', sub: '', extra: <DnsRecord fields={[['Type','CNAME'],['Name','@ (o www)'],['Target','hosted.gohighlevel.com'],['Proxy','OFF — solo DNS']]} /> },
    { title: 'Guarda y espera la propagación', sub: 'Cloudflare es muy rápido: propagación en 1–5 minutos en la mayoría de los casos.' },
    { title: 'Verifica en tu CRM', sub: 'Ve a Settings → Domains → Add Domain → pega tu dominio → clic en Verify.' },
  ],
  hostinger: [
    { title: 'Ingresa a hPanel y selecciona tu dominio', sub: 'Ve a hpanel.hostinger.com, abre Domains y selecciona el dominio que quieres conectar.' },
    { title: 'Ve a DNS / Zone Editor', sub: 'Busca la sección "DNS / Zone Editor" dentro de las opciones de tu dominio.' },
    { title: 'Agrega el registro CNAME con estos valores', sub: '', extra: <DnsRecord fields={[['Type','CNAME'],['Name','@'],['Points to','hosted.gohighlevel.com'],['TTL','3600']]} /> },
    { title: 'Guarda y espera la propagación', sub: 'La propagación tarda aproximadamente 30 minutos en Hostinger.' },
    { title: 'Verifica en tu CRM', sub: 'Ve a Settings → Domains → Add Domain → pega tu dominio → clic en Verify.' },
  ],
  godaddy: [
    { title: 'Ingresa a GoDaddy y abre tus dominios', sub: 'Ve a godaddy.com → My Products → Domains → Manage.' },
    { title: 'Selecciona tu dominio → DNS → Add New Record', sub: 'Haz clic en el dominio, luego en la pestaña DNS y en "Add New Record".' },
    { title: 'Agrega el registro CNAME para www', sub: 'Para el subdominio www:', extra: <DnsRecord fields={[['Type','CNAME'],['Host','www'],['Points to','hosted.gohighlevel.com'],['TTL','1 hour']]} /> },
    { title: 'Para el dominio raíz, consulta soporte', sub: 'GoDaddy requiere un registro tipo A para la raíz (@). La IP de destino cambia; contacta al soporte de Marcelo CRM para obtenerla.' },
    { title: 'Guarda y espera la propagación', sub: 'GoDaddy puede tardar entre 30 minutos y 2 horas.' },
  ],
  namecheap: [
    { title: 'Ingresa a Namecheap → Domain List → Manage', sub: 'Ve a namecheap.com, abre Domain List y haz clic en Manage junto a tu dominio.' },
    { title: 'Abre la pestaña Advanced DNS', sub: 'Haz clic en "Advanced DNS" en la parte superior del panel de tu dominio.' },
    { title: 'Agrega el registro CNAME', sub: 'Haz clic en "Add New Record" y completa los campos:', extra: <DnsRecord fields={[['Type','CNAME Record'],['Host','www'],['Value','hosted.gohighlevel.com'],['TTL','Auto']]} /> },
    { title: 'Guarda y espera la propagación', sub: 'La propagación en Namecheap toma aproximadamente 30 minutos.' },
    { title: 'Verifica en tu CRM', sub: 'Ve a Settings → Domains → Add Domain → pega tu dominio → clic en Verify.' },
  ],
  google: [
    { title: 'Ingresa al panel de tu dominio', sub: 'Ve a domains.google.com (o squarespace.com/domains si tu dominio migró a Squarespace después de 2023).' },
    { title: 'Selecciona tu dominio → DNS → Custom Records', sub: 'Abre la configuración DNS y busca la sección "Custom Records" o "Registros personalizados".' },
    { title: 'Agrega el registro CNAME', sub: 'Crea un nuevo registro con estos valores:', extra: <DnsRecord fields={[['Type','CNAME'],['Host','www'],['Data','hosted.gohighlevel.com']]} /> },
    { title: 'Guarda y espera la propagación', sub: 'La propagación suele tomar entre 15 y 60 minutos.' },
    { title: 'Verifica en tu CRM', sub: 'Ve a Settings → Domains → Add Domain → pega tu dominio → clic en Verify.' },
  ],
  porkbun: [
    { title: 'Ingresa a Porkbun → Account → Domain Management', sub: 'Ve a porkbun.com, inicia sesión y abre Domain Management.' },
    { title: 'Selecciona tu dominio → DNS Records → Edit', sub: 'Haz clic en el botón de edición de DNS del dominio que quieres conectar.' },
    { title: 'Agrega el registro CNAME', sub: 'Completa el formulario con estos valores:', extra: <DnsRecord fields={[['Type','CNAME'],['Host','(vacío para raíz)'],['Answer','hosted.gohighlevel.com'],['TTL','300']]} /> },
    { title: 'Guarda y espera la propagación', sub: 'La propagación en Porkbun toma entre 15 y 30 minutos.' },
    { title: 'Verifica en tu CRM', sub: 'Ve a Settings → Domains → Add Domain → pega tu dominio → clic en Verify.' },
  ],
  otro: [
    { title: 'Ingresa al panel de control de tu proveedor', sub: 'Accede con la cuenta con la que registraste el dominio.' },
    { title: 'Busca la sección de gestión DNS', sub: 'Puede llamarse "DNS", "Zone Editor", "Gestión DNS" o "Advanced DNS". Consulta la ayuda de tu proveedor si no la encuentras.' },
    { title: 'Agrega un registro CNAME apuntando a:', sub: '', extra: <div className="mt-2 inline-flex items-center gap-2 bg-paper-100 border hairline rounded-md px-2.5 py-1.5 text-xs font-mono text-navy-900">hosted.gohighlevel.com</div> },
    { title: 'Espera la propagación', sub: 'El tiempo varía: desde 15 minutos hasta 2 horas según el proveedor.' },
    { title: 'Verifica en tu CRM', sub: 'Ve a Settings → Domains → Add Domain → pega tu dominio → clic en Verify.' },
  ],
};

const FAQ_ITEMS = [
  { q: '¿Puedo usar un subdominio en lugar del dominio principal?',   a: 'Sí, es lo más recomendable. Por ejemplo: "paginas.tu-dominio.com" — así no afectas tu sitio principal si ya tienes uno.' },
  { q: 'Ya tengo página web, ¿la voy a perder?',                      a: 'No, siempre que uses un subdominio diferente. Si conectas el dominio raíz (tu-dominio.com), sustituirá lo que haya ahí. Para no perder tu web, usa un subdominio.' },
  { q: '¿Incluye certificado SSL?',                                   a: 'Sí. Una vez que el dominio queda verificado, el CRM emite automáticamente un certificado SSL gratuito (HTTPS) en cuestión de minutos.' },
  { q: '¿Qué pasa si el dominio tarda más de 2 horas en verificar?', a: 'Usa dnschecker.org para confirmar que el registro CNAME se haya propagado globalmente. Si no aparece, revisa que lo guardaste correctamente en tu proveedor.' },
  { q: '¿Puedo conectar varios dominios?',                            a: 'Sí. Puedes agregar múltiples dominios desde Settings → Domains, útil si manejas diferentes marcas o embudos de venta.' },
  { q: '¿Cuánto cuesta comprar un dominio en Marcelo CRM?',           a: 'El precio varía según la extensión (.com, .co, .net, etc.). Los dominios .com generalmente cuestan entre $12 y $15 USD anuales. Puedes ver los precios exactos al buscar tu dominio en el panel.' },
];

export default function DominioPage() {
  const step = STEPS_META.dominio;
  const loc = new URLSearchParams(window.location.search).get('loc') ?? DEFAULT_LOC;
  const [path, setPath] = useState<null | 'comprar' | 'conectar'>(null);
  const [provider, setProvider] = useState('cloudflare');

  const crmDomainsUrl = `https://app.marcelocrm.com/v2/location/${loc}/settings/domain`;

  function PathCrumb({ label }: { label: string }) {
    return (
      <div className="mb-6 flex items-center gap-2 text-sm">
        <button onClick={() => setPath(null)} className="inline-flex items-center gap-1.5 text-ink-500 hover:text-navy-900 transition-colors">
          <IconArrowLeft size={15} /> Cambiar opción
        </button>
        <span className="text-paper-300">·</span>
        <span className="font-medium text-navy-900">{label}</span>
      </div>
    );
  }

  // PATH SELECTOR
  if (!path) {
    return (
      <DetailLayout step={step}>
        <div className="mb-8">
          <h2 className="font-serif text-2xl text-navy-900 mb-2">¿Cómo quieres configurar tu dominio?</h2>
          <p className="text-sm text-ink-500">Elige una opción para ver las instrucciones paso a paso.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-14">
          {/* Card A — Comprar */}
          <button
            onClick={() => setPath('comprar')}
            className="text-left rounded-xl border-2 border-gold-400 bg-white shadow-card hover:shadow-cardHover transition-all p-6 group"
          >
            <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-600 grid place-items-center mb-4 group-hover:bg-gold-200 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <div className="mb-3"><Badge tone="gold">Recomendado · Más fácil</Badge></div>
            <h3 className="text-[17px] font-semibold text-navy-900 mb-2">Comprar dominio en Marcelo CRM</h3>
            <p className="text-sm text-ink-500 leading-relaxed">Te guiamos para registrar un dominio nuevo directamente desde tu CRM. Incluye configuración automática de correo y DNS.</p>
            <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-gold-600 group-hover:gap-2.5 transition-all">
              Empezar <IconArrowRight size={14} />
            </div>
          </button>

          {/* Card B — Conectar */}
          <button
            onClick={() => setPath('conectar')}
            className="text-left rounded-xl border hairline bg-white shadow-card hover:shadow-cardHover transition-all p-6 group"
          >
            <div className="w-12 h-12 rounded-xl bg-paper-100 text-ink-700 grid place-items-center mb-4 group-hover:bg-paper-200 transition-colors">
              <IconGlobe size={22} />
            </div>
            <div className="mb-3"><Badge tone="neutral">Tengo mi propio dominio</Badge></div>
            <h3 className="text-[17px] font-semibold text-navy-900 mb-2">Conectar dominio existente</h3>
            <p className="text-sm text-ink-500 leading-relaxed">Ya tienes un dominio en GoDaddy, Hostinger, Cloudflare u otro proveedor. Te mostramos cómo apuntarlo a tu CRM.</p>
            <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-navy-900 group-hover:gap-2.5 transition-all">
              Ver instrucciones <IconArrowRight size={14} />
            </div>
          </button>
        </div>

        <DetailActions stepKey="dominio" />
        <div className="mt-14">
          <h2 className="font-serif text-2xl text-navy-900 mb-4">Preguntas frecuentes</h2>
          <FAQ items={FAQ_ITEMS} />
        </div>
      </DetailLayout>
    );
  }

  // PATH A — COMPRAR
  if (path === 'comprar') {
    return (
      <DetailLayout step={step}>
        <PathCrumb label="Comprar en Marcelo CRM" />
        <div className="slide-in-right grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl text-navy-900 mb-1">Compra tu dominio desde el CRM</h2>
            <p className="text-sm text-ink-500 mb-6">Tiempo estimado: 5–10 minutos · Sin configuración técnica necesaria.</p>
            <InstructionsList items={[
              {
                title: 'Busca tu dominio ideal',
                sub: 'Ve a Settings → Domains → Buy Domain. Usa el nombre de tu empresa o marca.',
                extra: (
                  <div className="mt-3 space-y-2">
                    <div>
                      <Btn kind="gold" size="sm" as="a" href={crmDomainsUrl} target="_blank" rel="noopener" iconRight={<IconArrowRight size={14} />}>
                        Ir a Dominios en tu CRM
                      </Btn>
                    </div>
                    <p className="text-xs text-ink-500">Ej: tuempresa.com · tuempresa.co · tuempresa.net</p>
                  </div>
                ),
              },
              {
                title: 'Elige y compra tu dominio',
                sub: 'Selecciona el dominio que prefieras, elige el plan anual (recomendado) y completa el pago. El dominio se activa en 2–5 minutos.',
              },
              {
                title: 'Configura los registros de correo',
                sub: 'Después de comprar, ve a Settings → Domains → clic en tu dominio → Email Settings. Activa SPF, DKIM y DMARC.',
                extra: (
                  <div className="mt-3 rounded-lg bg-warnbg border border-warn/25 p-3.5 flex gap-2.5">
                    <IconAlert size={16} className="text-warn mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-warn leading-relaxed">
                      <strong>Este paso es crítico.</strong> Sin SPF, DKIM y DMARC activos, tus correos caerán en spam o serán rechazados por los servidores de destino.
                    </p>
                  </div>
                ),
              },
              {
                title: '¡Listo! Tu dominio está activo',
                sub: '',
                extra: (
                  <div className="mt-1 rounded-lg bg-okbg border border-ok/25 p-3.5 flex gap-2.5">
                    <IconCheck size={16} className="text-ok mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-ok leading-relaxed">
                      Tu dominio quedará completamente activo en <strong>5–10 minutos</strong>. El correo y las landing pages estarán configurados automáticamente.
                    </p>
                  </div>
                ),
              },
            ]} />
          </div>
          <aside className="lg:col-span-5 space-y-5">
            <VideoCard duration="4:30" />
            <div className="rounded-xl bg-paper-100 border hairline p-5">
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-500 mb-3">¿Por qué comprar aquí?</div>
              <ul className="space-y-2.5">
                {['Configuración automática de DNS y correo', 'Soporte técnico incluido sin costo extra', 'Sin complicaciones técnicas, todo en un clic'].map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                    <IconCheck size={14} className="text-ok mt-0.5 flex-shrink-0" />{b}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        <DetailActions stepKey="dominio" />
        <div className="mt-14">
          <h2 className="font-serif text-2xl text-navy-900 mb-4">Preguntas frecuentes</h2>
          <FAQ items={FAQ_ITEMS} />
        </div>
      </DetailLayout>
    );
  }

  // PATH B — CONECTAR DOMINIO EXISTENTE
  const currentProv = PROVIDERS.find(p => p.id === provider)!;

  return (
    <DetailLayout step={step}>
      <PathCrumb label="Conectar dominio existente" />
      <div className="slide-in-right">
        <h2 className="font-serif text-2xl text-navy-900 mb-1">Conecta tu dominio existente</h2>
        <p className="text-sm text-ink-500 mb-6">Selecciona tu proveedor para ver las instrucciones paso a paso.</p>

        {/* Provider chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {PROVIDERS.map(p => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                provider === p.id
                  ? 'bg-navy-900 text-paper-50 border-navy-900'
                  : 'bg-white text-ink-700 border-paper-300 hover:border-navy-700 hover:text-navy-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h3 className="text-lg font-semibold text-navy-900 mb-5">Instrucciones para {currentProv.label}</h3>
            <InstructionsList items={PROVIDER_STEPS[provider]} />
            <div className="mt-5 rounded-lg bg-warnbg border border-warn/25 p-4 flex gap-2.5">
              <IconAlert size={16} className="text-warn mt-0.5 flex-shrink-0" />
              <p className="text-xs text-warn leading-relaxed">
                <strong>Si después de 2 horas no verifica</strong>, usa{' '}
                <a href="https://dnschecker.org" target="_blank" rel="noopener noreferrer" className="underline font-medium">dnschecker.org</a>
                {' '}para confirmar que el CNAME esté propagado globalmente.
              </p>
            </div>
            <div className="mt-4">
              <Btn kind="outline" size="sm" as="a" href={crmDomainsUrl} target="_blank" rel="noopener" iconRight={<IconArrowRight size={14} />}>
                Ir a Dominios en tu CRM
              </Btn>
            </div>
          </div>

          <aside className="lg:col-span-5 space-y-5">
            <VideoCard duration="4:30" />
            <div className="rounded-xl bg-paper-100 border hairline p-5">
              <div className="text-[11px] uppercase tracking-[0.14em] text-ink-500 mb-2">Destino CNAME (todos los proveedores)</div>
              <div className="bg-white border hairline rounded-md px-2.5 py-1.5 text-xs font-mono text-navy-900 inline-block">
                hosted.gohighlevel.com
              </div>
              <p className="text-xs text-ink-500 mt-2 leading-relaxed">Este valor es igual sin importar tu proveedor de dominio.</p>
            </div>
          </aside>
        </div>
      </div>
      <DetailActions stepKey="dominio" />
      <div className="mt-14">
        <h2 className="font-serif text-2xl text-navy-900 mb-4">Preguntas frecuentes</h2>
        <FAQ items={FAQ_ITEMS} />
      </div>
    </DetailLayout>
  );
}
