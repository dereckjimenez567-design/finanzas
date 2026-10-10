'use strict';

/* =========================================================
   Mis Finanzas — PWA local. Todos los datos viven en el
   localStorage del teléfono; nada se envía a ningún servidor.
   ========================================================= */

const STORE_KEY = 'finanzas.v1';
const DAY = 86400000;

// Íconos de línea (SVG, 24x24). La categoría guarda solo la clave.
const ICONS = {
  food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h2l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L22 7H5.1"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2M9 17h6"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  bus: '<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M8 19v2M16 19v2M8 15h.01M16 15h.01"/>',
  fuel: '<path d="M3 22h12M4 9h10M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V9.8a2 2 0 0 0-.6-1.4L18 5"/>',
  plane: '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1z"/>',
  wine: '<path d="M8 22h8M7 10h10M12 15v7M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5z"/>',
  coffee: '<path d="M10 2v2M14 2v2M6 2v2M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
  film: '<rect x="2" y="2" width="20" height="20" rx="2.2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/>',
  game: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  bolt: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
  water: '<path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.3 0z"/>',
  wifi: '<path d="M5 12.6a11 11 0 0 1 14 0M1.4 9a16 16 0 0 1 21.2 0M8.5 16.1a6 6 0 0 1 7 0M12 20h.01"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  health: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
  gym: '<path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
  shirt: '<path d="M20.4 3.5L16 2a4 4 0 0 1-8 0L3.6 3.5a2 2 0 0 0-1.3 2.2l.6 3.5a1 1 0 0 0 1 .8H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.2a1 1 0 0 0 1-.8l.6-3.5a2 2 0 0 0-1.4-2.2z"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  school: '<path d="M22 10L12 5 2 10l10 5zM6 12v5c3 3 9 3 12 0v-5"/>',
  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  receipt: '<path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 .7V2l-1 .7-3-2-3 2-3-2-3 2-3-2zM8 8h8M8 12h8M8 16h5"/>',
  bank: '<path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  trend: '<path d="M22 7l-8.5 8.5-5-5L2 17M16 7h6v6"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7zM3.3 7L12 12l8.7-5M12 22V12"/>',
  tag: '<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8zM7 7h.01"/>',
  question: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',
};
const ICON_KEYS = Object.keys(ICONS).filter((k) => !['question', 'target', 'search'].includes(k));
const icon = (key) => `<svg viewBox="0 0 24 24">${ICONS[key] || ICONS.box}</svg>`;
const NO_CAT = { name: 'Sin categoría', icon: 'question', color: '#94a3b8' };
const COLORS = ['#3b82f6','#38bdf8','#22d3ee','#34d399','#a78bfa','#f472b6','#fb923c','#fbbf24','#f87171','#94a3b8'];

const DEFAULT_CATEGORIES = [
  ['Comida', 'gasto', 'food', '#fb923c'],
  ['Supermercado', 'gasto', 'cart', '#34d399'],
  ['Transporte', 'gasto', 'car', '#38bdf8'],
  ['Salidas', 'gasto', 'star', '#a78bfa'],
  ['Servicios', 'gasto', 'bolt', '#fbbf24'],
  ['Salud', 'gasto', 'health', '#f87171'],
  ['Otros', 'gasto', 'box', '#94a3b8'],
  ['Salario', 'ingreso', 'briefcase', '#34d399'],
  ['Extra', 'ingreso', 'cash', '#22d3ee'],
];

/* ---------------- Utilidades ---------------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const money = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 });
const fmt = (n) => money.format(Math.round(n || 0));

// Fechas como 'YYYY-MM-DD' y aritmética en UTC para evitar saltos por zona horaria.
const toDate = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const toStr = (dt) => dt.toISOString().slice(0, 10);
const addDays = (s, n) => toStr(new Date(toDate(s).getTime() + n * DAY));
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const dayDiff = (a, b) => Math.round((toDate(b) - toDate(a)) / DAY);

const fDay = new Intl.DateTimeFormat('es-CR', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const fLong = new Intl.DateTimeFormat('es-CR', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' });
const fMonth = new Intl.DateTimeFormat('es-CR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const fShort = (s) => fDay.format(toDate(s)).replace('.', '');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------------- Datos ---------------- */

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      s.settings ||= { paydays: [10, 25] };
      s.categories ||= [];
      s.transactions ||= [];
      return s;
    }
  } catch (e) { console.error(e); }
  return {
    version: 1,
    settings: { paydays: [10, 25] },
    categories: DEFAULT_CATEGORIES.map(([name, type, icon, color]) => ({ id: uid(), name, type, icon, color, budget: 0 })),
    transactions: [],
  };
}

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}

const catById = (id) => state.categories.find((c) => c.id === id);
const catsOf = (type) => state.categories.filter((c) => c.type === type);
const txIn = (start, end) => state.transactions.filter((t) => t.date >= start && t.date <= end);

/* ---------------- Períodos (quincenas según días de pago) ---------------- */

function payStarts(y, m) {
  const first = new Date(Date.UTC(y, m, 1));
  const Y = first.getUTCFullYear(), M = first.getUTCMonth();
  const dim = new Date(Date.UTC(Y, M + 1, 0)).getUTCDate();
  const days = [...new Set(state.settings.paydays.map((p) => Math.min(p, dim)))];
  return days.map((d) => new Date(Date.UTC(Y, M, d)));
}

function periodFor(s) {
  const dt = toDate(s);
  const y = dt.getUTCFullYear(), m = dt.getUTCMonth();
  const c = [-1, 0, 1, 2].flatMap((o) => payStarts(y, m + o)).sort((a, b) => a - b);
  let i = 0;
  while (i + 1 < c.length && c[i + 1] <= dt) i++;
  return { start: toStr(c[i]), end: toStr(new Date(c[i + 1] - DAY)) };
}

function rangeFor(mode, ref) {
  if (mode === 'm') {
    const d = toDate(ref);
    const start = toStr(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)));
    const end = toStr(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)));
    const isNow = today() >= start && today() <= end;
    return { start, end, label: cap(fMonth.format(d)), sub: isNow ? 'Mes actual' : '' };
  }
  const { start, end } = periodFor(ref);
  const t = today();
  const isNow = t >= start && t <= end;
  const left = dayDiff(t, end) + 1;
  let sub = toDate(end).getUTCFullYear().toString();
  if (isNow) sub = `Quincena actual · ${left === 1 ? 'último día' : `quedan ${left} días`}`;
  else if (end < t) sub = `Quincena pasada · ${sub}`;
  return { start, end, label: `${fShort(start)} – ${fShort(end)}`, sub, isNow, left };
}

function shiftRef(mode, ref, dir) {
  if (mode === 'm') {
    const d = toDate(ref);
    return toStr(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + dir, 1)));
  }
  const p = periodFor(ref);
  return dir < 0 ? addDays(p.start, -1) : addDays(p.end, 1);
}

/* ---------------- Estado de la interfaz ---------------- */

const ui = {
  view: 'home',
  homeRef: today(),
  movMode: 'q',
  movRef: today(),
  movType: 'all',
  movCat: 'all',
  catType: 'gasto',
};

function go(view) {
  ui.view = view;
  $$('.tab').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  render();
  window.scrollTo({ top: 0 });
}

function render() {
  const views = { home: renderHome, movs: renderMovs, cats: renderCats, settings: renderSettings };
  const titles = { home: 'Inicio', movs: 'Movimientos', cats: 'Categorías', settings: 'Ajustes' };
  $('#title').textContent = titles[ui.view];
  $('#topActions').innerHTML = '';
  const main = $('#view');
  main.style.animation = 'none'; void main.offsetWidth; main.style.animation = '';
  main.innerHTML = views[ui.view]();
  bindView();
  requestAnimationFrame(() => $$('.bar > i[data-w]').forEach((el) => { el.style.width = el.dataset.w + '%'; }));
}

/* ---------------- Vistas ---------------- */

function periodSwitcher(r, key) {
  return `
    <div class="period">
      <button class="arrow" data-shift="${key}" data-dir="-1" aria-label="Anterior"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
      <div class="label"><b>${esc(r.label)}</b><small>${esc(r.sub)}</small></div>
      <button class="arrow" data-shift="${key}" data-dir="1" aria-label="Siguiente"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
    </div>`;
}

function statusOf(spent, budget) {
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  return { pct, cls: pct > 100 ? 'over' : pct >= 80 ? 'warn' : 'ok' };
}

function renderHome() {
  const r = rangeFor('q', ui.homeRef);
  const txs = txIn(r.start, r.end);
  const inc = txs.filter((t) => t.type === 'ingreso').reduce((a, t) => a + t.amount, 0);
  const out = txs.filter((t) => t.type === 'gasto').reduce((a, t) => a + t.amount, 0);

  const spentBy = {};
  txs.filter((t) => t.type === 'gasto').forEach((t) => { spentBy[t.categoryId] = (spentBy[t.categoryId] || 0) + t.amount; });

  const budgeted = catsOf('gasto').filter((c) => c.budget > 0);
  const totalBudget = budgeted.reduce((a, c) => a + c.budget, 0);
  const totalSpentBudgeted = budgeted.reduce((a, c) => a + (spentBy[c.id] || 0), 0);

  const budgetRows = budgeted
    .map((c) => ({ c, spent: spentBy[c.id] || 0 }))
    .sort((a, b) => b.spent / b.c.budget - a.spent / a.c.budget)
    .map(({ c, spent }) => {
      const st = statusOf(spent, c.budget);
      const rest = c.budget - spent;
      let foot;
      if (rest < 0) foot = `<span class="over">Te pasaste por ${fmt(-rest)}</span>`;
      else if (rest === 0) foot = `<span class="warn">Llegaste al límite</span>`;
      else foot = `<span class="${st.cls === 'warn' ? 'warn' : ''}">Quedan ${fmt(rest)}</span>`;
      const perDay = r.isNow && rest > 0 ? `<span>≈ ${fmt(rest / r.left)} por día</span>` : '<span></span>';
      return `
        <button class="card budget" data-cat-link="${c.id}" style="width:100%;text-align:left;display:block">
          <div class="budget-head">
            <div class="cat-ico" style="background:${c.color}22;color:${c.color}">${icon(c.icon)}</div>
            <div class="name"><b>${esc(c.name)}</b><small>${fmt(spent)} de ${fmt(c.budget)}</small></div>
            <div class="pct ${st.cls}">${Math.round(st.pct)}%</div>
          </div>
          <div class="bar ${st.cls}"><i data-w="${Math.min(st.pct, 100)}"></i></div>
          <div class="budget-foot">${foot}${perDay}</div>
        </button>`;
    }).join('');

  const unbudgeted = Object.entries(spentBy)
    .filter(([id]) => !budgeted.some((c) => c.id === id))
    .sort((a, b) => b[1] - a[1]);

  const tot = statusOf(totalSpentBudgeted, totalBudget);
  const recent = [...txs].sort(sortTx).slice(0, 5);

  return `
    ${periodSwitcher(r, 'home')}

    <div class="card hero">
      <div class="k">Balance de la quincena</div>
      <div class="big">${fmt(inc - out)}</div>
      <div class="row">
        <div class="pill"><small><span class="dot" style="background:var(--green)"></span>Ingresos</small><b>${fmt(inc)}</b></div>
        <div class="pill"><small><span class="dot" style="background:var(--red)"></span>Gastos</small><b>${fmt(out)}</b></div>
      </div>
    </div>

    ${totalBudget > 0 ? `
      <div class="card">
        <div class="budget-head">
          <div class="name"><b>Presupuesto total</b><small>${fmt(totalSpentBudgeted)} de ${fmt(totalBudget)}</small></div>
          <div class="pct ${tot.cls}">${Math.round(tot.pct)}%</div>
        </div>
        <div class="bar ${tot.cls}"><i data-w="${Math.min(tot.pct, 100)}"></i></div>
      </div>` : ''}

    <div class="section-title"><span>Presupuestos</span><button data-go="cats">Editar</button></div>
    ${budgetRows || `
      <div class="card empty">
        <div class="em">${icon('target')}</div>
        Aún no tienes presupuestos.<br>Ponle un monto por quincena a tus categorías.
        <div><button class="btn small" data-go="cats">Definir presupuestos</button></div>
      </div>`}

    ${unbudgeted.length ? `
      <div class="section-title"><span>Gastos sin presupuesto</span></div>
      <div class="list">
        ${unbudgeted.map(([id, amt]) => {
          const c = catById(id) || NO_CAT;
          return `<div class="item"><div class="cat-ico" style="background:${c.color}22;color:${c.color}">${icon(c.icon)}</div>
            <div class="meta"><b>${esc(c.name)}</b></div><div class="amt out">${fmt(amt)}</div></div>`;
        }).join('')}
      </div>` : ''}

    <div class="section-title"><span>Últimos movimientos</span>${recent.length ? '<button data-go="movs">Ver todos</button>' : ''}</div>
    ${recent.length ? `<div class="list">${recent.map(itemHtml).join('')}</div>` : `
      <div class="card empty"><div class="em">${icon('receipt')}</div>Sin movimientos en esta quincena.
        <div><button class="btn small" data-add>Agregar el primero</button></div></div>`}
  `;
}

function sortTx(a, b) {
  return b.date.localeCompare(a.date) || (b.createdAt || 0) - (a.createdAt || 0);
}

function itemHtml(t) {
  const c = catById(t.categoryId) || NO_CAT;
  const sub = [t.note, ui.view === 'home' ? fShort(t.date) : ''].filter(Boolean).join(' · ');
  return `
    <button class="item" data-edit="${t.id}">
      <div class="cat-ico" style="background:${c.color}22;color:${c.color}">${icon(c.icon)}</div>
      <div class="meta"><b>${esc(c.name)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>
      <div class="amt ${t.type === 'ingreso' ? 'in' : 'out'}">${t.type === 'ingreso' ? '+' : '−'}${fmt(t.amount)}</div>
    </button>`;
}

function dayLabel(s) {
  const t = today();
  if (s === t) return 'Hoy';
  if (s === addDays(t, -1)) return 'Ayer';
  return cap(fLong.format(toDate(s)).replace('.', ''));
}

function renderMovs() {
  $('#topActions').innerHTML = `<button class="icon-btn" id="exportView" aria-label="Exportar a Excel">
    <svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg></button>`;

  const r = rangeFor(ui.movMode, ui.movRef);
  let txs = txIn(r.start, r.end);
  const inc = txs.filter((t) => t.type === 'ingreso').reduce((a, t) => a + t.amount, 0);
  const out = txs.filter((t) => t.type === 'gasto').reduce((a, t) => a + t.amount, 0);

  if (ui.movType !== 'all') txs = txs.filter((t) => t.type === ui.movType);
  if (ui.movCat !== 'all') txs = txs.filter((t) => t.categoryId === ui.movCat);
  txs.sort(sortTx);

  const chipCats = ui.movType === 'all' ? state.categories : catsOf(ui.movType);
  const groups = {};
  txs.forEach((t) => (groups[t.date] ||= []).push(t));

  return `
    <div class="filters">
      <div class="seg" data-seg="movMode">
        <button data-v="q" class="${ui.movMode === 'q' ? 'on' : ''}">Quincena</button>
        <button data-v="m" class="${ui.movMode === 'm' ? 'on' : ''}">Mes</button>
      </div>
      ${periodSwitcher(r, 'movs')}
    </div>
    <div class="chips" data-chips="movType">
      ${[['all', 'Todos'], ['gasto', 'Gastos'], ['ingreso', 'Ingresos']].map(([v, l]) =>
        `<button class="chip ${ui.movType === v ? 'on' : ''}" data-v="${v}">${l}</button>`).join('')}
    </div>
    <div class="chips" data-chips="movCat" style="margin-top:6px">
      <button class="chip ${ui.movCat === 'all' ? 'on' : ''}" data-v="all">Todas</button>
      ${chipCats.map((c) => `<button class="chip ${ui.movCat === c.id ? 'on' : ''}" data-v="${c.id}">${esc(c.name)}</button>`).join('')}
    </div>
    <div class="totals">
      <div><small>Ingresos</small><b style="color:var(--green)">${fmt(inc)}</b></div>
      <div><small>Gastos</small><b>${fmt(out)}</b></div>
      <div><small>Balance</small><b style="color:${inc - out < 0 ? 'var(--red)' : 'var(--cyan)'}">${fmt(inc - out)}</b></div>
    </div>
    ${txs.length ? Object.entries(groups).map(([d, list]) => `
      <div class="day"><span>${dayLabel(d)}</span><span>${fmt(list.reduce((a, t) => a + (t.type === 'ingreso' ? t.amount : -t.amount), 0))}</span></div>
      <div class="list">${list.map(itemHtml).join('')}</div>`).join('') : `
      <div class="card empty" style="margin-top:14px"><div class="em">${icon('search')}</div>No hay movimientos con estos filtros.</div>`}
  `;
}

function renderCats() {
  const cats = catsOf(ui.catType);
  const totalBudget = cats.reduce((a, c) => a + (c.budget || 0), 0);
  return `
    <div class="seg type" data-seg="catType" style="margin-bottom:14px">
      <button data-v="gasto" class="${ui.catType === 'gasto' ? 'on' : ''}">Gastos</button>
      <button data-v="ingreso" class="${ui.catType === 'ingreso' ? 'on' : ''}">Ingresos</button>
    </div>
    ${ui.catType === 'gasto' ? `<p class="note">Presupuesto total por quincena: <b>${fmt(totalBudget)}</b>. Toca una categoría para editarla.</p>` : ''}
    <div class="list" style="margin-top:10px">
      ${cats.map((c) => `
        <button class="item" data-cat="${c.id}">
          <div class="cat-ico" style="background:${c.color}22;color:${c.color}">${icon(c.icon)}</div>
          <div class="meta"><b>${esc(c.name)}</b>
            ${c.type === 'gasto' ? `<small>${c.budget > 0 ? `Presupuesto: ${fmt(c.budget)} / quincena` : 'Sin presupuesto'}</small>` : ''}</div>
          <svg class="chev" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </button>`).join('') || '<div class="empty">No hay categorías.</div>'}
    </div>
    <div style="margin-top:14px"><button class="btn ghost" data-newcat>
      <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Nueva categoría</button></div>
  `;
}

function renderSettings() {
  const pd = state.settings.paydays;
  const t = today();
  return `
    <div class="section-title" style="margin-top:6px"><span>Quincenas</span></div>
    <div class="list">
      <button class="row-set" data-paydays>
        <div class="ico"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div>
        <div class="meta"><b>Días de pago</b><small>${pd.length > 1 ? `Los días ${pd.join(' y ')} de cada mes` : `El día ${pd[0]} de cada mes`}</small></div>
        <svg class="chev" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>

    <div class="section-title"><span>Exportar a Excel</span></div>
    <div class="card">
      <div class="field"><label>Mes</label><input class="input" type="month" id="expMonth" value="${t.slice(0, 7)}"></div>
      <button class="btn" id="expMonthBtn"><svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>Exportar mes</button>
    </div>

    <div class="section-title"><span>Respaldo</span></div>
    <div class="list">
      <button class="row-set" id="backupBtn">
        <div class="ico"><svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg></div>
        <div class="meta"><b>Respaldo completo</b><small>Excel con todos los movimientos y categorías</small></div>
      </button>
      <label class="row-set" style="cursor:pointer">
        <div class="ico"><svg viewBox="0 0 24 24"><path d="M12 21V9M7 14l5-5 5 5M5 3h14"/></svg></div>
        <div class="meta"><b>Restaurar desde Excel</b><small>Agrega lo que falte; no borra nada</small></div>
        <input type="file" id="importFile" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" hidden>
      </label>
    </div>
    <p class="note">Tus datos solo existen en este teléfono. Si borras la app de la pantalla de inicio, se borran. Haz un respaldo cada mes y guárdalo en iCloud Drive.</p>

    <div class="section-title"><span>Zona peligrosa</span></div>
    <div class="list">
      <button class="row-set danger" id="wipeBtn">
        <div class="ico"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg></div>
        <div class="meta"><b>Borrar todos los datos</b><small>${state.transactions.length} movimientos guardados</small></div>
      </button>
    </div>
  `;
}

/* ---------------- Eventos de las vistas ---------------- */

function bindView() {
  $$('[data-shift]').forEach((b) => b.addEventListener('click', () => {
    const dir = +b.dataset.dir;
    if (b.dataset.shift === 'home') ui.homeRef = shiftRef('q', ui.homeRef, dir);
    else ui.movRef = shiftRef(ui.movMode, ui.movRef, dir);
    render();
  }));
  $$('[data-go]').forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
  $$('[data-add]').forEach((b) => b.addEventListener('click', () => openTxSheet()));
  $$('[data-edit]').forEach((b) => b.addEventListener('click', () => openTxSheet(state.transactions.find((t) => t.id === b.dataset.edit))));
  $$('[data-cat-link]').forEach((b) => b.addEventListener('click', () => {
    Object.assign(ui, { movMode: 'q', movRef: ui.homeRef, movType: 'gasto', movCat: b.dataset.catLink });
    go('movs');
  }));
  $$('[data-seg]').forEach((seg) => $$('button', seg).forEach((b) => b.addEventListener('click', () => {
    ui[seg.dataset.seg] = b.dataset.v;
    render();
  })));
  $$('[data-chips]').forEach((row) => $$('button', row).forEach((b) => b.addEventListener('click', () => {
    ui[row.dataset.chips] = b.dataset.v;
    if (row.dataset.chips === 'movType') ui.movCat = 'all';
    render();
  })));
  $$('[data-cat]').forEach((b) => b.addEventListener('click', () => openCatSheet(catById(b.dataset.cat))));
  $$('[data-newcat]').forEach((b) => b.addEventListener('click', () => openCatSheet()));
  $$('[data-paydays]').forEach((b) => b.addEventListener('click', openPaydaysSheet));

  $('#exportView')?.addEventListener('click', () => {
    const r = rangeFor(ui.movMode, ui.movRef);
    exportRange(r.start, r.end, ui.movMode === 'm' ? r.label : `Quincena ${r.label} ${toDate(r.end).getUTCFullYear()}`);
  });
  $('#expMonthBtn')?.addEventListener('click', () => {
    const v = $('#expMonth').value;
    if (!v) return toast('Elige un mes');
    const r = rangeFor('m', v + '-01');
    exportRange(r.start, r.end, r.label);
  });
  $('#backupBtn')?.addEventListener('click', exportBackup);
  $('#importFile')?.addEventListener('change', importBackup);
  $('#wipeBtn')?.addEventListener('click', () => {
    if (!confirm('¿Borrar TODOS los movimientos y categorías? Esto no se puede deshacer.')) return;
    if (!confirm('¿Seguro? Te recomiendo exportar un respaldo antes.')) return;
    localStorage.removeItem(STORE_KEY);
    state = load();
    save();
    render();
    toast('Datos borrados');
  });
}

/* ---------------- Hoja inferior ---------------- */

function openSheet(html, onBind) {
  const sheet = $('#sheet');
  sheet.innerHTML = `<div class="grab"></div>${html}`;
  sheet.scrollTop = 0;
  $('#backdrop').classList.add('open');
  sheet.classList.add('open');
  $$('[data-close]', sheet).forEach((b) => b.addEventListener('click', closeSheet));
  onBind(sheet);
}

function closeSheet() {
  $('#sheet').classList.remove('open');
  $('#backdrop').classList.remove('open');
  document.activeElement?.blur();
}

function bindAmount(input) {
  input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 12);
    input.value = digits ? num.format(+digits) : '';
  });
}
const readAmount = (input) => +input.value.replace(/\D/g, '') || 0;

function openTxSheet(tx) {
  const editing = !!tx;
  let type = tx?.type || 'gasto';
  let catId = tx?.categoryId || null;

  const catGrid = () => {
    const cats = catsOf(type);
    if (!cats.some((c) => c.id === catId)) catId = cats[0]?.id || null;
    return cats.map((c) => `
      <button class="cat-opt ${c.id === catId ? 'on' : ''}" data-pick="${c.id}">
        <span class="e" style="color:${c.color}">${icon(c.icon)}</span><span>${esc(c.name)}</span></button>`).join('')
      || '<p class="note">No hay categorías de este tipo. Créalas en Categorías.</p>';
  };

  openSheet(`
    <h2>${editing ? 'Editar movimiento' : 'Nuevo movimiento'}<button data-close>Cancelar</button></h2>
    <div class="seg type" id="txType">
      <button data-v="gasto" class="${type === 'gasto' ? 'on' : ''}">Gasto</button>
      <button data-v="ingreso" class="${type === 'ingreso' ? 'on' : ''}">Ingreso</button>
    </div>
    <div class="amount-wrap"><span>₡</span>
      <input class="amount-input" id="txAmount" inputmode="numeric" placeholder="0" autocomplete="off"
        value="${tx ? num.format(tx.amount) : ''}"></div>
    <div class="field"><label>Categoría</label><div class="cat-grid" id="catGrid">${catGrid()}</div></div>
    <div class="field"><label>Fecha</label><input class="input" type="date" id="txDate" value="${tx?.date || today()}"></div>
    <div class="field"><label>Nota (opcional)</label><input class="input" id="txNote" maxlength="80" placeholder="Ej: almuerzo con amigos" value="${esc(tx?.note || '')}"></div>
    <div class="actions">
      <button class="btn" id="txSave">${editing ? 'Guardar cambios' : 'Guardar'}</button>
      ${editing ? '<button class="btn danger" id="txDel">Eliminar</button>' : ''}
    </div>
  `, (s) => {
    const amount = $('#txAmount', s);
    bindAmount(amount);
    if (!editing) setTimeout(() => amount.focus(), 350);

    const bindGrid = () => $$('[data-pick]', s).forEach((b) => b.addEventListener('click', () => {
      catId = b.dataset.pick;
      $$('[data-pick]', s).forEach((x) => x.classList.toggle('on', x === b));
    }));
    bindGrid();

    $$('#txType button', s).forEach((b) => b.addEventListener('click', () => {
      type = b.dataset.v;
      $$('#txType button', s).forEach((x) => x.classList.toggle('on', x === b));
      $('#catGrid', s).innerHTML = catGrid();
      bindGrid();
    }));

    $('#txSave', s).addEventListener('click', () => {
      const amt = readAmount(amount);
      const date = $('#txDate', s).value;
      if (!amt) { amount.focus(); return toast('Escribe el monto'); }
      if (!catId) return toast('Elige una categoría');
      if (!date) return toast('Elige la fecha');
      const data = { type, amount: amt, categoryId: catId, date, note: $('#txNote', s).value.trim() };
      if (editing) Object.assign(tx, data);
      else state.transactions.push({ id: uid(), createdAt: Date.now(), ...data });
      save();
      closeSheet();
      render();
      toast(editing ? 'Movimiento actualizado' : (type === 'gasto' ? 'Gasto guardado' : 'Ingreso guardado'));
      if (!editing && type === 'gasto') budgetAlert(catId, date);
    });

    $('#txDel', s)?.addEventListener('click', () => {
      if (!confirm('¿Eliminar este movimiento?')) return;
      state.transactions = state.transactions.filter((t) => t.id !== tx.id);
      save();
      closeSheet();
      render();
      toast('Movimiento eliminado');
    });
  });
}

function budgetAlert(catId, date) {
  const c = catById(catId);
  if (!c || !(c.budget > 0)) return;
  const p = periodFor(date);
  const spent = txIn(p.start, p.end).filter((t) => t.categoryId === catId && t.type === 'gasto').reduce((a, t) => a + t.amount, 0);
  if (spent > c.budget) setTimeout(() => toast(`Te pasaste en ${c.name} por ${fmt(spent - c.budget)}`, 3500), 1700);
  else if (spent >= c.budget * 0.8) setTimeout(() => toast(`${c.name}: llevas ${Math.round(spent / c.budget * 100)}% del presupuesto`, 3000), 1700);
}

function openCatSheet(cat) {
  const editing = !!cat;
  const d = cat ? { ...cat } : { name: '', type: ui.catType, icon: ui.catType === 'gasto' ? 'cart' : 'cash', color: COLORS[0], budget: 0 };

  openSheet(`
    <h2>${editing ? 'Editar categoría' : 'Nueva categoría'}<button data-close>Cancelar</button></h2>
    ${editing ? '' : `
      <div class="seg type" id="cType" style="margin-bottom:14px">
        <button data-v="gasto" class="${d.type === 'gasto' ? 'on' : ''}">Gasto</button>
        <button data-v="ingreso" class="${d.type === 'ingreso' ? 'on' : ''}">Ingreso</button>
      </div>`}
    <div class="field"><label>Nombre</label><input class="input" id="cName" maxlength="24" placeholder="Ej: Gimnasio" value="${esc(d.name)}"></div>
    <div class="field" id="cBudgetField" style="${d.type === 'gasto' ? '' : 'display:none'}">
      <label>Presupuesto por quincena (₡)</label>
      <input class="input" id="cBudget" inputmode="numeric" placeholder="0 = sin presupuesto" value="${d.budget ? num.format(d.budget) : ''}">
    </div>
    <div class="field"><label>Ícono</label><div class="emoji-grid">
      ${ICON_KEYS.map((k) => `<button data-emoji="${k}" class="${k === d.icon ? 'on' : ''}" aria-label="${k}">${icon(k)}</button>`).join('')}</div></div>
    <div class="field"><label>Color</label><div class="color-grid">
      ${COLORS.map((c) => `<button data-color="${c}" class="${c === d.color ? 'on' : ''}" style="background:${c}" aria-label="${c}"></button>`).join('')}</div></div>
    <div class="actions">
      <button class="btn" id="cSave">${editing ? 'Guardar cambios' : 'Crear categoría'}</button>
      ${editing ? '<button class="btn danger" id="cDel">Eliminar categoría</button>' : ''}
    </div>
  `, (s) => {
    bindAmount($('#cBudget', s));
    $$('#cType button', s).forEach((b) => b.addEventListener('click', () => {
      d.type = b.dataset.v;
      $$('#cType button', s).forEach((x) => x.classList.toggle('on', x === b));
      $('#cBudgetField', s).style.display = d.type === 'gasto' ? '' : 'none';
    }));
    $$('[data-emoji]', s).forEach((b) => b.addEventListener('click', () => {
      d.icon = b.dataset.emoji;
      $$('[data-emoji]', s).forEach((x) => x.classList.toggle('on', x === b));
    }));
    $$('[data-color]', s).forEach((b) => b.addEventListener('click', () => {
      d.color = b.dataset.color;
      $$('[data-color]', s).forEach((x) => x.classList.toggle('on', x === b));
    }));
    $('#cSave', s).addEventListener('click', () => {
      d.name = $('#cName', s).value.trim();
      if (!d.name) { $('#cName', s).focus(); return toast('Escribe un nombre'); }
      const dup = state.categories.find((c) => c.type === d.type && c.name.toLowerCase() === d.name.toLowerCase() && c.id !== cat?.id);
      if (dup) return toast('Ya existe una categoría con ese nombre');
      d.budget = d.type === 'gasto' ? readAmount($('#cBudget', s)) : 0;
      if (editing) Object.assign(cat, d);
      else state.categories.push({ ...d, id: uid() });
      ui.catType = d.type;
      save();
      closeSheet();
      render();
      toast(editing ? 'Categoría actualizada' : 'Categoría creada');
    });
    $('#cDel', s)?.addEventListener('click', () => {
      const used = state.transactions.filter((t) => t.categoryId === cat.id).length;
      const msg = used
        ? `Esta categoría tiene ${used} movimiento(s). Quedarán como "Sin categoría". ¿Eliminarla?`
        : '¿Eliminar esta categoría?';
      if (!confirm(msg)) return;
      state.categories = state.categories.filter((c) => c.id !== cat.id);
      save();
      closeSheet();
      render();
      toast('Categoría eliminada');
    });
  });
}

function openPaydaysSheet() {
  const [a, b] = state.settings.paydays;
  openSheet(`
    <h2>Días de pago<button data-close>Cancelar</button></h2>
    <p class="note" style="margin:0 0 14px">Cada quincena empieza el día que te pagan y termina el día antes del siguiente pago. Con 10 y 25: del 10 al 24 y del 25 al 9.</p>
    <div class="pay-row">
      <div class="field" style="flex:1"><label>Primer pago</label><input class="input" id="p1" inputmode="numeric" maxlength="2" value="${a ?? ''}"></div>
      <div class="field" style="flex:1"><label>Segundo pago</label><input class="input" id="p2" inputmode="numeric" maxlength="2" placeholder="Opcional" value="${b ?? ''}"></div>
    </div>
    <div class="actions"><button class="btn" id="pSave">Guardar</button></div>
  `, (s) => {
    $('#pSave', s).addEventListener('click', () => {
      const vals = [$('#p1', s).value, $('#p2', s).value].map((v) => parseInt(v, 10)).filter((v) => v >= 1 && v <= 31);
      const uniq = [...new Set(vals)].sort((x, y) => x - y);
      if (!uniq.length) return toast('Escribe un día entre 1 y 31');
      state.settings.paydays = uniq;
      save();
      closeSheet();
      render();
      toast('Días de pago actualizados');
    });
  });
}

/* ---------------- Excel ---------------- */

const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const excelSerial = (s) => (toDate(s) - Date.UTC(1899, 11, 30)) / DAY;
const MONEY_FMT = '"₡"#,##0';

function movementsSheet(txs) {
  const rows = [['Fecha', 'Tipo', 'Categoría', 'Nota', 'Monto', 'ID', 'CategoríaID']];
  [...txs].sort((a, b) => a.date.localeCompare(b.date) || (a.createdAt || 0) - (b.createdAt || 0)).forEach((t) => {
    rows.push([
      { t: 'n', v: excelSerial(t.date), z: 'dd/mm/yyyy' },
      t.type === 'gasto' ? 'Gasto' : 'Ingreso',
      catById(t.categoryId)?.name || 'Sin categoría',
      t.note || '',
      { t: 'n', v: t.amount, z: MONEY_FMT },
      t.id,
      t.categoryId || '',
    ]);
  });
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 12 }, { wch: 9 }, { wch: 18 }, { wch: 32 }, { wch: 14 }, { wch: 14, hidden: true }, { wch: 14, hidden: true }];
  ws['!autofilter'] = { ref: `A1:E${rows.length}` };
  return ws;
}

function summarySheet(txs, label) {
  const inc = txs.filter((t) => t.type === 'ingreso').reduce((a, t) => a + t.amount, 0);
  const out = txs.filter((t) => t.type === 'gasto').reduce((a, t) => a + t.amount, 0);
  const m = (v) => ({ t: 'n', v, z: MONEY_FMT });
  const rows = [
    ['Período', label],
    ['Ingresos', m(inc)],
    ['Gastos', m(out)],
    ['Balance', m(inc - out)],
    [],
    ['Categoría', 'Tipo', 'Total', 'Movimientos', 'Presupuesto por quincena'],
  ];
  const by = {};
  txs.forEach((t) => {
    const k = t.categoryId || '-';
    (by[k] ||= { type: t.type, total: 0, n: 0 });
    by[k].total += t.amount; by[k].n++;
  });
  Object.entries(by)
    .sort((a, b) => a[1].type.localeCompare(b[1].type) || b[1].total - a[1].total)
    .forEach(([id, v]) => {
      const c = catById(id);
      rows.push([c?.name || 'Sin categoría', v.type === 'gasto' ? 'Gasto' : 'Ingreso', m(v.total), v.n, c?.budget ? m(c.budget) : '']);
    });
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 18 }, { wch: 22 }, { wch: 14 }, { wch: 13 }, { wch: 24 }];
  return ws;
}

function categoriesSheet() {
  const rows = [['Nombre', 'Tipo', 'Ícono', 'Color', 'Presupuesto por quincena', 'ID']];
  state.categories.forEach((c) => rows.push([c.name, c.type === 'gasto' ? 'Gasto' : 'Ingreso', c.icon, c.color, c.budget || 0, c.id]));
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 18 }, { wch: 9 }, { wch: 6 }, { wch: 10 }, { wch: 24 }, { wch: 14 }];
  return ws;
}

function buildWorkbook(txs, label) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, summarySheet(txs, label), 'Resumen');
  XLSX.utils.book_append_sheet(wb, movementsSheet(txs), 'Movimientos');
  XLSX.utils.book_append_sheet(wb, categoriesSheet(), 'Categorías');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Clave', 'Valor'], ['diasDePago', state.settings.paydays.join(',')]]), 'Ajustes');
  return wb;
}

function deliver(wb, filename) {
  const data = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const file = new File([data], filename, { type: XLSX_TYPE });
  // En iPhone la hoja de "Compartir" permite guardar en Archivos / iCloud Drive o enviarlo.
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({ files: [file], title: filename }).catch((e) => {
      if (e.name !== 'AbortError') downloadFile(file);
    });
    return;
  }
  downloadFile(file);
}

function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const a = Object.assign(document.createElement('a'), { href: url, download: file.name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase();

function exportRange(start, end, label) {
  const txs = txIn(start, end);
  if (!txs.length) return toast('No hay movimientos en ese período');
  deliver(buildWorkbook(txs, label), `finanzas-${slug(label)}.xlsx`);
}

function exportBackup() {
  if (!state.transactions.length && !state.categories.length) return toast('No hay datos para respaldar');
  deliver(buildWorkbook(state.transactions, 'Respaldo completo'), `finanzas-respaldo-${today()}.xlsx`);
}

function parseExcelDate(v) {
  if (typeof v === 'number') return toStr(new Date(Date.UTC(1899, 11, 30) + Math.round(v) * DAY));
  if (v instanceof Date) return `${v.getFullYear()}-${String(v.getMonth() + 1).padStart(2, '0')}-${String(v.getDate()).padStart(2, '0')}`;
  const m = String(v).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(v).trim())) return String(v).trim();
  return null;
}

function sheetRows(ws) {
  if (!ws) return [];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: '' });
  const head = (rows.shift() || []).map((h) => String(h).trim());
  return rows.filter((r) => r.some((v) => v !== '')).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

function importBackup(e) {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const wb = XLSX.read(reader.result, { type: 'array' });
      let newCats = 0, newTx = 0, skipped = 0;

      sheetRows(wb.Sheets['Categorías']).forEach((r) => {
        const type = String(r['Tipo']).toLowerCase().startsWith('i') ? 'ingreso' : 'gasto';
        const name = String(r['Nombre'] || '').trim();
        if (!name) return;
        const existing = state.categories.find((c) => c.id === r['ID']) ||
          state.categories.find((c) => c.type === type && c.name.toLowerCase() === name.toLowerCase());
        if (existing) return;
        state.categories.push({
          id: String(r['ID'] || uid()), name, type,
          icon: ICONS[r['Ícono']] ? r['Ícono'] : 'box', color: r['Color'] || COLORS[0], budget: +r['Presupuesto por quincena'] || 0,
        });
        newCats++;
      });

      const ids = new Set(state.transactions.map((t) => t.id));
      sheetRows(wb.Sheets['Movimientos']).forEach((r) => {
        const date = parseExcelDate(r['Fecha']);
        const amount = Math.round(+r['Monto']);
        if (!date || !(amount > 0)) { skipped++; return; }
        const id = String(r['ID'] || '') || uid();
        if (ids.has(id)) return;
        const type = String(r['Tipo']).toLowerCase().startsWith('i') ? 'ingreso' : 'gasto';
        let cat = catById(String(r['CategoríaID'] || ''));
        if (!cat) {
          const name = String(r['Categoría'] || '').trim();
          cat = state.categories.find((c) => c.type === type && c.name.toLowerCase() === name.toLowerCase());
          if (!cat && name && name !== 'Sin categoría') {
            cat = { id: uid(), name, type, icon: 'box', color: COLORS[9], budget: 0 };
            state.categories.push(cat);
            newCats++;
          }
        }
        state.transactions.push({ id, type, amount, date, categoryId: cat?.id || '', note: String(r['Nota'] || ''), createdAt: Date.now() });
        ids.add(id);
        newTx++;
      });

      save();
      render();
      toast(`Restaurado: ${newTx} movimientos, ${newCats} categorías${skipped ? ` (${skipped} filas inválidas)` : ''}`, 4000);
    } catch (err) {
      console.error(err);
      toast('No se pudo leer el archivo');
    }
  };
  reader.readAsArrayBuffer(f);
}

/* ---------------- Toast ---------------- */

let toastTimer;
function toast(msg, ms = 2200) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

/* ---------------- Arranque ---------------- */

$$('.tab').forEach((b) => b.addEventListener('click', () => go(b.dataset.view)));
$('#fab').addEventListener('click', () => openTxSheet());
$('#backdrop').addEventListener('click', closeSheet);

// Si la app queda abierta de un día para otro, refrescar "hoy".
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && !$('#sheet').classList.contains('open')) render();
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

save();
render();
