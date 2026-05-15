import React from 'react';
import { IconPlay, IconArrowRight } from '../ui/icons';

interface VideoCardProps {
  title?: string;
  duration?: string;
}

export function VideoCard({ title = 'Ver tutorial en video', duration = '3:42' }: VideoCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden border hairline group cursor-pointer">
      <div className="aspect-video bg-navy-900 relative">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800/40 via-transparent to-navy-950/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gold-400 text-navy-900 grid place-items-center shadow-lg group-hover:scale-110 transition-transform">
            <IconPlay size={22} />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 text-[11px] font-mono text-paper-300/80 bg-black/30 px-2 py-0.5 rounded">
          {duration}
        </div>
        <div className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.14em] text-gold-300 bg-navy-900/60 border border-white/10 px-2 py-0.5 rounded">
          Tutorial
        </div>
      </div>
      <div className="p-4 bg-white flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-navy-900">{title}</div>
          <div className="text-xs text-ink-500 mt-0.5">Paso a paso, con ejemplos reales</div>
        </div>
        <IconArrowRight size={16} />
      </div>
    </div>
  );
}

export default VideoCard;
