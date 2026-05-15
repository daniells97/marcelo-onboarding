# Marcelo CRM — Portal de Onboarding

## Stack
- Vite + React 18 + TypeScript
- Tailwind CSS
- React Router DOM v6 (hash-based)
- Zustand + persist
- TanStack Query v5
- React Hook Form + Zod
- Deploy: Vercel → onboarding.marcelocrm.com

## Infraestructura
- n8n: https://n8n.dimetrics.com.co
- GHL Company ID: 5OQpt7Ptle5fupDC3pRY
- Subcuenta prueba: KkvsKZH4ScjWxatKPo8Y
- LocationId prueba: BrAkzvwuSYdO3sDC9DL3
- Repo: daniells97/marcelo-onboarding

## Variables de entorno (.env)
VITE_N8N_BASE_URL=https://n8n.dimetrics.com.co/webhook
VITE_GHL_COMPANY_ID=5OQpt7Ptle5fupDC3pRY
VITE_DEFAULT_LOCATION_ID=BrAkzvwuSYdO3sDC9DL3

## Estructura del proyecto
src/
├── components/
│   ├── ui/           # Btn, Card, Badge, StatusIcon, Toast
│   ├── layout/       # Header, DetailLayout, SiteFooter
│   ├── shared/       # InstructionsList, VideoCard, FAQ, DetailActions
│   ├── modals/       # GmailSuccessModal, RedesSuccessModal
│   └── wizard/       # WizardProgress, StepHeader, ReviewScreen, SuccessScreen, SplashScreen, FormFields
├── pages/            # HomePage, FormularioPage, GmailPage, RedesPage, WhatsPage, DominioPage
├── hooks/            # useMarkDone, useOnboardingLoad, useOnboardingSave
├── store/            # onboardingStore.ts (Zustand + persist)
├── lib/              # n8nClient.ts, validators.ts, confetti.ts
├── types/            # onboarding.ts
└── constants/        # steps.ts, rubros.ts, providers.ts

## Workflows n8n
- `onboarding-load` — GET, carga Custom Values del cliente desde GHL
- `onboarding-save` — POST, guarda campos en GHL Custom Values vía Loop
- `onboarding-process` — POST, triggers:
  - `calendario` → crea calendario en GHL
  - `verificar_calendario` → ciclo proveedores (Meet/Zoom/Teams), crea cita prueba, detecta link
  - `verificar_redes` → GET Facebook pages, valida name != empty, retorna {status, pagina, logo}
  - `verificar_dominio` → pendiente
  - `verificar_whatsapp` → pendiente

## Fix crítico n8n
Todos los responses de n8n vienen con `=` al inicio. Fix en `src/lib/n8nClient.ts`:
```ts
const clean = text.trim().replace(/^=/, '');
return JSON.parse(clean) as T;
```

## Response shapes esperados de onboarding-process
```ts
// verificar_calendario
{ status: 'ok' | 'error', proveedor: 'Google Meet' | 'Zoom' | 'Microsoft Teams', mensaje: string }

// verificar_redes
{ status: 'ok' | 'pendiente', red: 'Facebook', pagina: string, logo: string }

// verificar_dominio (pendiente)
{ status: 'activo' | 'pendiente', domain: string }

// verificar_whatsapp (pendiente)
{ status: 'ok' | 'pendiente' }
```

## Design System
navy-950: #0A1322    navy-900: #0F1A2E
navy-800: #172540    navy-700: #223255
gold-400: #D4A14A    gold-300: #E3C06A
paper-50: #FBFAF7    paper-100: #F5F3EC
ink-900: #1A1F2A     ink-500: #6B7280
ok: #1F7A5A          okbg: #E6F2EC
warn: #B85C1E        warnbg: #FBEAD9
Fuentes: Instrument Serif / Inter / JetBrains Mono

## Pasos del checklist
| Key | Ruta | Título | Requerido | Estado |
|-----|------|--------|-----------|--------|
| form | /formulario | Formulario de onboarding | ✅ | ✅ completo |
| gmail | /gmail | Conectar Gmail / Calendar | ✅ | ✅ completo |
| redes | /redes | Conectar Facebook / Instagram | ✅ | ✅ completo |
| whatsapp | /whatsapp | Conectar WhatsApp Business | ✅ | ⏳ pendiente verificación |
| dominio | /dominio | Configurar dominio | ❌ opcional | ⏳ pendiente verificación |

## useMarkDone — lógica por stepKey
- `gmail` → POST verificar_calendario → modal GmailSuccessModal
- `redes` → POST verificar_redes → modal RedesSuccessModal con logo y nombre de página
- `whatsapp` → POST verificar_whatsapp → pendiente implementar
- `dominio` → POST verificar_dominio → pendiente implementar
- resto → sendValidador('si') directo

## Patrones importantes
- locationId siempre viene del query param `?loc=` con fallback a VITE_DEFAULT_LOCATION_ID
- Hash router: `/#/locationId/pagina`
- Validador en GHL: campo `validador_correo`, `validador_whatsapp`, `validador_redes`, `validador_dominio`
- Al marcar done: POST onboarding-save con `{ locationId, validador_paso: stepKey, validador_valor: 'si' }`

## Pendiente
- [ ] verificar_dominio — n8n: GET /locations/{id} → campo domain
- [ ] verificar_whatsapp — n8n: endpoint por definir
- [ ] Pipeline de broker en GHL
- [ ] Multi-tenant con subdominios dinámicos
- [ ] Refresh automático de tokens en Data Table