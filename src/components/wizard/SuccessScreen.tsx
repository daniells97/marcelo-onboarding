import React, { useState, useRef } from 'react';
import { Btn } from '../ui/Btn';
import { IconPlay, IconArrowRight, IconSpark } from '../ui/icons';

interface DraftValues {
  empresa: string;
  [key: string]: unknown;
}

interface SuccessScreenProps {
  draft: DraftValues;
  onDone: () => void;
}

export function SuccessScreen({ draft, onDone }: SuccessScreenProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => {
      if (videoRef.current) videoRef.current.play();
    }, 100);
  };

  return (
    <div className="fade-in text-center pt-8 pb-4">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#E6F2EC" strokeWidth="4" />
          <circle
            cx="50" cy="50" r="46"
            fill="none" stroke="#1F7A5A" strokeWidth="4" strokeLinecap="round"
            strokeDasharray="289" strokeDashoffset="289"
            transform="rotate(-90 50 50)"
            style={{ animation: 'drawCircle 0.7s ease-out forwards' }}
          />
          <polyline
            points="30,52 45,66 72,38"
            fill="none" stroke="#1F7A5A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="60" strokeDashoffset="60"
            style={{ animation: 'drawCheck 0.45s ease-out 0.5s forwards' }}
          />
        </svg>
      </div>

      <div className="text-[11px] uppercase tracking-[0.18em] text-gold-500 mb-2">Formulario enviado</div>
      <h2 className="font-serif text-4xl text-navy-900">¡Listo, {draft.empresa}!</h2>
      <p className="text-ink-500 mt-3 max-w-md mx-auto leading-relaxed">
        Tu información quedó registrada. Empezaremos a personalizar tus plantillas e integraciones según lo que nos contaste.
      </p>

      {/* Video inline */}
      <div className="mt-8 max-w-sm mx-auto rounded-xl overflow-hidden border hairline shadow-card">
        {!playing ? (
          <div onClick={handlePlay} className="relative aspect-video bg-navy-900 cursor-pointer group">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-br from-navy-800/40 via-transparent to-navy-950/60" />
            <div className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-gold-400 opacity-60" />
            <div className="absolute top-8 right-10 w-1 h-1 rounded-full bg-gold-300 opacity-40" />
            <div className="absolute bottom-10 left-10 w-1 h-1 rounded-full bg-gold-400 opacity-50" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <img src="/assets/marcelo-logo.png" alt="Marcelo" className="w-6 h-6 object-contain" />
              <span className="font-serif text-sm text-paper-50">Marcelo <span className="italic text-gold-300">CRM</span></span>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div
                className="w-16 h-16 rounded-full bg-gold-400 text-navy-900 grid place-items-center shadow-lg group-hover:scale-110 group-hover:bg-gold-300 transition-all"
                style={{ boxShadow: '0 0 0 8px rgba(212,161,74,0.2)' }}
              >
                <IconPlay size={22} />
              </div>
              <div className="text-xs uppercase tracking-[0.14em] text-paper-300/80">Ver mensaje</div>
            </div>
            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-paper-300/70 bg-black/30 px-2 py-0.5 rounded">
              0:15
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            src="https://raw.githubusercontent.com/daniells97/videomarcelo/main/video_seccion_1_completado.mp4"
            controls
            autoPlay
            className="w-full aspect-video bg-navy-900"
          />
        )}
        <div className="p-3 bg-white flex items-center justify-between">
          <div className="text-left">
            <div className="text-sm font-medium text-navy-900">Tu siguiente paso</div>
            <div className="text-xs text-ink-500 mt-0.5">Un mensaje importante para ti</div>
          </div>
          {!playing && <IconArrowRight size={16} className="text-ink-500" />}
        </div>
      </div>

      <div className="mt-8 inline-flex items-center gap-3 bg-white border hairline rounded-xl px-5 py-3">
        <span className="w-8 h-8 rounded-md bg-paper-100 grid place-items-center text-navy-900">
          <IconSpark size={16} />
        </span>
        <div className="text-left">
          <div className="text-xs text-ink-500">Siguiente paso sugerido</div>
          <div className="text-sm font-medium text-navy-900">Conectar Gmail / Calendar</div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <Btn kind="outline" onClick={onDone}>Volver al checklist</Btn>
        <Btn
          kind="gold"
          onClick={() => { window.location.hash = `/loc_HRZ2042/gmail`; }}
          iconRight={<IconArrowRight size={16} />}
        >
          Continuar con Gmail
        </Btn>
      </div>
    </div>
  );
}

export default SuccessScreen;
