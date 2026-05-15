export const RUBROS = [
  { id:'inmobiliaria', label:'Inmobiliaria',      desc:'Venta o alquiler de propiedades', emoji:'▦' },
  { id:'seguros',      label:'Seguros',           desc:'Corretaje, pólizas, asesoría',    emoji:'◈' },
  { id:'consultoria',  label:'Consultoría',       desc:'B2B, estrategia, coaching',       emoji:'◎' },
  { id:'educacion',    label:'Educación',         desc:'Cursos, academias, EdTech',       emoji:'✦' },
  { id:'salud',        label:'Salud y bienestar', desc:'Clínicas, consultorios, spa',     emoji:'♡' },
  { id:'servicios',    label:'Servicios locales', desc:'Reformas, limpieza, talleres',    emoji:'◉' },
  { id:'ecommerce',    label:'Comercio / retail', desc:'Venta online u offline',          emoji:'◐' },
  { id:'otro',         label:'Otro',              desc:'Cuéntanos cuál',                  emoji:'＋' },
];

export const TONOS = [
  { id:'cercano',     label:'Cercano',     desc:'Natural, cálido, como un amigo' },
  { id:'profesional', label:'Profesional', desc:'Formal, claro, con autoridad' },
  { id:'directo',     label:'Directo',     desc:'Al grano, sin rodeos' },
  { id:'inspirador',  label:'Inspirador',  desc:'Aspiracional, motivador' },
];

export const WIZARD_STEPS = [
  { id:'identidad',  title:'Identidad del negocio',    desc:'Lo básico sobre tu empresa y a quién te diriges.' },
  { id:'propuesta',  title:'Tu propuesta de valor',    desc:'Con esto generamos tu lead magnet y tus primeros 5 emails de forma automática.' },
  { id:'voz',        title:'Voz y marca',              desc:'Cómo te reconocemos visualmente y cómo suenas.' },
  { id:'contacto',   title:'Contacto operativo',       desc:'Datos que aparecerán en comunicaciones.' },
  { id:'canales',    title:'Redes y canales',          desc:'De dónde vienen tus leads y dónde los atiendes.' },
  { id:'calendario', title:'Tu calendario de citas',   desc:'Configura cómo tus clientes agendan contigo. Lo dejamos listo en tu CRM automáticamente.' },
];

export const STEP_FIELDS: Record<string, string[]> = {
  identidad:  ['empresa','rubro','producto','publico'],
  propuesta:  ['problema','resultado','diferenciador','objecion','cta'],
  voz:        ['tono','primary','secondary'],
  contacto:   ['telefono','email','web'],
  canales:    ['instagram','facebook','whats','meet'],
  calendario: ['cal_nombre','cal_duracion','cal_reunion','cal_max_dia','cal_gestion'],
};
