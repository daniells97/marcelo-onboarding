import React, { useState, useRef, useEffect } from 'react';
import { IconCheck, IconAlert, IconUpload } from '../ui/icons';
import { Btn } from '../ui/Btn';

// ─── Color utilities ───────────────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = (hex || '').replace('#', '').trim();
  const s = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
  return { r: parseInt(s.slice(0, 2), 16), g: parseInt(s.slice(2, 4), 16), b: parseInt(s.slice(4, 6), 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return ('#' + to(r) + to(g) + to(b)).toUpperCase();
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  const sv = max === 0 ? 0 : d / max;
  return { h, s: sv, v: max };
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

// ─── ColorPickerPopover ────────────────────────────────────────────────────────

interface ColorPickerPopoverProps {
  initial: string;
  onApply: (hex: string) => void;
  onClose: () => void;
}

export function ColorPickerPopover({ initial, onApply, onClose }: ColorPickerPopoverProps) {
  const W = 260, H = 150;
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  const satRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  const rgb0 = hexToRgb(initial) || { r: 15, g: 26, b: 46 };
  const hsv0 = rgbToHsv(rgb0.r, rgb0.g, rgb0.b);
  const [h, setH] = useState(hsv0.h);
  const [s, setS] = useState(hsv0.s);
  const [v, setV] = useState(hsv0.v);
  const [hexInput, setHexInput] = useState(initial?.toUpperCase() || '#');

  const rgb = hsvToRgb(h, s, v);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  useEffect(() => { setHexInput(hex); }, [hex]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    const base = hsvToRgb(h, 1, 1);
    ctx.fillStyle = rgbToHex(base.r, base.g, base.b);
    ctx.fillRect(0, 0, W, H);
    const gx = ctx.createLinearGradient(0, 0, W, 0);
    gx.addColorStop(0, 'rgba(255,255,255,1)');
    gx.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gx; ctx.fillRect(0, 0, W, H);
    const gy = ctx.createLinearGradient(0, 0, 0, H);
    gy.addColorStop(0, 'rgba(0,0,0,0)');
    gy.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = gy; ctx.fillRect(0, 0, W, H);
  }, [h]);

  useEffect(() => {
    const c = hueCanvasRef.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, W, 0);
    [0, 60, 120, 180, 240, 300, 360].forEach(stop => {
      const rgb = hsvToRgb(stop % 360, 1, 1);
      g.addColorStop(stop / 360, rgbToHex(rgb.r, rgb.g, rgb.b));
    });
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, 14);
  }, []);

  const pickSat = (e: MouseEvent | React.MouseEvent) => {
    const rect = satRef.current!.getBoundingClientRect();
    const x = Math.max(0, Math.min(W, e.clientX - rect.left));
    const y = Math.max(0, Math.min(H, e.clientY - rect.top));
    setS(x / W); setV(1 - y / H);
  };

  const pickHue = (e: MouseEvent | React.MouseEvent) => {
    const rect = hueRef.current!.getBoundingClientRect();
    const x = Math.max(0, Math.min(W, e.clientX - rect.left));
    setH((x / W) * 360);
  };

  const dragBind = (handler: (e: MouseEvent) => void) => {
    const onMove = (e: MouseEvent) => handler(e);
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    return (e: React.MouseEvent) => {
      handler(e.nativeEvent);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };
  };

  const onHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val.toUpperCase());
    const rgb = hexToRgb(val);
    if (rgb) {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setH(hsv.h); setS(hsv.s); setV(hsv.v);
    }
  };

  const swatches = ['#0F1A2E', '#D4A14A', '#1F7A5A', '#B85C1E', '#F6E9C9', '#FFFFFF', '#334672', '#E3C06A'];

  return (
    <div
      ref={ref}
      className="absolute z-50 top-full mt-2 left-0 bg-navy-900 text-paper-50 rounded-[12px] shadow-cardHover border border-white/10 p-4 w-[292px] fade-in"
      style={{ boxShadow: '0 24px 60px -20px rgba(10,19,34,0.5), 0 8px 20px -8px rgba(10,19,34,0.4)' }}
      onClick={e => e.stopPropagation()}
    >
      <div
        ref={satRef}
        onMouseDown={dragBind(pickSat as unknown as (e: MouseEvent) => void)}
        className="relative cursor-crosshair rounded-lg overflow-hidden select-none"
        style={{ width: W, height: H }}
      >
        <canvas ref={canvasRef} width={W} height={H} className="block" />
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white pointer-events-none"
          style={{
            left: s * W - 8,
            top: (1 - v) * H - 8,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.3)',
            background: hex,
          }}
        />
      </div>

      <div
        ref={hueRef}
        onMouseDown={dragBind(pickHue as unknown as (e: MouseEvent) => void)}
        className="relative mt-3 cursor-pointer rounded-full overflow-hidden select-none"
        style={{ width: W, height: 14 }}
      >
        <canvas ref={hueCanvasRef} width={W} height={14} className="block" />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-navy-900 pointer-events-none"
          style={{
            left: (h / 360) * W - 8,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.4)',
          }}
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="text-[9px] uppercase tracking-[0.14em] text-paper-300/70 mb-1">Hex</div>
          <input
            value={hexInput}
            onChange={onHexInput}
            className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 h-8 text-[13px] font-mono text-paper-50 outline-none focus:border-gold-300 uppercase"
          />
        </div>
        <div className="flex-1">
          <div className="text-[9px] uppercase tracking-[0.14em] text-paper-300/70 mb-1">Antes / Después</div>
          <div className="h-8 rounded-md border border-white/10 overflow-hidden flex">
            <div className="flex-1" style={{ background: initial }} title="Anterior" />
            <div className="flex-1" style={{ background: hex }} title="Nuevo" />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-[9px] uppercase tracking-[0.14em] text-paper-300/70 mb-1.5">Sugeridos</div>
        <div className="flex gap-1.5 flex-wrap">
          {swatches.map(sw => (
            <button
              key={sw}
              type="button"
              onClick={() => {
                const rgb = hexToRgb(sw)!;
                const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                setH(hsv.h); setS(hsv.s); setV(hsv.v);
              }}
              className="w-6 h-6 rounded-md border border-white/15 hover:scale-110 transition-transform"
              style={{ background: sw }}
              aria-label={sw}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-paper-300/80 hover:text-paper-50 px-3 h-9 rounded-md transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onApply(hex)}
          className="inline-flex items-center gap-1.5 bg-gold-400 text-navy-900 text-sm font-medium h-9 px-4 rounded-md hover:bg-gold-300 transition-colors"
        >
          <IconCheck size={14} stroke={2.5} /> Aplicar
        </button>
      </div>
    </div>
  );
}

// ─── FloatingInput ─────────────────────────────────────────────────────────────

interface FloatingInputProps {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string | null | false;
  touched?: boolean;
  required?: boolean;
  type?: string;
  placeholder?: string;
  full?: boolean;
}

export function FloatingInput({
  label, value = '', onChange, onBlur, error, touched, required, type = 'text', placeholder, full,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const floaty = focused || !!value;
  const showOk = touched && !error && !!(value || '').toString().trim();
  const showErr = !!error;
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className={`relative block rounded-md border bg-white transition-all ${showErr ? 'border-warn' : focused ? 'border-navy-700' : 'hairline-strong'}`}>
        <span className={`pointer-events-none absolute left-3 transition-all duration-200 ${
          floaty ? 'top-1 text-[10px] uppercase tracking-[0.12em] text-ink-500' : 'top-1/2 -translate-y-1/2 text-[14px] text-ink-500'
        } ${focused && !showErr ? 'text-navy-700' : ''} ${showErr ? 'text-warn' : ''}`}>
          {label}{required && <span className={showErr ? 'text-warn' : 'text-gold-500'}> *</span>}
        </span>
        <input
          type={type}
          value={value || ''}
          placeholder={floaty ? (placeholder || '') : ''}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.(); }}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-transparent outline-none pt-5 pb-1.5 px-3 pr-9 text-[14px] text-navy-900"
        />
        {showOk && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-ok text-white grid place-items-center">
            <IconCheck size={11} stroke={3} />
          </span>
        )}
        {showErr && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-warn text-white grid place-items-center">
            <IconAlert size={11} stroke={2.5} />
          </span>
        )}
      </label>
      {showErr && (
        <div className="text-xs text-warn mt-1.5 flex items-center gap-1">
          <IconAlert size={11} stroke={2} /> {error}
        </div>
      )}
    </div>
  );
}

// ─── FloatingTextarea ──────────────────────────────────────────────────────────

interface FloatingTextareaProps {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string | null | false;
  touched?: boolean;
  required?: boolean;
  rows?: number;
  full?: boolean;
  placeholder?: string;
}

export function FloatingTextarea({
  label, value = '', onChange, onBlur, error, touched, required, rows = 3, full, placeholder,
}: FloatingTextareaProps) {
  const [focused, setFocused] = useState(false);
  const floaty = focused || !!value;
  const showOk = touched && !error && !!(value || '').toString().trim();
  const showErr = !!error;
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className={`relative block rounded-md border bg-white transition-all ${showErr ? 'border-warn' : focused ? 'border-navy-700' : 'hairline-strong'}`}>
        <span className={`pointer-events-none absolute left-3 transition-all duration-200 ${
          floaty ? 'top-1.5 text-[10px] uppercase tracking-[0.12em] text-ink-500' : 'top-3 text-[14px] text-ink-500'
        } ${focused && !showErr ? 'text-navy-700' : ''} ${showErr ? 'text-warn' : ''}`}>
          {label}{required && <span className={showErr ? 'text-warn' : 'text-gold-500'}> *</span>}
        </span>
        <textarea
          rows={rows}
          value={value || ''}
          placeholder={floaty ? (placeholder || '') : ''}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.(); }}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-transparent outline-none pt-6 pb-2 px-3 pr-9 text-[14px] text-navy-900 resize-none leading-relaxed"
        />
        {showOk && (
          <span className="absolute right-2.5 top-2.5 w-5 h-5 rounded-full bg-ok text-white grid place-items-center">
            <IconCheck size={11} stroke={3} />
          </span>
        )}
        {showErr && (
          <span className="absolute right-2.5 top-2.5 w-5 h-5 rounded-full bg-warn text-white grid place-items-center">
            <IconAlert size={11} stroke={2.5} />
          </span>
        )}
      </label>
      {showErr && (
        <div className="text-xs text-warn mt-1.5 flex items-center gap-1">
          <IconAlert size={11} stroke={2} /> {error}
        </div>
      )}
    </div>
  );
}

// ─── FloatingColor ─────────────────────────────────────────────────────────────

interface FloatingColorProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  touched?: boolean;
}

export function FloatingColor({ label, value, onChange, onBlur, touched }: FloatingColorProps) {
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <label className={`relative block rounded-md border bg-white transition-all ${focused ? 'border-navy-700' : 'hairline-strong'}`}>
        <span className="absolute left-3 top-1 text-[10px] uppercase tracking-[0.12em] text-ink-500">{label}</span>
        <div className="flex items-center gap-3 pt-5 pb-1.5 px-3">
          <button
            type="button"
            onClick={e => { e.preventDefault(); setOpen(o => !o); }}
            aria-label="Abrir selector de color"
            className="w-7 h-7 rounded-md border hairline flex-shrink-0 shadow-inset hover:ring-2 hover:ring-gold-300 transition-all"
            style={{ background: value }}
          />
          <input
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); onBlur?.(); }}
            onChange={e => onChange(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[14px] font-mono text-navy-900 uppercase"
          />
          <button
            type="button"
            onClick={e => { e.preventDefault(); setOpen(o => !o); }}
            className="text-[10px] uppercase tracking-[0.12em] text-ink-500 hover:text-navy-900 transition-colors"
          >
            {open ? 'Cerrar' : 'Elegir'}
          </button>
        </div>
      </label>
      {open && (
        <ColorPickerPopover
          initial={value}
          onClose={() => setOpen(false)}
          onApply={hex => { onChange(hex); setOpen(false); }}
        />
      )}
    </div>
  );
}

// ─── ChipGroup ─────────────────────────────────────────────────────────────────

interface ChipOption {
  id: string;
  label: string;
  desc?: string;
  emoji?: string;
}

interface ChipGroupProps {
  label: string;
  required?: boolean;
  options: ChipOption[];
  onChange: (v: string) => void;
  selectedId?: string;
  error?: string | null | false;
  variant?: 'rubro' | 'tone' | 'chips5' | 'contacto';
}

export function ChipGroup({ label, required, options, onChange, selectedId, error, variant = 'rubro' }: ChipGroupProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-[11px] uppercase tracking-[0.12em] text-ink-500">
          {label}{required && <span className={error ? 'text-warn' : 'text-gold-500'} style={{ letterSpacing: 0 }}> *</span>}
        </div>
        {selectedId && (
          <div className="text-xs text-ok flex items-center gap-1">
            <IconCheck size={12} stroke={2.5} /> Seleccionado
          </div>
        )}
      </div>
      <div className={`grid gap-2.5 ${
        variant === 'tone' ? 'md:grid-cols-2'
          : variant === 'chips5' ? 'sm:grid-cols-3 md:grid-cols-5'
          : 'sm:grid-cols-2 md:grid-cols-4'
      }`}>
        {options.map(opt => {
          const active = opt.id === selectedId;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`text-left p-3.5 rounded-lg border transition-all relative group ${
                active
                  ? 'bg-navy-900 text-paper-50 border-navy-900 shadow-card'
                  : 'bg-white hairline-strong hover:border-navy-500 hover:shadow-card'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  {variant === 'rubro' && (
                    <div className={`font-serif text-xl mb-1 ${active ? 'text-gold-300' : 'text-gold-500'}`}>{opt.emoji}</div>
                  )}
                  <div className={`font-medium text-[14px] ${active ? 'text-paper-50' : 'text-navy-900'}`}>{opt.label}</div>
                  {opt.desc && <div className={`text-xs mt-0.5 ${active ? 'text-paper-300/80' : 'text-ink-500'}`}>{opt.desc}</div>}
                </div>
                <span className={`w-5 h-5 rounded-full border-2 grid place-items-center flex-shrink-0 transition-all ${
                  active ? 'bg-gold-400 border-gold-400' : 'border-paper-300 group-hover:border-navy-500'
                }`}>
                  {active && <IconCheck size={11} stroke={3} />}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {error && (
        <div className="text-xs text-warn mt-2 flex items-center gap-1">
          <IconAlert size={11} stroke={2} /> {error}
        </div>
      )}
    </div>
  );
}

// ─── LogoDropWizard ────────────────────────────────────────────────────────────

interface LogoDropWizardProps {
  fileName: string;
  onChange: (name: string, base64: string) => void;
}

export function LogoDropWizard({ fileName, onChange }: LogoDropWizardProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('El archivo supera los 2 MB. Elige una imagen más pequeña.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onChange(file.name, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="border-2 border-dashed border-gold-300 bg-gold-50/30 rounded-lg p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-md bg-white border hairline grid place-items-center flex-shrink-0 overflow-hidden">
          {preview
            ? <img src={preview} alt="Logo" className="w-full h-full object-contain" />
            : <span className="font-serif text-2xl text-navy-900">IH</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-[0.12em] text-ink-500 mb-0.5">Logo</div>
          <div className="text-[14px] text-navy-900 font-medium truncate">{fileName || 'Sin logo cargado'}</div>
          <div className="text-xs text-ink-500">PNG o SVG · máx 2 MB · fondo transparente</div>
        </div>
        <input
          type="file"
          ref={ref}
          accept="image/png,image/svg+xml,image/jpeg,image/webp"
          className="hidden"
          onChange={e => handleFile(e.target.files?.[0])}
        />
        <Btn kind="outline" size="sm" icon={<IconUpload size={14} />} onClick={() => ref.current?.click()}>
          Reemplazar
        </Btn>
      </div>
      {error && (
        <div className="text-xs text-warn mt-1.5 flex items-center gap-1">
          <IconAlert size={11} stroke={2} /> {error}
        </div>
      )}
    </div>
  );
}

// ─── FormSkeleton ──────────────────────────────────────────────────────────────

interface FormSkeletonProps {
  kind?: 'identidad' | 'voz' | 'contacto' | 'canales';
}

export function FormSkeleton({ kind = 'identidad' }: FormSkeletonProps) {
  const Bar = ({ w = '100%', h = 12, className = '' }: { w?: string | number; h?: number; className?: string }) => (
    <div className={`skeleton ${className}`} style={{ width: w, height: h }} />
  );
  const Field = ({ rows = 1 }: { rows?: number }) => (
    <div className="rounded-md border border-paper-300 bg-paper-50 px-4 pt-4 pb-3" style={{ minHeight: rows > 1 ? 110 : 56 }}>
      <Bar w="38%" h={9} className="mb-3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Bar key={i} w={i === rows - 1 ? '64%' : '92%'} h={10} className={i ? 'mt-2' : ''} />
      ))}
    </div>
  );
  const Chip = () => (
    <div className="rounded-md border border-paper-300 bg-paper-50 p-3.5">
      <Bar w={22} h={14} className="mb-2.5" />
      <Bar w="70%" h={11} className="mb-1.5" />
      <Bar w="55%" h={9} />
    </div>
  );
  const ColorField = () => (
    <div className="rounded-md border border-paper-300 bg-paper-50 px-4 pt-4 pb-3">
      <Bar w="38%" h={9} className="mb-3" />
      <div className="flex items-center gap-3">
        <div className="skeleton rounded-md" style={{ width: 28, height: 28 }} />
        <Bar w="52%" h={11} />
      </div>
    </div>
  );

  if (kind === 'voz') {
    return (
      <div className="mt-8 space-y-8" aria-busy="true" aria-live="polite">
        <div>
          <Bar w={140} h={10} className="mb-3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Chip key={i} />)}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <ColorField /><ColorField />
          <div className="md:col-span-2 rounded-md border border-paper-300 bg-paper-50 p-6">
            <Bar w="32%" h={10} className="mb-3" />
            <div className="border-2 border-dashed border-paper-300 rounded-md p-8 flex flex-col items-center gap-3">
              <div className="skeleton rounded-full" style={{ width: 40, height: 40 }} />
              <Bar w="40%" h={11} />
              <Bar w="28%" h={9} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (kind === 'contacto') {
    return (
      <div className="grid md:grid-cols-2 gap-5 mt-8" aria-busy="true" aria-live="polite">
        <Field /><Field />
        <div className="md:col-span-2"><Field /></div>
      </div>
    );
  }
  if (kind === 'canales') {
    return (
      <div className="grid md:grid-cols-2 gap-5 mt-8" aria-busy="true" aria-live="polite">
        <Field /><Field /><Field /><Field />
      </div>
    );
  }
  // identidad (default)
  return (
    <div className="grid md:grid-cols-2 gap-5 mt-8" aria-busy="true" aria-live="polite">
      <Field />
      <div className="md:col-span-2">
        <Bar w={120} h={10} className="mb-3" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Chip key={i} />)}
        </div>
      </div>
      <div className="md:col-span-2"><Field rows={3} /></div>
      <div className="md:col-span-2"><Field rows={3} /></div>
    </div>
  );
}
