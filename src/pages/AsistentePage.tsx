import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOnboardingStore } from '../store/onboardingStore';
import { SiteFooter } from '../components/layout/SiteFooter';
import { IconArrowLeft, IconSend } from '../components/ui/icons';

type Role = 'assistant' | 'user';

interface Message {
  id: number;
  role: Role;
  text: string;
}

const SUGGESTIONS = [
  'Ver mis leads de hoy',
  '¿Cuántas citas tengo mañana?',
  'Contactos sin respuesta esta semana',
  'Resumen de mi pipeline',
];

const MOCK_REPLIES: Record<string, string> = {
  'Ver mis leads de hoy':
    'Hoy tienes **3 leads nuevos** en tu pipeline: Ana Gómez (Facebook), Carlos Ruiz (Instagram) y Marcela Torres (WhatsApp). ¿Quieres que los agende para una llamada?',
  '¿Cuántas citas tengo mañana?':
    'Mañana tienes **2 citas confirmadas**: una a las 10:00 AM con Luis Herrera y otra a las 3:00 PM con Patricia Silva. Ambas están en Google Meet.',
  'Contactos sin respuesta esta semana':
    'Encontré **5 contactos** que no han respondido en los últimos 7 días. Los más antiguos son: Roberto Mora (hace 6 días) y Diana Pérez (hace 5 días). ¿Quieres que los marque para seguimiento?',
  'Resumen de mi pipeline':
    'Tu pipeline tiene **12 oportunidades activas** por un valor estimado de $480,000. 4 están en etapa de contacto inicial, 5 en negociación y 3 listos para cerrar esta semana.',
};

function getMockReply(text: string): string {
  const key = Object.keys(MOCK_REPLIES).find(k =>
    text.toLowerCase().includes(k.toLowerCase().split(' ')[0])
  );
  return key
    ? MOCK_REPLIES[key]
    : 'Entendido. Estoy consultando tu CRM para darte la información más reciente. *(Esta es una respuesta de demostración — el asistente de IA se conectará en el siguiente paso.)*';
}

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/20 bg-navy-900">
          <img src="/assets/marcelo-logo.png" alt="Marcelo" className="w-full h-full object-contain p-0.5" />
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
          isUser
            ? 'bg-navy-900 text-paper-50 rounded-br-sm'
            : 'bg-white border hairline text-ink-900 rounded-bl-sm'
        }`}
        dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
      />
    </div>
  );
}

export default function AsistentePage() {
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const contactName = useOnboardingStore(s => s.contactName);
  const storeLocationId = useOnboardingStore(s => s.locationId);
  const locId = locationId ?? storeLocationId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  let nextId = useRef(1);

  useEffect(() => {
    const name = contactName || 'broker';
    const welcome = `Hola ${name} 👋 Soy Marcelo, tu asistente de CRM. ¿En qué te puedo ayudar hoy?`;
    setMessages([{ id: nextId.current++, role: 'assistant', text: welcome }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function addUserMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { id: nextId.current++, role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [
        ...prev,
        { id: nextId.current++, role: 'assistant', text: getMockReply(trimmed) },
      ]);
    }, 900 + Math.random() * 600);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addUserMessage(input);
  }

  const showSuggestions = messages.length === 1;

  return (
    <div className="flex flex-col min-h-screen bg-paper-50">
      {/* header */}
      <header className="bg-navy-900 text-paper-50 relative overflow-hidden noise flex-shrink-0">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="max-w-5xl mx-auto px-6 lg:px-10 relative">
          <div className="flex items-center justify-between py-4 border-b border-white/10">
            <a href={`#/${locId}`} className="flex items-center gap-3 group">
              <img src="/assets/marcelo-logo.png" alt="Marcelo" className="w-14 h-14 object-contain" />
              <div className="leading-tight">
                <div className="font-serif text-[18px] text-paper-50">Marcelo <span className="italic text-gold-300">CRM</span></div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-paper-300/70">Portal de onboarding</div>
              </div>
            </a>
            <div className="hidden md:flex items-center gap-3 text-xs text-paper-300/80">
              <span className="font-mono">{locId}</span>
            </div>
          </div>
          <div className="py-6">
            <button
              onClick={() => navigate(`/${locId}`)}
              className="inline-flex items-center gap-1.5 text-xs text-paper-300 hover:text-gold-300 mb-4 transition-colors"
            >
              <IconArrowLeft size={14} /> Volver al checklist
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 p-1">
                <img src="/assets/marcelo-logo.png" alt="Marcelo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-gold-300 mb-0.5">Asistente de IA</div>
                <h1 className="font-serif text-2xl lg:text-[32px] leading-tight">Marcelo</h1>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-ok bg-okbg/20 border border-ok/20 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
                En línea
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* chat area */}
      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-6 lg:px-10 py-8">
        <div className="flex-1 space-y-5 fade-in">
          {messages.map(msg => (
            <Bubble key={msg.id} msg={msg} />
          ))}

          {/* typing indicator */}
          {typing && (
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-navy-900/20 bg-navy-900">
                <img src="/assets/marcelo-logo.png" alt="Marcelo" className="w-full h-full object-contain p-0.5" />
              </div>
              <div className="bg-white border hairline rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* quick suggestions */}
          {showSuggestions && !typing && (
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-[0.14em] text-ink-500 mb-3">Sugerencias rápidas</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => addUserMessage(s)}
                    className="text-[13px] px-4 py-2 rounded-full border hairline-strong bg-white hover:bg-gold-50 hover:border-gold-300 text-navy-900 transition-colors shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* input */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex items-center gap-3 bg-white border hairline rounded-2xl shadow-card px-4 py-3 sticky bottom-6"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu pregunta a Marcelo..."
            disabled={typing}
            className="flex-1 text-[14px] text-navy-900 placeholder:text-ink-400 bg-transparent outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="w-9 h-9 rounded-xl bg-navy-900 text-paper-50 grid place-items-center hover:bg-navy-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <IconSend size={15} />
          </button>
        </form>
      </main>

      <SiteFooter />
    </div>
  );
}
