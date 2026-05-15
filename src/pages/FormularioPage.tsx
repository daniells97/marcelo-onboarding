import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOnboardingStore } from '../store/onboardingStore';
import { useToast } from '../components/ui/Toast';
import { STEPS_META } from '../constants/steps';
import { RUBROS, TONOS, WIZARD_STEPS, STEP_FIELDS } from '../constants/rubros';
import { validate } from '../lib/validators';
import { fireConfetti } from '../lib/confetti';
import { DetailLayout } from '../components/layout/DetailLayout';
import { WizardProgress } from '../components/wizard/WizardProgress';
import { StepHeader } from '../components/wizard/StepHeader';
import { ReviewScreen } from '../components/wizard/ReviewScreen';
import { SuccessScreen } from '../components/wizard/SuccessScreen';
import { SplashScreen } from '../components/wizard/SplashScreen';
import {
  FloatingInput,
  FloatingTextarea,
  FloatingColor,
  ChipGroup,
  LogoDropWizard,
  FormSkeleton,
} from '../components/wizard/FormFields';
import { Btn } from '../components/ui/Btn';
import { IconArrowLeft, IconArrowRight, IconCheck, IconAlert } from '../components/ui/icons';

const BASE_URL = import.meta.env.VITE_N8N_BASE_URL as string;
const DEFAULT_LOC = import.meta.env.VITE_DEFAULT_LOCATION_ID as string;

interface Draft {
  empresa: string;
  rubro: string;
  produto: string;
  publico: string;
  tono: string;
  primary: string;
  secondary: string;
  logoName: string;
  logoBase64?: string;
  telefono: string;
  email: string;
  web: string;
  instagram: string;
  facebook: string;
  whats: string;
  meet: string;
  problema: string;
  resultado: string;
  diferenciador: string;
  objecion: string;
  cta: string;
  cal_nombre: string;
  cal_duracion: string;
  cal_reunion: string;
  cal_max_dia: string;
  cal_gestion: string;
  cal_omitir: boolean;
  [key: string]: unknown;
}

function stepIsValid(stepId: string, draft: Draft): boolean {
  return STEP_FIELDS[stepId].every(k => !validate(k, draft[k]));
}

const EMPTY_DRAFT: Draft = {
  tono: 'cercano',
  empresa: '',
  rubro: '',
  produto: '',
  publico: '',
  problema: '',
  resultado: '',
  diferenciador: '',
  objecion: '',
  cta: '',
  primary: '#0F1A2E',
  secondary: '#D4A14A',
  logoName: '',
  telefono: '',
  email: '',
  web: '',
  instagram: '',
  facebook: '',
  whats: '',
  meet: '',
  cal_nombre: '',
  cal_duracion: '30',
  cal_reunion: 'googlemeet',
  cal_max_dia: '0',
  cal_gestion: 'si',
  cal_omitir: false,
};

export default function FormularioPage() {
  const step = STEPS_META.form;
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const { setForm, setStep, form } = useOnboardingStore();
  const toast = useToast();

  const loc = useMemo(() => {
    try { return new URLSearchParams(window.location.search).get('loc') ?? DEFAULT_LOC; }
    catch { return DEFAULT_LOC; }
  }, []);

  const [draft, setDraft] = useState<Draft>(() => ({ ...EMPTY_DRAFT }));
  const [loading, setLoading] = useState(true);
  const [stepIdx, setStepIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [splashDone, setSplashDone] = useState(() => {
    try { return sessionStorage.getItem('marcelo_splash_done') === '1'; } catch { return false; }
  });
  const [fadingOut, setFadingOut] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    let cancelled = false;
    fetch(`${BASE_URL}/onboarding-load?loc=${encodeURIComponent(loc)}`)
      .then(r => r.json())
      .then((data: Record<string, unknown>) => {
        if (cancelled || !data) return;
        setDraft(prev => ({
          ...prev,
          empresa:       (data.nombre_empresa    ?? prev.empresa    ?? '') as string,
          rubro:         (data.sector            ?? prev.rubro      ?? '') as string,
          produto:       (data.produto           ?? prev.produto    ?? '') as string,
          publico:       (data.publico           ?? prev.publico    ?? '') as string,
          problema:      (data.problema          ?? prev.problema   ?? '') as string,
          resultado:     (data.resultado         ?? prev.resultado  ?? '') as string,
          diferenciador: (data.diferenciador     ?? prev.diferenciador ?? '') as string,
          objecion:      (data.objecion          ?? prev.objecion   ?? '') as string,
          cta:           (data.cta               ?? prev.cta        ?? '') as string,
          tono:          (data.tono              || prev.tono) as string,
          primary:       (data.color_primario    || prev.primary    || '#0F1A2E') as string,
          secondary:     (data.color_secundario  || prev.secondary  || '#D4A14A') as string,
          logoName:      (data.logo              ?? prev.logoName   ?? '') as string,
          telefono:      (data.telefono          ?? prev.telefono   ?? '') as string,
          email:         (data.onboarding_email  ?? prev.email      ?? '') as string,
          web:           (data.sitio_web         ?? prev.web        ?? '') as string,
          instagram:     (data.instagram         ?? prev.instagram  ?? '') as string,
          whats:         (data.whatsapp          ?? prev.whats      ?? '') as string,
          facebook:      (data.facebook          ?? prev.facebook   ?? '') as string,
          cal_nombre:    (data.cal_nombre        ?? prev.cal_nombre    ?? '') as string,
          cal_duracion:  (data.cal_duracion      ?? prev.cal_duracion  ?? '30') as string,
          cal_reunion:   (data.cal_reunion       ?? prev.cal_reunion   ?? 'googlemeet') as string,
          cal_max_dia:   (data.cal_max_dia       ?? prev.cal_max_dia   ?? '0') as string,
          cal_gestion:   (data.cal_gestion       ?? prev.cal_gestion   ?? 'si') as string,
          cal_omitir:    (data.cal_omitir        ?? prev.cal_omitir    ?? false) as boolean,
        }));
      })
      .catch(err => console.error('Error:', err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [loc]);

  const leaveSplash = () => {
    if (fadingOut) return;
    setFadingOut(true);
    setTimeout(() => {
      try { sessionStorage.setItem('marcelo_splash_done', '1'); } catch {}
      setSplashDone(true);
    }, 800);
  };

  if (!splashDone) {
    return <SplashScreen fadingOut={fadingOut} onContinue={leaveSplash} />;
  }

  const inReview = stepIdx === WIZARD_STEPS.length;
  const currentStep = WIZARD_STEPS[stepIdx] || WIZARD_STEPS[WIZARD_STEPS.length - 1];
  const isLast = stepIdx === WIZARD_STEPS.length - 1;
  const canAdvance = loading ? false : (inReview ? true : stepIsValid(currentStep.id, draft));

  const update = (k: string, v: unknown) => {
    setDraft(d => ({ ...d, [k]: v }));
    if (touched[k]) {
      const err = validate(k, v);
      setErrors(e => ({ ...e, [k]: err }));
    }
  };

  const blur = (k: string) => {
    setTouched(t => ({ ...t, [k]: true }));
    setErrors(e => ({ ...e, [k]: validate(k, draft[k]) }));
  };

  const next = async () => {
    const t = { ...touched };
    const e = { ...errors };
    STEP_FIELDS[currentStep.id].forEach(k => { t[k] = true; e[k] = validate(k, draft[k]); });
    setTouched(t); setErrors(e);
    if (!STEP_FIELDS[currentStep.id].every(k => !e[k])) return;

    if (isLast) { setDir(1); setStepIdx(WIZARD_STEPS.length); return; }

    setSaveState('saving');
    fetch(`${BASE_URL}/onboarding-save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationId: loc,
        nombre_empresa: draft.empresa,
        sector: draft.rubro,
        produto: draft.produto,
        publico: draft.publico,
        tono: draft.tono,
        color_primario: draft.primary,
        color_secundario: draft.secondary,
        logo: draft.logoBase64 || draft.logoName || '',
        telefono: draft.telefono,
        email: draft.email,
        sitio_web: draft.web,
        instagram: draft.instagram,
        facebook: draft.facebook,
        whatsapp: draft.whats,
      }),
    })
      .then(() => { setSaveState('saved'); setTimeout(() => setSaveState('idle'), 700); })
      .catch(err => { console.error('Error guardando:', err); setSaveState('error'); setTimeout(() => setSaveState('idle'), 1800); });

    setDir(1); setStepIdx(i => i + 1);
  };

  const back = () => { if (stepIdx === 0) return; setDir(-1); setStepIdx(i => i - 1); };

  const submit = () => {
    setForm({
      empresa: draft.empresa,
      rubro: draft.rubro,
      produto: draft.produto,
      publico: draft.publico,
      tono: draft.tono,
      primary: draft.primary,
      secondary: draft.secondary,
      logoName: draft.logoName,
      logoBase64: draft.logoBase64,
      telefono: draft.telefono,
      email: draft.email,
      web: draft.web,
      instagram: draft.instagram,
      facebook: draft.facebook,
      whats: draft.whats,
      meet: draft.meet,
      problema: draft.problema,
      resultado: draft.resultado,
      diferenciador: draft.diferenciador,
      objecion: draft.objecion,
      cta: draft.cta,
      cal_nombre: draft.cal_nombre,
      cal_duracion: draft.cal_duracion,
      cal_reunion: draft.cal_reunion,
      cal_max_dia: draft.cal_max_dia,
      cal_gestion: draft.cal_gestion,
      cal_omitir: draft.cal_omitir,
    });
    setStep('form', true);

    fetch(`${BASE_URL}/onboarding-save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationId: loc,
        nombre_empresa:   draft.empresa,
        sector:           draft.rubro,
        produto:           draft.produto,
        publico:          draft.publico,
        tono:             draft.tono,
        color_primario:   draft.primary,
        color_secundario: draft.secondary,
        logo:             draft.logoBase64 || draft.logoName || '',
        telefono:         draft.telefono,
        email:            draft.email,
        sitio_web:        draft.web,
        instagram:        draft.instagram,
        facebook:         draft.facebook,
        whatsapp:         draft.whats,
        problema:         draft.problema,
        resultado:        draft.resultado,
        diferenciador:    draft.diferenciador,
        objecion:         draft.objecion,
        cta:              draft.cta,
        cal_nombre:       draft.cal_nombre,
        cal_duracion:     draft.cal_duracion,
        cal_reunion:      draft.cal_reunion,
        cal_max_dia:      draft.cal_max_dia,
        cal_gestion:      draft.cal_gestion,
        cal_omitir:       draft.cal_omitir,
        formulario_completo: true,
      }),
    }).catch(err => console.error('Error en submit final:', err));

    setConfirmed(true);
    fireConfetti();
    toast({ kind: 'ok', title: 'Información enviada', desc: 'Tu formulario quedó registrado.' });
  };

  const pct = confirmed ? 100 : Math.round((stepIdx / WIZARD_STEPS.length) * 100);

  // ─── Build propuesta presets ──────────────────────────────────────────────────
  const r = draft.rubro || '';
  const PROB_PRESETS = r.includes('Consultoría')
    ? ['No saben cómo escalar su negocio','Pierden tiempo en procesos manuales','No tienen claridad en sus números','Les cuesta conseguir clientes']
    : r.includes('Inmobiliaria')
    ? ['No saben en quién confiar','No encuentran la propiedad ideal','Miedo a tomar una mala decisión','Proceso muy complicado']
    : r.includes('Seguros')
    ? ['No entienden qué póliza necesitan','Miedo a pagar de más','No confían en las aseguradoras','Proceso muy burocrático']
    : r.includes('Educación')
    ? ['No tienen tiempo para estudiar','Cursos que no dan resultados reales','No saben por dónde empezar','Precio muy alto']
    : r.includes('Salud')
    ? ['No encuentran un especialista de confianza','Largas esperas para citas','Tratamientos muy costosos','Miedo al diagnóstico']
    : ['Les cuesta conseguir clientes','Procesos ineficientes','No tienen tiempo','Falta de confianza en el mercado'];

  const DIF_PRESETS = ['Experiencia comprobada','Resultados garantizados','Atención personalizada','Precio justo','Metodología propia'];
  const OBJ_PRESETS = ['El precio les parece alto','No confían todavía','Ya lo intentaron antes y no funcionó','No tienen tiempo ahora','No ven la urgencia'];

  const problemaId = PROB_PRESETS.includes(draft.problema) ? draft.problema : (draft.problema ? '__otro_p' : '');
  const difId      = DIF_PRESETS.includes(draft.diferenciador) ? draft.diferenciador : (draft.diferenciador ? '__otro_d' : '');
  const objId      = OBJ_PRESETS.includes(draft.objecion) ? draft.objecion : (draft.objecion ? '__otro_o' : '');

  return (
    <DetailLayout step={step}>
      {!confirmed ? (
        <>
          <WizardProgress steps={WIZARD_STEPS} current={stepIdx} pct={pct} onJump={i => { if (i < stepIdx) { setDir(-1); setStepIdx(i); } }} />

          {inReview ? (
            <ReviewScreen
              draft={draft}
              onBack={() => { setDir(-1); setStepIdx(WIZARD_STEPS.length - 1); }}
              onSubmit={submit}
              onEdit={i => { setDir(-1); setStepIdx(i); }}
            />
          ) : (
            <>
              <div className="relative mt-10" style={{ minHeight: 480 }}>
                <div key={stepIdx} className={`fade-in ${dir > 0 ? 'slide-in-right' : 'slide-in-left'}`}>
                  <StepHeader num={`0${stepIdx + 1}`} total={WIZARD_STEPS.length} title={currentStep.title} desc={currentStep.desc} />

                  {/* IDENTIDAD */}
                  {currentStep.id === 'identidad' && loading && <FormSkeleton kind="identidad" />}
                  {currentStep.id === 'identidad' && !loading && (
                    <div className="grid md:grid-cols-2 gap-5 mt-8">
                      <FloatingInput label="Nombre de la empresa" value={draft.empresa} onChange={v => update('empresa', v)} onBlur={() => blur('empresa')} error={touched.empresa && errors.empresa} touched={touched.empresa} required />
                      <div className="md:col-span-2">
                        <ChipGroup
                          label="Rubro o sector"
                          required
                          options={RUBROS}
                          selectedId={RUBROS.find(r => r.label === draft.rubro)?.id}
                          onChange={v => { update('rubro', RUBROS.find(r => r.id === v)?.label || v); setTouched(t => ({ ...t, rubro: true })); setErrors(e => ({ ...e, rubro: null })); }}
                          error={touched.rubro && errors.rubro}
                        />
                      </div>
                      <FloatingTextarea full label="Producto o servicio principal" value={draft.produto} onChange={v => update('produto', v)} onBlur={() => blur('produto')} error={touched.produto && errors.produto} touched={touched.produto} required rows={3} />
                      <FloatingTextarea full label="Público objetivo" value={draft.publico} onChange={v => update('publico', v)} onBlur={() => blur('publico')} error={touched.publico && errors.publico} touched={touched.publico} required rows={3} />
                    </div>
                  )}

                  {/* PROPUESTA */}
                  {currentStep.id === 'propuesta' && (
                    <div className="mt-8 space-y-8">
                      <div className="space-y-3">
                        <ChipGroup
                          label="¿Cuál es el mayor problema que resuelves?"
                          options={[...PROB_PRESETS.map(l => ({ id: l, label: l })), { id: '__otro_p', label: 'Otro' }]}
                          selectedId={problemaId}
                          onChange={v => update('problema', v === '__otro_p' ? '' : v)}
                          variant="contacto"
                        />
                        {!PROB_PRESETS.includes(draft.problema) && (
                          <FloatingInput label="Describe el problema" value={draft.problema} onChange={v => update('problema', v)} />
                        )}
                      </div>
                      <FloatingTextarea
                        label="¿Qué logra tu cliente después de trabajar contigo?"
                        value={draft.resultado}
                        onChange={v => update('resultado', v)}
                        onBlur={() => blur('resultado')}
                        error={touched.resultado && errors.resultado}
                        touched={touched.resultado}
                        required
                        rows={2}
                        placeholder="Ej: En 90 días duplican sus leads sin aumentar su presupuesto de pauta"
                      />
                      <div className="space-y-3">
                        <ChipGroup
                          label="¿Qué te hace diferente a la competencia?"
                          options={[...DIF_PRESETS.map(l => ({ id: l, label: l })), { id: '__otro_d', label: 'Otro' }]}
                          selectedId={difId}
                          onChange={v => update('diferenciador', v === '__otro_d' ? '' : v)}
                          variant="contacto"
                        />
                        {!DIF_PRESETS.includes(draft.diferenciador) && (
                          <FloatingInput label="Tu diferenciador" value={draft.diferenciador} onChange={v => update('diferenciador', v)} />
                        )}
                      </div>
                      <div className="space-y-3">
                        <ChipGroup
                          label="¿Por qué un cliente duda en contratarte?"
                          options={[...OBJ_PRESETS.map(l => ({ id: l, label: l })), { id: '__otro_o', label: 'Otro' }]}
                          selectedId={objId}
                          onChange={v => update('objecion', v === '__otro_o' ? '' : v)}
                          variant="contacto"
                        />
                        {!OBJ_PRESETS.includes(draft.objecion) && (
                          <FloatingInput label="La principal objeción" value={draft.objecion} onChange={v => update('objecion', v)} />
                        )}
                      </div>
                      <ChipGroup
                        label="¿Qué quieres que haga el cliente cuando esté listo?"
                        required
                        options={[
                          { id: 'Agendar una llamada',   label: 'Agendar una llamada' },
                          { id: 'Solicitar una demo',    label: 'Solicitar una demo' },
                          { id: 'Comprar directamente',  label: 'Comprar directamente' },
                          { id: 'Escribir por WhatsApp', label: 'Escribir por WhatsApp' },
                          { id: 'Visitar mi sitio web',  label: 'Visitar mi sitio web' },
                        ]}
                        selectedId={draft.cta}
                        onChange={v => { update('cta', v); setTouched(t => ({ ...t, cta: true })); setErrors(e => ({ ...e, cta: null })); }}
                        error={touched.cta && errors.cta}
                        variant="contacto"
                      />
                    </div>
                  )}

                  {/* VOZ */}
                  {currentStep.id === 'voz' && loading && <FormSkeleton kind="voz" />}
                  {currentStep.id === 'voz' && !loading && (
                    <div className="mt-8 space-y-8">
                      <ChipGroup
                        label="Tono de comunicación"
                        required
                        options={TONOS}
                        selectedId={draft.tono}
                        onChange={v => { update('tono', v); setTouched(t => ({ ...t, tono: true })); setErrors(e => ({ ...e, tono: null })); }}
                        error={touched.tono && errors.tono}
                        variant="tone"
                      />
                      <div className="grid md:grid-cols-2 gap-5">
                        <FloatingColor label="Color primario" value={draft.primary} onChange={v => update('primary', v)} onBlur={() => blur('primary')} touched={touched.primary} />
                        <FloatingColor label="Color secundario" value={draft.secondary} onChange={v => update('secondary', v)} onBlur={() => blur('secondary')} touched={touched.secondary} />
                        <div className="md:col-span-2">
                          <LogoDropWizard fileName={draft.logoName} onChange={(name, base64) => { update('logoName', name); update('logoBase64', base64); }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CONTACTO */}
                  {currentStep.id === 'contacto' && loading && <FormSkeleton kind="contacto" />}
                  {currentStep.id === 'contacto' && !loading && (
                    <div className="grid md:grid-cols-2 gap-5 mt-8">
                      <FloatingInput label="Teléfono de contacto" type="tel" value={draft.telefono} onChange={v => update('telefono', v)} onBlur={() => blur('telefono')} error={touched.telefono && errors.telefono} touched={touched.telefono} required />
                      <FloatingInput label="Email del negocio" type="email" value={draft.email} onChange={v => update('email', v)} onBlur={() => blur('email')} error={touched.email && errors.email} touched={touched.email} required />
                      <FloatingInput full label="Sitio web" value={draft.web} onChange={v => update('web', v)} onBlur={() => blur('web')} error={touched.web && errors.web} touched={touched.web} placeholder="https://" />
                    </div>
                  )}

                  {/* CANALES */}
                  {currentStep.id === 'canales' && loading && <FormSkeleton kind="canales" />}
                  {currentStep.id === 'canales' && !loading && (
                    <div className="grid md:grid-cols-2 gap-5 mt-8">
                      <FloatingInput label="Instagram" value={draft.instagram} onChange={v => update('instagram', v)} onBlur={() => blur('instagram')} touched={touched.instagram} placeholder="@tu_cuenta" />
                      <FloatingInput label="Facebook" value={draft.facebook} onChange={v => update('facebook', v)} onBlur={() => blur('facebook')} touched={touched.facebook} placeholder="URL de tu página" />
                      <FloatingInput label="WhatsApp de negocio" type="tel" value={draft.whats} onChange={v => update('whats', v)} onBlur={() => blur('whats')} touched={touched.whats} />
                      <FloatingInput label="Link de Zoom / Meet" value={draft.meet} onChange={v => update('meet', v)} onBlur={() => blur('meet')} touched={touched.meet} placeholder="https://" />
                    </div>
                  )}

                  {/* CALENDARIO */}
                  {currentStep.id === 'calendario' && (
                    <div className="mt-6 space-y-8">
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-medium text-ink-500 bg-paper-100 border hairline rounded-full px-3 py-1">Opcional</span>

                      <div className="space-y-3">
                        <ChipGroup
                          label="¿Cómo se llamará esta cita?"
                          options={[
                            { id: 'Consulta gratuita',      label: 'Consulta gratuita' },
                            { id: 'Demo del producto',      label: 'Demo del producto' },
                            { id: 'Asesoría inicial',       label: 'Asesoría inicial' },
                            { id: 'Reunión de seguimiento', label: 'Reunión de seguimiento' },
                            { id: '__otro',                 label: 'Otro' },
                          ]}
                          selectedId={
                            ['Consulta gratuita', 'Demo del producto', 'Asesoría inicial', 'Reunión de seguimiento'].includes(draft.cal_nombre)
                              ? draft.cal_nombre
                              : draft.cal_nombre ? '__otro' : ''
                          }
                          onChange={v => update('cal_nombre', v === '__otro' ? '' : v)}
                          variant="contacto"
                        />
                        {!['Consulta gratuita', 'Demo del producto', 'Asesoría inicial', 'Reunión de seguimiento'].includes(draft.cal_nombre) && (
                          <FloatingInput label="Nombre personalizado de la cita" value={draft.cal_nombre} onChange={v => update('cal_nombre', v)} />
                        )}
                      </div>

                      <ChipGroup
                        label="¿Cuánto dura cada cita?"
                        options={[
                          { id: '15', label: '15 min' },
                          { id: '30', label: '30 min' },
                          { id: '45', label: '45 min' },
                          { id: '60', label: '60 min' },
                          { id: '90', label: '90 min' },
                        ]}
                        selectedId={draft.cal_duracion}
                        onChange={v => update('cal_duracion', v)}
                        variant="chips5"
                      />

                      <ChipGroup
                        label="¿Dónde se reúnen con el cliente?"
                        options={[
                          { id: 'googlemeet', label: 'Google Meet',        desc: 'Videollamada vía Google' },
                          { id: 'zoom',       label: 'Zoom',               desc: 'Videollamada vía Zoom' },
                          { id: 'teams',      label: 'Microsoft Teams',    desc: 'Videollamada vía Teams' },
                          { id: 'telefono',   label: 'Llamada telefónica', desc: 'Sin video, solo llamada' },
                          { id: 'presencial', label: 'Presencial',         desc: 'En persona, sin video' },
                        ]}
                        selectedId={draft.cal_reunion}
                        onChange={v => update('cal_reunion', v)}
                        variant="tone"
                      />

                      <ChipGroup
                        label="¿Cuántas citas máximo quieres al día?"
                        options={[
                          { id: '0',  label: 'Sin límite' },
                          { id: '3',  label: '3' },
                          { id: '5',  label: '5' },
                          { id: '8',  label: '8' },
                          { id: '10', label: '10' },
                        ]}
                        selectedId={draft.cal_max_dia}
                        onChange={v => update('cal_max_dia', v)}
                        variant="chips5"
                      />

                      <ChipGroup
                        label="¿Pueden tus clientes reagendar o cancelar solos?"
                        options={[
                          { id: 'si', label: 'Sí, sin problema', desc: 'Se gestionan solos sin escribirte' },
                          { id: 'no', label: 'No, me contactan',  desc: 'Deben escribirte para cualquier cambio' },
                        ]}
                        selectedId={draft.cal_gestion}
                        onChange={v => update('cal_gestion', v)}
                        variant="tone"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Nav buttons */}
              <div className="mt-10 pt-6 border-t hairline flex items-center justify-between gap-4">
                <Btn kind="ghost" onClick={back} disabled={stepIdx === 0 || saveState === 'saving'} icon={<IconArrowLeft size={16} />}>
                  Atrás
                </Btn>
                <div className={`text-xs min-h-[20px] ${currentStep.id === 'calendario' ? '' : 'hidden sm:block'}`}>
                  {currentStep.id === 'calendario' ? (
                    <Btn kind="ghost" size="sm" onClick={() => { update('cal_omitir', true); setDir(1); setStepIdx(WIZARD_STEPS.length); }} iconRight={<IconArrowRight size={14} />}>
                      Omitir este paso
                    </Btn>
                  ) : saveState === 'saving' ? (
                    <span className="inline-flex items-center gap-2 text-ink-500">
                      <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-paper-300 border-t-gold-400 animate-spin" />
                      Guardando…
                    </span>
                  ) : saveState === 'saved' ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 fade-in">
                      <IconCheck size={13} stroke={2.5} /> Guardado
                    </span>
                  ) : saveState === 'error' ? (
                    <span className="inline-flex items-center gap-1.5 text-warn fade-in">
                      <IconAlert size={12} stroke={2.5} /> No se pudo guardar
                    </span>
                  ) : (
                    <span className="text-ink-500">
                      Paso <span className="font-mono text-navy-900">{stepIdx + 1}</span> de {WIZARD_STEPS.length}
                    </span>
                  )}
                </div>
                <Btn
                  kind="gold"
                  onClick={next}
                  disabled={!canAdvance || saveState === 'saving'}
                  size="lg"
                  icon={saveState === 'saving' ? (
                    <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-navy-900/30 border-t-navy-900 animate-spin" />
                  ) : null}
                  iconRight={saveState === 'saving' ? null : (isLast ? <IconCheck size={16} stroke={2.5} /> : <IconArrowRight size={16} />)}
                >
                  {saveState === 'saving' ? 'Guardando…' : (isLast ? 'Revisar y confirmar' : 'Siguiente')}
                </Btn>
              </div>
            </>
          )}
        </>
      ) : (
        <SuccessScreen draft={draft} onDone={() => navigate(`/${locationId ?? 'loc_HRZ2042'}`)} />
      )}
    </DetailLayout>
  );
}
