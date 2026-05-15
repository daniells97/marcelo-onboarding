import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOnboardingStore } from '../store/onboardingStore';
import { IconArrowLeft, IconSend, IconFile, IconClock, IconMail, IconSpark } from '../components/ui/icons';

const MAX_CHARS = 500;

type Role = 'assistant' | 'user';

interface Message {
  id: number;
  role: Role;
  text: string;
  time: string;
}

interface SuggestionDef {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  desc: string;
  prompt: string;
}

const SUGGESTIONS: SuggestionDef[] = [
  {
    icon: IconFile,
    title: 'Leads de hoy',
    desc: 'Ver nuevos contactos ingresados hoy',
    prompt: 'Ver mis leads de hoy',
  },
  {
    icon: IconClock,
    title: 'Citas de mañana',
    desc: '¿Cuántas reuniones tengo agendadas?',
    prompt: '¿Cuántas citas tengo mañana?',
  },
  {
    icon: IconMail,
    title: 'Sin respuesta',
    desc: 'Contactos sin respuesta esta semana',
    prompt: 'Contactos sin respuesta esta semana',
  },
  {
    icon: IconSpark,
    title: 'Mi pipeline',
    desc: 'Resumen del estado de mis oportunidades',
    prompt: 'Resumen de mi pipeline',
  },
];

const HERO_CHIPS = [
  '"¿Quién no ha respondido esta semana?"',
  '"Agenda una llamada con Ana Gómez"',
  '"¿Cuántos leads llegaron ayer?"',
];

const MOCK_REPLIES: [string, string][] = [
  [
    'leads',
    'Hoy tienes **3 leads nuevos** en tu pipeline: Ana Gómez (Facebook), Carlos Ruiz (Instagram) y Marcela Torres (WhatsApp). ¿Quieres que los agende para una llamada?',
  ],
  [
    'citas',
    'Mañana tienes **2 citas confirmadas**: una a las 10:00 AM con Luis Herrera y otra a las 3:00 PM con Patricia Silva. Ambas están en Google Meet.',
  ],
  [
    'sin respuesta',
    'Encontré **5 contactos** que no han respondido en los últimos 7 días. Los más antiguos son: Roberto Mora (hace 6 días) y Diana Pérez (hace 5 días). ¿Quieres que los marque para seguimiento?',
  ],
  [
    'pipeline',
    'Tu pipeline tiene **12 oportunidades activas** por un valor estimado de **$480,000**. 4 están en contacto inicial, 5 en negociación y 3 listos para cerrar esta semana.',
  ],
];

function getMockReply(text: string): string {
  const lower = text.toLowerCase();
  const match = MOCK_REPLIES.find(([k]) => lower.includes(k));
  return match
    ? match[1]
    : 'Entendido. Estoy consultando tu CRM para darte la información más reciente. *(Esta es una respuesta de demostración — el asistente de IA se conectará en el siguiente paso.)*';
}

function getTime() {
  return new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

function renderText(raw: string): string {
  return raw
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*\((.+?)\)\*/g, '<span class="italic text-ink-400 text-[13px]">($1)</span>');
}

/* ─── Sub-components ─────────────────────────────────────────── */

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex items-end gap-3 fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-navy-900"
          style={{ boxShadow: '0 0 0 2px rgba(212,161,74,0.25)' }}
        >
          <img src="/assets/marcelo-logo.png" alt="Marcelo" className="w-full h-full object-contain p-0.5" />
        </div>
      )}
      <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`max-w-[72%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
            isUser
              ? 'bg-navy-900 text-paper-50 rounded-br-sm shadow-sm'
              : 'bg-white border hairline text-ink-900 rounded-bl-sm shadow-card'
          }`}
          dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
        />
        <span className="text-[10px] text-ink-400/70 px-1 font-mono">{msg.time}</span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 fade-in">
      <div
        className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-navy-900"
        style={{ boxShadow: '0 0 0 2px rgba(212,161,74,0.25)' }}
      >
        <img src="/assets/marcelo-logo.png" alt="Marcelo" className="w-full h-full object-contain p-0.5" />
      </div>
      <div className="bg-white border hairline rounded-2xl rounded-bl-sm shadow-card px-4 py-3.5 flex gap-1.5 items-center">
        {[0, 150, 300].map(delay => (
          <span
            key={delay}
            className="w-2 h-2 rounded-full bg-gold-400 animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function SuggestionCards({ onSelect }: { onSelect: (p: string) => void }) {
  return (
    <div className="pt-2 fade-in">
      <p className="text-[11px] uppercase tracking-[0.14em] text-ink-500 mb-4">Sugerencias rápidas</p>

      {/* Desktop 2×2 */}
      <div className="hidden sm:grid grid-cols-2 gap-3">
        {SUGGESTIONS.map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.prompt}
              onClick={() => onSelect(s.prompt)}
              className="text-left p-4 rounded-xl border hairline bg-white hover:border-gold-400 hover:shadow-cardHover transition-all group shadow-card"
            >
              <div className="w-9 h-9 rounded-lg bg-paper-100 text-navy-900 grid place-items-center mb-3 group-hover:bg-gold-100 transition-colors">
                <Icon size={18} />
              </div>
              <div className="font-medium text-[13px] text-navy-900 mb-0.5">{s.title}</div>
              <div className="text-[12px] text-ink-500">{s.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        {SUGGESTIONS.map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.prompt}
              onClick={() => onSelect(s.prompt)}
              className="text-left p-4 rounded-xl border hairline bg-white flex-shrink-0 w-44 shadow-card"
            >
              <div className="w-9 h-9 rounded-lg bg-paper-100 text-navy-900 grid place-items-center mb-3">
                <Icon size={18} />
              </div>
              <div className="font-medium text-[13px] text-navy-900 mb-0.5">{s.title}</div>
              <div className="text-[12px] text-ink-500 line-clamp-2">{s.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */

export default function AsistentePage() {
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const contactName = useOnboardingStore(s => s.contactName);
  const storeLocationId = useOnboardingStore(s => s.locationId);
  const locId = locationId ?? storeLocationId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [focused, setFocused] = useState(false);
  const [heroCollapsed, setHeroCollapsed] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  // Welcome message on mount
  useEffect(() => {
    const name = contactName || 'broker';
    const timer = setTimeout(() => {
      setMessages([{
        id: nextId.current++,
        role: 'assistant',
        text: `Hola ${name} 👋 Soy Marcelo, tu asistente de CRM. ¿En qué te puedo ayudar hoy?`,
        time: getTime(),
      }]);
    }, 450);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function addUserMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!heroCollapsed) setHeroCollapsed(true);
    setMessages(prev => [...prev, { id: nextId.current++, role: 'user', text: trimmed, time: getTime() }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [
        ...prev,
        { id: nextId.current++, role: 'assistant', text: getMockReply(trimmed), time: getTime() },
      ]);
    }, 900 + Math.random() * 600);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addUserMessage(input);
  }

  const showSuggestions = messages.length <= 1 && !typing;
  const overLimit = input.length >= MAX_CHARS * 0.8;

  return (
    <div className="flex flex-col min-h-screen bg-paper-50">

      {/* ── STICKY NAV ─────────────────────────────────────────── */}
      <header className="bg-navy-900 text-paper-50 relative overflow-hidden noise flex-shrink-0 sticky top-0 z-30">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="max-w-6xl mx-auto px-6 lg:px-10 relative">
          <div className="flex items-center justify-between py-4">
            <a href={`#/${locId}`} className="flex items-center gap-3">
              <img src="/assets/marcelo-logo.png" alt="Marcelo" className="w-10 h-10 object-contain" />
              <div className="leading-tight">
                <div className="font-serif text-[17px] text-paper-50">
                  Marcelo <span className="italic text-gold-300">CRM</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-paper-300/70">Asistente de IA</div>
              </div>
            </a>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-ok bg-okbg/20 border border-ok/20 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
                En línea
              </div>
              <button
                onClick={() => navigate(`/${locId}`)}
                className="inline-flex items-center gap-1.5 text-xs text-paper-300 hover:text-gold-300 transition-colors"
              >
                <IconArrowLeft size={14} /> Volver
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION (collapses on first message) ─────────── */}
      <div
        className="grid flex-shrink-0 transition-all duration-700 ease-in-out"
        style={{ gridTemplateRows: heroCollapsed ? '0fr' : '1fr' }}
      >
        <div className="overflow-hidden">
          <section className="bg-navy-900 text-paper-50 relative overflow-hidden noise">
            <div className="absolute inset-0 grid-bg opacity-50" />
            <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 lg:py-20 relative">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                {/* Left: copy */}
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-gold-300 mb-5">
                    Asistente de IA · Marcelo CRM
                  </div>
                  <h1 className="font-serif text-[42px] lg:text-[58px] leading-[1.04] text-paper-50 mb-6">
                    Tu CRM,<br />
                    en <span className="italic text-gold-300">lenguaje natural</span>
                  </h1>
                  <p className="text-paper-300/80 text-[15px] lg:text-[16px] leading-relaxed max-w-md">
                    Pregúntame sobre tus leads, citas, conversaciones y pipeline&nbsp;—
                    sin formularios, sin clics.
                  </p>
                </div>

                {/* Right: floating card */}
                <div className="flex justify-center lg:justify-end">
                  <div
                    className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 w-full max-w-sm"
                    style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(212,161,74,0.08)' }}
                  >
                    {/* Avatar + badge */}
                    <div className="flex flex-col items-center gap-3 mb-5">
                      <div
                        className="w-20 h-20 rounded-full bg-navy-800 overflow-hidden"
                        style={{ boxShadow: '0 0 0 3px rgba(212,161,74,0.3), 0 8px 24px rgba(0,0,0,0.3)' }}
                      >
                        <img
                          src="/assets/marcelo-logo.png"
                          alt="Marcelo"
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="text-center">
                        <div className="font-serif text-xl text-paper-50">Marcelo</div>
                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-ok mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
                          En línea
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 mb-4" />

                    {/* Animated chips */}
                    <div className="space-y-2">
                      {HERO_CHIPS.map((chip, i) => (
                        <div
                          key={chip}
                          className="fade-in bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-[12px] text-paper-300/90 font-mono leading-snug"
                          style={{ animationDelay: `${0.4 + i * 0.55}s`, animationFillMode: 'both', opacity: 0 }}
                        >
                          {chip}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Rounded shoulder transition navy → paper */}
          <div className="h-8 bg-navy-900 relative z-10">
            <div className="h-full bg-paper-50 rounded-t-3xl" />
          </div>
        </div>
      </div>

      {/* ── CHAT AREA ──────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 max-w-3xl w-full mx-auto px-4 lg:px-6 py-8 space-y-5">

          {messages.map(msg => (
            <Bubble key={msg.id} msg={msg} />
          ))}

          {typing && <TypingIndicator />}

          {showSuggestions && (
            <SuggestionCards onSelect={addUserMessage} />
          )}

          {/* Spacer so last message isn't hidden behind sticky input */}
          <div ref={bottomRef} className="h-6" />
        </div>
      </main>

      {/* ── STICKY INPUT ───────────────────────────────────────── */}
      <div className="sticky bottom-0 z-20 bg-paper-50/85 backdrop-blur-md border-t hairline">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 py-4">
          <form onSubmit={handleSubmit}>
            <div
              className={`flex items-center gap-3 bg-white rounded-2xl shadow-card px-4 py-3 border transition-colors duration-150 ${
                focused ? 'border-gold-400' : 'hairline'
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value.slice(0, MAX_CHARS))}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Escríbele a Marcelo..."
                disabled={typing}
                className="flex-1 text-[14px] text-navy-900 placeholder:text-ink-400 bg-transparent outline-none disabled:opacity-50"
              />
              {input.length > 0 && (
                <span
                  className={`text-[11px] font-mono flex-shrink-0 transition-colors ${
                    overLimit ? 'text-warn' : 'text-ink-400/60'
                  }`}
                >
                  {input.length}/{MAX_CHARS}
                </span>
              )}
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="w-9 h-9 rounded-xl bg-gold-400 text-navy-900 grid place-items-center hover:bg-gold-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <IconSend size={15} />
              </button>
            </div>
          </form>
          <p className="text-center text-[10px] text-ink-400/50 mt-2">
            Marcelo puede cometer errores. Verifica información importante en tu CRM.
          </p>
        </div>
      </div>
    </div>
  );
}
