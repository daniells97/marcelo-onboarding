import React, { useState, useEffect, useMemo, useRef } from 'react';
import { IconArrowRight } from '../ui/icons';

const SPLASH_VIDEO = 'https://raw.githubusercontent.com/daniells97/videomarcelo/main/Cinematic_Brand_Intro_Video_Generation.mp4';

interface SplashScreenProps {
  fadingOut: boolean;
  onContinue: () => void;
}

export function SplashScreen({ fadingOut, onContinue }: SplashScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showBtn, setShowBtn] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowBtn(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const particles = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: 60 + Math.random() * 40,
    size: 2 + Math.random() * 5,
    dur: 6 + Math.random() * 8,
    delay: Math.random() * 6,
    dx: (Math.random() - 0.5) * 120,
    dy: -120 - Math.random() * 180,
  })), []);

  return (
    <div
      className={`fixed inset-0 z-[100] ${fadingOut ? 'splash-fade-out' : 'splash-fade-in'}`}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#0d0d0f' }}
    >
      {/* Video layer */}
      {!videoFailed && (
        <video
          ref={videoRef}
          src={SPLASH_VIDEO}
          autoPlay
          muted
          playsInline
          loop={false}
          onEnded={() => setShowBtn(true)}
          onError={() => setVideoFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center center',
            display: 'block',
            background: '#0d0d0f',
          }}
        />
      )}

      {/* Top mask */}
      {!videoFailed && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '160px', zIndex: 5, background: 'linear-gradient(to bottom, #0d0d0f 0%, #0d0d0f 60%, transparent 100%)', pointerEvents: 'none' }} />
      )}
      {/* Bottom mask */}
      {!videoFailed && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '80px', zIndex: 2, background: 'linear-gradient(to top, #0d0d0f 0%, transparent 100%)', pointerEvents: 'none' }} />
      )}
      {/* Left mask */}
      {!videoFailed && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '15%', height: '100%', zIndex: 2, background: 'linear-gradient(to right, #0d0d0f 0%, transparent 100%)', pointerEvents: 'none' }} />
      )}
      {/* Right mask */}
      {!videoFailed && (
        <div style={{ position: 'absolute', top: 0, right: 0, width: '15%', height: '100%', zIndex: 2, background: 'linear-gradient(to left, #0d0d0f 0%, transparent 100%)', pointerEvents: 'none' }} />
      )}

      {/* Fallback layer */}
      {videoFailed && (
        <div className="absolute inset-0 bg-navy-900 flex items-center justify-center">
          {particles.map(p => (
            <span
              key={p.id}
              className="particle"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
              } as React.CSSProperties}
            />
          ))}
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative text-center">
            <img src="/assets/marcelo-logo.png" alt="Marcelo" className="w-24 h-24 mx-auto object-contain drop-shadow-2xl" />
            <div className="mt-5 font-serif text-paper-50 text-4xl">Marcelo <span className="italic text-gold-300">CRM</span></div>
            <div className="mt-2 text-xs uppercase tracking-[0.2em] text-paper-300/70">Portal de onboarding</div>
          </div>
        </div>
      )}

      {/* Dim overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/30 via-transparent to-navy-950/70 pointer-events-none" />

      {/* Skip */}
      <button
        onClick={onContinue}
        className="absolute top-5 right-6 text-xs uppercase tracking-[0.14em] text-paper-300/80 hover:text-gold-300 transition-colors z-10"
      >
        Omitir →
      </button>

      {/* CTA */}
      {showBtn && (
        <div className="absolute inset-x-0 bottom-16 md:bottom-20 flex justify-center z-10">
          <button
            onClick={onContinue}
            className="btn-rise inline-flex items-center gap-3 bg-gold-400 text-navy-900 font-medium text-[15px] px-7 h-14 rounded-full border-2 border-gold-300 shadow-2xl hover:bg-gold-300 transition-all hover:scale-[1.02]"
            style={{ boxShadow: '0 20px 40px -10px rgba(212,161,74,0.5), 0 0 0 1px rgba(212,161,74,0.3)' }}
          >
            Comenzar configuración
            <IconArrowRight size={18} stroke={2} />
          </button>
        </div>
      )}
    </div>
  );
}

export default SplashScreen;
