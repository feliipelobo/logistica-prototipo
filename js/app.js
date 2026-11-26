/* =========================================================
   Serafini Transportes — protótipo de apresentação
   Dados fictícios salvos no navegador (localStorage)
   ========================================================= */
(() => {
'use strict';

/* ---------------- Utilidades ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const brl = n => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const num = n => (n || 0).toLocaleString('pt-BR');
const fdate = s => s ? s.split('-').reverse().join('/') : '—';
const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[Math.floor(Math.random() * a.length)];
const sumBy = (a, f) => a.reduce((s, x) => s + f(x), 0);
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const stripHtml = h => { const d = document.createElement('div'); d.innerHTML = h; return d.textContent.trim(); };
const store = {
  get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  del: k => { try { localStorage.removeItem(k); } catch (e) {} }
};

/* ---------------- Ícones (traço 2px, 24x24) ---------------- */
const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  wallet: '<path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v3"/><path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/><path d="M21 12h-4a2 2 0 0 0 0 4h4z"/>',
  receipt: '<path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 .7V2l-3 2-3-2-3 2-3-2-3 2z"/><path d="M8 9h8M8 13h6"/>',
  folder: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  pencil: '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
  trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4A1 1 0 0 0 17.5 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  fuel: '<path d="M3 22h12M4 9h10M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V9.8a2 2 0 0 0-.6-1.4L18 5"/>',
  trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  dollar: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  tv: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  pie: '<path d="M21.2 15.9A10 10 0 1 1 8 2.8"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>'
};
const ic = (n, s = 16, c = '') => `<svg class="ic ${c}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------------- Estado ---------------- */
const KEY = 'serafini_dados_v3', SKEY = 'serafini_sessao', PKEY = 'serafini_periodo';
let S, modalOpen = false, pendingRender = false, timer = null;

function seed() {
  let x = 20261126;
  const r = () => { x |= 0; x = (x + 0x6D2B79F5) | 0; let t = Math.imul(x ^ (x >>> 15), 1 | x); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const ri = (a, b) => Math.floor(r() * (b - a + 1)) + a;
  const pk = a => a[Math.floor(r() * a.length)];
  const empresas = [
    { id: 'e1', nome: 'Maersk', cnpj: '02.265.718/0001-04', contato: 'Operações Santos' },
    { id: 'e2', nome: 'MSC', cnpj: '24.103.267/0001-60', contato: 'Logística Brasil' },
    { id: 'e3', nome: 'Hapag-Lloyd', cnpj: '03.912.457/0001-33', contato: 'Terminal Sul' },
    { id: 'e4', nome: 'CMA CGM', cnpj: '01.554.671/0001-70', contato: 'Desembaraço' }
  ];
  const motoristas = [
    { id: 'm1', nome: 'Carlos Griss', cpf: '123.456.789-01', telefone: '(13) 99811-2200', cnh: 'E', tipo: 'Próprio', status: 'Ativo' },
    { id: 'm2', nome: 'Marcos Almeida', cpf: '234.567.890-12', telefone: '(13) 99722-3311', cnh: 'E', tipo: 'Próprio', status: 'Ativo' },
    { id: 'm3', nome: 'José Ribeiro', cpf: '345.678.901-23', telefone: '(13) 99633-4422', cnh: 'E', tipo: 'Próprio', status: 'Ativo' },
    { id: 'm4', nome: 'André Souza', cpf: '456.789.012-34', telefone: '(11) 98544-5533', cnh: 'D', tipo: 'Terceiro', status: 'Ativo' },
    { id: 'm5', nome: 'Paulo Martins', cpf: '567.890.123-45', telefone: '(11) 98455-6644', cnh: 'E', tipo: 'Terceiro', status: 'Ativo' },
    { id: 'm6', nome: 'Rafael Costa', cpf: '678.901.234-56', telefone: '(13) 99366-7755', cnh: 'E', tipo: 'Terceiro', status: 'Ativo' }
  ];
  const veiculos = [
    { id: 'v1', placa: 'ANS-4G47', modelo: 'Scania R450', tipo: 'Cavalo mecânico', proprietario: 'Frota própria' },
    { id: 'v2', placa: 'BRA-2E19', modelo: 'Volvo FH 540', tipo: 'Cavalo mecânico', proprietario: 'Frota própria' },
    { id: 'v3', placa: 'QWE-7H21', modelo: 'DAF XF 530', tipo: 'Cavalo mecânico', proprietario: 'Frota própria' },
    { id: 'v4', placa: 'RTY-5J88', modelo: 'Mercedes Actros', tipo: 'Cavalo mecânico', proprietario: 'André Souza' },
    { id: 'v5', placa: 'KLM-9B03', modelo: 'Scania G410', tipo: 'Cavalo mecânico', proprietario: 'Paulo Martins' },
    { id: 'v6', placa: 'FGH-1C66', modelo: 'Volvo FM 460', tipo: 'Cavalo mecânico', proprietario: 'Rafael Costa' }
  ];
  const usuarios = [
    { id: 'u1', nome: 'Leonardo Silva', email: 'leonardo@serafinitransportes.com.br', perfil: 'Supervisor', status: 'Ativo' }
  ];
  const vm = { 150: 60, 180: 70, 210: 85, 240: 95 };
  const progs = [], pagamentos = [], recebimentos = [], abastecimentos = [];
  const today = new Date(), N = 30;
  for (let i = 0; i < N; i++) {
    const daysAgo = i >= N - 4 ? 0 : Math.round(55 - (i * 52) / (N - 5));
    const d = new Date(today); d.setDate(d.getDate() - daysAgo);
    const mi = ri(0, 5);
    const vv = pk([150, 180, 180, 210, 240]);
    const prev = ri(8, 24);
    let status = 'Finalizada', real = prev;
    if (i >= N - 4) { status = 'Em andamento'; real = ri(3, prev - 3); }
    if (i >= N - 2) { status = 'Programada'; real = 0; }
    const p = {
      id: 'p' + (i + 1), tipo: i % 3 === 2 ? 'servico' : 'escala', data: ymd(d), clienteId: pk(empresas).id,
      lote: `25GX${ri(1000, 9999)}HR`, vaga: ri(10, 99), motoristaId: motoristas[mi].id, placa: veiculos[mi].placa,
      valorViagem: vv, valorMotorista: vm[vv], qtdPrevista: prev, qtdViagens: real,
      inicio: pk(['06:00', '07:30', '14:00', '15:45']), fim: status === 'Finalizada' ? pk(['14:00', '18:30', '22:00']) : '',
      status, ocorrencia: r() < .12, valorOcorrencia: 0
    };
    if (p.ocorrencia) p.valorOcorrencia = pk([80, 120, 250]);
    progs.push(p);
    if (status === 'Finalizada') {
      if (r() < .92) pagamentos.push({ id: 'pg' + (i + 1), progId: p.id, data: ymd(new Date(d.getTime() + 5 * 864e5)), qtd: p.qtdViagens, valorViagem: p.valorMotorista, vale: pk([0, 0, 100, 200]), forma: pk(['PIX', 'PIX', 'TED']) });
      const rec = r() < .78;
      recebimentos.push({ id: 'rc' + (i + 1), progId: p.id, data: ymd(new Date(d.getTime() + (rec ? 12 : 20) * 864e5)), valor: p.qtdViagens * p.valorViagem - p.valorOcorrencia, forma: pk(['Boleto', 'TED', 'PIX']), status: rec && daysAgo > 14 ? 'Recebido' : 'Pendente' });
    }
    if (r() < .4 || i === N - 4) abastecimentos.push({ id: 'ab' + (i + 1), data: p.data, placa: p.placa, litros: ri(90, 220), valorTotal: 0, local: pk(['Posto Ipiranga BR-116', 'Shell Rodovia Anchieta', 'Posto Graal Imigrantes', 'Petrobras Cubatão']) });
  }
  abastecimentos.forEach(a => a.valorTotal = Math.round(a.litros * (5.9 + r() * .5) * 100) / 100);
  const mn = id => motoristas.find(m => m.id === id).nome;
  const now = Date.now(), act = progs.filter(p => p.status === 'Em andamento'), pr = progs.filter(p => p.status === 'Programada');
  const lastPg = pagamentos[pagamentos.length - 1], lastRc = recebimentos.filter(g => g.status === 'Recebido').pop();
  const log = [
    { t: now - 4 * 6e4, icon: '🚛', msg: `${mn(act[1].motoristaId)} iniciou a operação — lote ${act[1].lote}` },
    { t: now - 11 * 6e4, icon: '📦', msg: `${mn(act[0].motoristaId)} concluiu viagens no lote ${act[0].lote}: ${act[0].qtdViagens}/${act[0].qtdPrevista}` },
    { t: now - 26 * 6e4, icon: '🗓️', msg: `Nova programação: ${mn(pr[0].motoristaId)} → ${empresas.find(e => e.id === pr[0].clienteId).nome}` },
    { t: now - 48 * 6e4, icon: '⛽', msg: `Abastecimento registrado: ${act[0].placa}` },
    { t: now - 75 * 6e4, icon: '💸', msg: `Pagamento lançado: ${mn(progs.find(p => p.id === lastPg.progId).motoristaId)} — ${brl(lastPg.qtd * lastPg.valorViagem - lastPg.vale)}` },
    { t: now - 102 * 6e4, icon: '💰', msg: `Recebimento confirmado: ${progs.find(p => p.id === lastRc.progId).lote} — ${brl(lastRc.valor)}` }
  ];
  return { empresas, fornecedores: seedFornecedores(), motoristas, veiculos, usuarios, progs, pagamentos, recebimentos, abastecimentos, log };
}
function seedFornecedores() {
  return [
    { id: 'f1', nome: 'Posto Ipiranga BR-116', cnpj: '33.337.122/0001-71', categoria: 'Posto de combustível', contato: 'Gerência', telefone: '(13) 3221-4400', status: 'Ativo' },
    { id: 'f2', nome: 'Shell Rodovia Anchieta', cnpj: '33.453.598/0001-23', categoria: 'Posto de combustível', contato: 'Atendimento frotas', telefone: '(13) 3345-1020', status: 'Ativo' },
    { id: 'f3', nome: 'Posto Graal Imigrantes', cnpj: '61.064.929/0001-79', categoria: 'Posto de combustível', contato: 'Convênios', telefone: '(11) 4442-8800', status: 'Ativo' },
    { id: 'f4', nome: 'Petrobras Cubatão', cnpj: '34.274.233/0001-02', categoria: 'Posto de combustível', contato: 'Frotas', telefone: '(13) 3361-2299', status: 'Ativo' },
    { id: 'f5', nome: 'Oficina Diesel Santos', cnpj: '12.845.330/0001-56', categoria: 'Oficina mecânica', contato: 'Marcelo', telefone: '(13) 99701-3344', status: 'Ativo' },
    { id: 'f6', nome: 'Pneus Baixada Santista', cnpj: '28.114.903/0001-40', categoria: 'Pneus', contato: 'Vendas', telefone: '(13) 3229-7781', status: 'Ativo' }
  ];
}
function load() { const v = store.get(KEY); if (!v) return null; try { return JSON.parse(v); } catch (e) { return null; } }
function save(msg, icon) {
  if (msg) { S.log.unshift({ t: Date.now(), msg, icon: icon || '•' }); S.log = S.log.slice(0, 40); const f = feedIc(icon); toast(msg, f[1], f[0]); }
  store.set(KEY, JSON.stringify(S));
  render(true);
}
window.addEventListener('storage', e => { if (e.key === KEY) { S = load() || S; render(true); } });

/* ---------------- Sessão ---------------- */
const me = () => S.usuarios.find(u => u.id === store.get(SKEY));

/* ---------------- Perfis de acesso ---------------- */
const PERFIS = ['Supervisor', 'Administrador', 'Financeiro', 'Operação'];
const ACESSO_TOTAL = ['Supervisor', 'Administrador'];
const PERMISSOES = {
  Supervisor: 'Acesso total · alimenta e controla todo o sistema',
  Administrador: 'Acesso total',
  Financeiro: 'Pagamentos, abastecimentos e recebimentos',
  'Operação': 'Programação de escalas e serviços'
};

/* ---------------- Derivados ---------------- */
const by = (col, id) => S[col].find(x => x.id === id);
const nome = (col, id) => (by(col, id) || {}).nome || '—';
const veic = placa => S.veiculos.find(v => v.placa === placa) || {};
const total = p => Math.max(0, p.qtdViagens * p.valorViagem - (p.ocorrencia ? p.valorOcorrencia : 0));
const custo = p => p.qtdViagens * p.valorMotorista;
const pgTotal = g => g.qtd * g.valorViagem - g.vale;
const pgBruto = g => g.qtd * g.valorViagem;
const pagoProg = id => sumBy(S.pagamentos.filter(g => g.progId === id), pgBruto);
const recProg = id => sumBy(S.recebimentos.filter(g => g.progId === id && g.status === 'Recebido'), g => g.valor);
function stPagar(p) {
  const c = custo(p), pg = pagoProg(p.id);
  if (!p.qtdViagens) return ['Aguardando', 'no'];
  if (pg >= c && pg > 0) return ['Pago', 'ok'];
  return pg > 0 ? ['Parcial', 'wait'] : ['Pendente', 'wait'];
}
function stReceber(p) {
  if (!p.qtdViagens) return ['Aguardando', 'no'];
  const rc = recProg(p.id);
  if (rc >= total(p) && rc > 0) return ['Recebido', 'ok'];
  return S.recebimentos.some(g => g.progId === p.id) ? ['Em aberto', 'wait'] : ['Pendente', 'wait'];
}
const stProg = s => ({ 'Finalizada': 'ok', 'Em andamento': 'run', 'Programada': 'no' }[s] || 'no');
const progLabel = p => `${p.lote} · ${nome('empresas', p.clienteId)} · ${nome('motoristas', p.motoristaId)}`;

/* ---------------- Componentes ---------------- */
const badge = (t, c) => `<span class="badge b-${c}">${esc(t)}</span>`;
const AV = [['#dbe7f6', '#1d4f91'], ['#e3f4e8', '#1d7a3e'], ['#fbeedb', '#9a5b13'], ['#ece7f7', '#5b3a9a'], ['#e2f0f3', '#2d5f6b'], ['#f7e4e4', '#9b2c2c']];
const initials = n => { const p = String(n || '?').trim().split(/\s+/); return ((p[0] || '')[0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); };
function avatar(n, cls = '') {
  if (cls.includes('av-top')) return `<span class="av ${cls}">${esc(initials(n))}</span>`;
  let h = 0; for (const ch of String(n)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const [bg, fg] = AV[h % AV.length];
  return `<span class="av ${cls}" style="background:${bg};color:${fg}">${esc(initials(n))}</span>`;
}
const person = (n, sub) => `<span class="person">${avatar(n, 'av-sm')}<b>${esc(n)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>`;
const meter = (v, done) => `<div class="meter ${done ? 'done' : ''}"><i style="width:${Math.max(0, Math.min(100, v))}%"></i></div>`;
const statCard = ([label, value, icon, foot, extra = '', cls = '']) => `<div class="stat ${cls}"><div class="st-h"><span>${label}</span>${icon ? `<i class="st-ic">${ic(icon, 17)}</i>` : ''}</div><b>${value}</b>${foot ? `<div class="st-f">${foot}</div>` : ''}${extra}</div>`;
const emptyState = (t, d, icon = 'inbox') => `<div class="empty"><div class="e-ic">${ic(icon, 22)}</div><b>${t}</b>${d || ''}</div>`;
function pageHead(group, title, desc, actions = '') {
  return `<div class="ph"><div><nav class="crumb" aria-label="Você está em"><span>Início</span>${group ? `${ic('chevR', 13)}<span>${group}</span>` : ''}${ic('chevR', 13)}<b>${title}</b></nav><h1>${title}</h1>${desc ? `<p>${desc}</p>` : ''}</div><div class="ph-a">${actions}</div></div>`;
}
const FEED = { '🚛': ['truck', 'info'], '🏁': ['check', 'ok'], '📦': ['truck', 'info'], '💸': ['wallet', 'warn'], '💰': ['dollar', 'ok'], '🧾': ['receipt', 'info'], '⛽': ['fuel', 'warn'], '🗓️': ['calendar', 'info'], '✅': ['check', 'ok'], '✏️': ['pencil', 'neu'], '🗑️': ['trash', 'red'] };
const feedIc = i => FEED[i] || ['refresh', 'neu'];

/* ---------------- Toast / modal ---------------- */
function toast(msg, tone = 'ok', icon = 'check') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="t-i t-${tone}">${ic(icon, 15)}</span><span>${esc(msg)}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3400);
}
function openModal({ title = '', sub = '', body, footer = '', size = '', bare = false }) {
  modalOpen = true;
  const m = $('#modal'); m.hidden = false;
  m.innerHTML = `<div class="dlg ${size}" role="dialog" aria-modal="true">${bare ? '' : `<div class="dlg-h"><div><h2>${esc(title)}</h2>${sub ? `<p>${sub}</p>` : ''}</div><button class="ib" data-x aria-label="Fechar">${ic('x', 18)}</button></div>`}<div class="dlg-b">${body}</div>${footer ? `<div class="dlg-f">${footer}</div>` : ''}</div>`;
  m.onmousedown = e => { if (e.target === m) closeModal(); };
  $$('[data-x]', m).forEach(b => b.onclick = closeModal);
  const f = $('input:not([type=hidden]),select', m); if (f && window.innerWidth > 700) setTimeout(() => f.focus(), 50);
}
function closeModal() {
  if (!modalOpen) return;
  modalOpen = false; const m = $('#modal'); m.hidden = true; m.innerHTML = '';
  if (pendingRender) { pendingRender = false; render(true); }
}
function confirmBox(title, text, okLabel, onOk) {
  openModal({ size: 'sm', bare: true, body: `<div class="cf"><div class="cf-ic">${ic('alert', 20)}</div><div><h2>${esc(title)}</h2><p>${esc(text)}</p></div></div>`,
    footer: `<button class="btn btn-sec" data-x>Cancelar</button><button class="btn btn-danger" id="cfOk">${esc(okLabel)}</button>` });
  $('#cfOk').onclick = () => { closeModal(); onOk(); };
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (modalOpen) return closeModal();
  if ($('#mnav').classList.contains('open')) return $('#mnav').classList.remove('open');
  if ($('#um') && $('#um').classList.contains('open')) return $('#um').classList.remove('open');
  if (document.body.classList.contains('tv')) tvExit();
});

/* ---------------- Login ---------------- */
function renderLogin(err, email) {
  if (timer) toggleLive();
  closeModal();
  document.body.classList.remove('tv');
  $('#shell').hidden = true; $('#login').hidden = false;
  const def = email ?? (S.usuarios[0] ? S.usuarios[0].email : '');
  const brandHtml = `<div class="brand"><img src="img/logo-simbolo.png" alt=""><div class="wm"><b>SERAFINI</b><span>TRANSPORTES</span></div></div>`;
  $('#login').innerHTML = `<div class="login">
    <aside class="lg-side">${brandHtml}
      <div class="lg-copy"><h2>Gestão operacional e financeira da sua transportadora.</h2>
        <p>Programação de escalas, pagamentos de motoristas, recebimentos e indicadores em tempo real, em um só lugar.</p>
        <ul class="lg-feat">
          <li><span class="ck">${ic('check', 14)}</span>Programação de escalas e serviços por cliente e lote</li>
          <li><span class="ck">${ic('check', 14)}</span>Pagamentos de motoristas, terceiros e abastecimentos</li>
          <li><span class="ck">${ic('check', 14)}</span>Controle de recebimentos e pendências financeiras</li>
          <li><span class="ck">${ic('check', 14)}</span>Dashboard em tempo real e modo TV para a operação</li>
        </ul></div>
      <div class="lg-legal">© 2026 Serafini Transportes. Todos os direitos reservados.</div>
    </aside>
    <section class="lg-main"><form class="lg-card" id="lgf" novalidate>
      <div class="lg-mbrand">${brandHtml}</div>
      <h1>Acessar o sistema</h1><p>Entre com seu e-mail corporativo e senha.</p>
      ${err ? `<div class="lg-err" role="alert">${esc(err)}</div>` : ''}
      <label class="fld">E-mail<div class="ipt">${ic('mail')}<input name="email" type="email" autocomplete="username" value="${esc(def)}"></div></label>
      <label class="fld">Senha<div class="ipt">${ic('lock')}<input name="senha" type="password" autocomplete="current-password" value="demo1234"><button type="button" class="ib eye" id="eye" aria-label="Mostrar senha">${ic('eye')}</button></div></label>
      <div class="lg-row"><label><input type="checkbox" checked> Manter conectado</label><a href="#" id="esq">Esqueci minha senha</a></div>
      <button class="btn btn-pri btn-block" type="submit">Entrar</button>
      <div class="lg-demo">${ic('info')}<span>Ambiente de demonstração com dados fictícios. Entre com o e-mail de qualquer usuário cadastrado e qualquer senha.</span></div>
    </form></section></div>`;
  const f = $('#lgf');
  $('#eye').onclick = () => { const s = f.elements.senha; s.type = s.type === 'password' ? 'text' : 'password'; };
  $('#esq').onclick = e => { e.preventDefault(); toast('A recuperação de senha estará disponível na versão final.', 'info', 'info'); };
  f.onsubmit = e => {
    e.preventDefault();
    const em = f.elements.email.value.trim().toLowerCase();
    if (!em || !f.elements.senha.value) return renderLogin('Informe e-mail e senha para continuar.', f.elements.email.value);
    const u = S.usuarios.find(x => String(x.email).toLowerCase() === em);
    if (!u) return renderLogin('E-mail não encontrado. Verifique o endereço ou fale com o administrador.', f.elements.email.value);
    if (u.status === 'Inativo') return renderLogin('Este usuário está inativo. Fale com o administrador.', f.elements.email.value);
    store.set(SKEY, u.id);
    if (!location.hash || location.hash === '#/tv') location.hash = '#/dashboard';
    boot();
    toast(`Bem-vindo(a), ${u.nome.split(' ')[0]}!`, 'ok', 'check');
  };
}
function logout() {
  store.del(SKEY);
  renderLogin();
}

/* ---------------- Estrutura (topo e menu) ---------------- */
const NAV = [
  { label: 'Dashboard', icon: 'grid', r: 'dashboard' },
  { label: 'Programação', icon: 'calendar', items: [['escala', 'Programar escala', 'Escalas de motoristas por cliente', 'calendar'], ['servico', 'Programar serviço', 'Serviços avulsos por lote', 'truck']] },
  { label: 'Pagamentos', icon: 'wallet', items: [['pag-motorista', 'Pagamento de motoristas', 'Motoristas da frota própria', 'user'], ['pag-terceiros', 'Pagamento de terceiros', 'Agregados e terceiros', 'users'], '-', ['abastecimentos', 'Abastecimentos', 'Combustível por veículo', 'fuel']] },
  { label: 'A receber', icon: 'receipt', items: [['rpas', "RPA's", 'Recebimentos de clientes', 'receipt']] },
  { label: 'Cadastros', icon: 'folder', items: [['motoristas', 'Motoristas', 'Equipe própria e terceiros', 'user'], ['veiculos', 'Veículos', 'Frota e placas', 'truck'], '-', ['empresas', 'Clientes', 'Empresas atendidas', 'building'], ['fornecedores', 'Fornecedores', 'Postos, oficinas e peças', 'fuel']] }
];
const userIc = (cls = '') => `<span class="u-ic ${cls}"><img src="img/icone-usuario.png" alt=""></span>`;
function renderShell() {
  const u = me();
  $('#top').innerHTML = `
    <button class="burger" id="burger" aria-label="Abrir menu">${ic('menu', 20)}</button>
    <a class="brand" href="#/dashboard" aria-label="Serafini Transportes, ir para o início"><img src="img/logo-simbolo.png" alt=""><div class="wm"><b>SERAFINI</b><span>TRANSPORTES</span></div></a>
    <nav class="nav-l" id="navLinks" aria-label="Menu principal"></nav>
    <div class="top-r">
      <button class="live ${timer ? 'on' : ''}" id="btnLive" title="Liga ou desliga a simulação de movimentações em tempo real"><i></i><span>Ao vivo</span></button>
      <span class="vsep"></span>
      <button class="ib-top" id="btnTvTop" title="Modo TV" aria-label="Abrir modo TV">${ic('tv', 18)}</button>
      <div class="um" id="um">
        <button class="um-btn" id="umBtn" aria-haspopup="menu" aria-expanded="false" title="${esc(u.nome)} · ${esc(u.perfil)}" aria-label="Menu do usuário">${userIc()}</button>
        <div class="um-dd" role="menu">
          <div class="um-head">${userIc('lg')}<div><b>${esc(u.nome)}</b><small>${esc(u.email)}</small><span class="badge b-run" style="margin-top:6px">${esc(u.perfil)}</span></div></div>
          <button class="mi-btn" data-um="perfil">${ic('user')}Meu perfil</button>
          <a class="mi-btn" href="#/usuarios">${ic('users')}Usuários e acessos</a>
          <button class="mi-btn" data-um="reset">${ic('refresh')}Restaurar dados de demonstração</button>
          <div class="dd-sep"></div>
          <button class="mi-btn danger" data-um="sair">${ic('logout')}Sair</button>
        </div></div></div>`;
  $('#btnLive').onclick = toggleLive;
  $('#btnTvTop').onclick = tvEnter;
  $('#burger').onclick = () => $('#mnav').classList.add('open');
  $('#umBtn').onclick = e => { e.stopPropagation(); const o = $('#um').classList.toggle('open'); $('#umBtn').setAttribute('aria-expanded', o); };
  $$('#um .um-dd a, #um .um-dd button').forEach(b => b.addEventListener('click', () => $('#um').classList.remove('open')));
  $('[data-um=sair]').onclick = logout;
  $('[data-um=perfil]').onclick = profile;
  $('[data-um=reset]').onclick = () => confirmBox('Restaurar dados de demonstração?', 'Todos os lançamentos feitos nesta demonstração serão substituídos pelos dados fictícios originais.', 'Restaurar dados', () => { S = seed(); if (!me()) store.set(SKEY, 'u1'); renderShell(); save('Dados de demonstração restaurados', '↺'); });
  clock();
}
function renderNav(route) {
  const on = it => it.r === route || (it.items || []).some(i => i[0] === route);
  const link = i => i === '-' ? '' : `<a class="dd-a ${i[0] === route ? 'on' : ''}" href="#/${i[0]}"><span class="ti">${ic(i[3], 16)}</span><span><b>${i[1]}</b><small>${i[2]}</small></span></a>`;
  const simple = i => i === '-' ? '<div class="dd-sep"></div>' : `<a class="dd-s ${i[0] === route ? 'on' : ''}" href="#/${i[0]}">${i[1]}</a>`;
  $('#navLinks').innerHTML = NAV.map(it => it.r
    ? `<div class="nav-item ${on(it) ? 'active' : ''}"><a class="nav-link" href="#/${it.r}">${it.label}</a></div>`
    : `<div class="nav-item ${on(it) ? 'active' : ''}"><button class="nav-link" type="button" aria-haspopup="true">${it.label}</button><div class="dd"><div class="dd-in">${it.items.map(simple).join('')}</div></div></div>`).join('');
  $$('#navLinks .dd-s').forEach(a => a.addEventListener('click', () => a.blur()));
  $('#mnav').innerHTML = `<div class="mnav-bg" data-close></div><div class="mnav-p"><div class="mnav-h"><div class="brand"><img src="img/logo-simbolo.png" alt="" style="width:32px;height:32px"><div class="wm"><b>SERAFINI</b><span>TRANSPORTES</span></div></div><button data-close aria-label="Fechar menu">${ic('x', 20)}</button></div>
    <div class="mnav-b">${NAV.map(it => it.r ? link([it.r, it.label, 'Visão geral e indicadores', it.icon]) : `<div class="mnav-g">${it.label}</div>${it.items.map(link).join('')}`).join('')}
    <div class="mnav-g">Apresentação</div>${link(['tv', 'Modo TV', 'Painel em tela cheia', 'tv'])}</div></div>`;
  $$('#mnav [data-close], #mnav a').forEach(el => el.addEventListener('click', () => $('#mnav').classList.remove('open')));
}
document.addEventListener('click', e => { const um = $('#um'); if (um && !um.contains(e.target)) um.classList.remove('open'); });
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
function clock() {
  const d = new Date();
  const t = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const curta = `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
  const longa = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  [['#clkTime', t], ['#clkDate', curta], ['#tvClock', t], ['#tvDate', longa]].forEach(([s, v]) => { const el = $(s); if (el) el.textContent = v; });
}
function profile() {
  const u = me();
  openModal({ title: 'Meu perfil', sub: 'Dados da sua conta de acesso', body: `
    <div class="person" style="gap:14px;margin-bottom:18px">${userIc('lg')}<div><b style="font-size:16px;font-weight:600">${esc(u.nome)}</b><div style="color:var(--mut);font-size:13.5px">${esc(u.email)}</div></div></div>
    <div class="dl" style="grid-template-columns:repeat(2,minmax(0,1fr))"><div><span>Perfil</span><b>${esc(u.perfil)}</b></div><div><span>Status</span><b>${esc(u.status || 'Ativo')}</b></div><div><span>Empresa</span><b>Serafini Transportes</b></div><div><span>Sessão iniciada</span><b>${new Date().toLocaleDateString('pt-BR')}</b></div></div>
    <p style="color:var(--mut);font-size:13px;margin:0">Alteração de senha e autenticação em dois fatores estarão disponíveis na versão final.</p>`,
    footer: `<button class="btn btn-sec" data-x>Fechar</button>` });
}

/* ---------------- Listagens (CRUD) ---------------- */
let ls = { key: null, q: '', f: '', s: -1, d: 1 };
const cellTxt = (c, r) => c.render ? stripHtml(String(c.render(r))) : String(r[c.k] ?? '');
function crud(cfg) {
  if (ls.key !== cfg.title) ls = { key: cfg.title, q: '', f: '', s: -1, d: 1 };
  const all = cfg.rows ? cfg.rows() : S[cfg.col];
  const sum = cfg.summary ? cfg.summary(all) : [];
  const fopts = cfg.filter ? (typeof cfg.filter.options === 'function' ? cfg.filter.options() : cfg.filter.options) : [];
  $('#app').innerHTML = `
    ${pageHead(cfg.group, cfg.title, cfg.desc, `<button class="btn btn-pri" id="novo">${ic('plus')}${cfg.newText}</button>`)}
    ${sum.length ? `<div class="stats">${sum.map(statCard).join('')}</div>` : ''}
    <div class="panel">
      <div class="toolbar">
        <div class="tb-l"><div class="search">${ic('search')}<input id="q" placeholder="Buscar ${cfg.searchPh || 'registros'}..." value="${esc(ls.q)}" aria-label="Buscar"></div>
          ${cfg.filter ? `<select id="flt" class="sel-sm" aria-label="Filtrar por ${cfg.filter.label}"><option value="">${cfg.filter.label}: todos</option>${fopts.map(o => `<option ${o === ls.f ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>` : ''}</div>
        <div class="tb-r"><span class="count" id="cnt"></span><button class="btn btn-sec btn-sm" id="csv">${ic('download', 15)}Exportar CSV</button></div>
      </div>
      <div class="tscroll"><table class="tbl"><thead><tr>${cfg.cols.map((c, i) => `<th class="sortable ${c.r ? 'r' : ''}" data-s="${i}" title="Ordenar">${c.label}<span class="sa">${ls.s === i ? (ls.d > 0 ? '↑' : '↓') : ''}</span></th>`).join('')}<th class="act" aria-label="Ações"></th></tr></thead><tbody id="tb"></tbody></table></div>
      <div class="tbl-foot"><span id="cnt2"></span><span>${cfg.detail ? 'Clique em uma linha para ver os detalhes' : 'Clique no título da coluna para ordenar'}</span></div>
    </div>`;
  let cur = [];
  const view = () => {
    let rows = all.filter(r => !cfg.filter || !ls.f || cfg.filter.get(r) === ls.f);
    if (ls.q) { const q = ls.q.toLowerCase(); rows = rows.filter(r => cfg.cols.map(c => cellTxt(c, r)).join(' ').toLowerCase().includes(q)); }
    if (ls.s >= 0) {
      const c = cfg.cols[ls.s], v = r => c.sv ? c.sv(r) : cellTxt(c, r);
      rows = [...rows].sort((a, b) => { const x = v(a), y = v(b); return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'pt-BR', { numeric: true })) * ls.d; });
    }
    $('#tb').innerHTML = rows.length ? rows.map(row => `<tr data-id="${row.id}" class="${cfg.detail ? 'click' : ''}">${cfg.cols.map(c => `<td class="${c.r ? 'r ' : ''}${c.cls || ''}">${c.render ? c.render(row) : esc(row[c.k])}</td>`).join('')}
      <td class="act"><div>${cfg.quick && cfg.quick.show(row) ? `<button class="ib ok" data-qk="${row.id}" title="${cfg.quick.label}" aria-label="${cfg.quick.label}">${ic(cfg.quick.icon, 15)}</button>` : ''}<button class="ib" data-e="${row.id}" title="Editar" aria-label="Editar">${ic('pencil', 15)}</button><button class="ib danger" data-d="${row.id}" title="Excluir" aria-label="Excluir">${ic('trash', 15)}</button></div></td></tr>`).join('')
      : `<tr><td colspan="${cfg.cols.length + 1}">${all.length ? emptyState('Nenhum resultado encontrado', '<div>Ajuste a busca ou o filtro.</div>', 'search') : emptyState('Nenhum registro ainda', `<div>Clique em “${cfg.newText}” para começar.</div>`)}</td></tr>`;
    $('#cnt').textContent = `${rows.length} de ${all.length}`;
    $('#cnt2').textContent = `Mostrando ${rows.length} de ${all.length} registro${all.length === 1 ? '' : 's'}`;
    $$('#tb [data-e]').forEach(b => b.onclick = e => { e.stopPropagation(); form(cfg, by(cfg.col, b.dataset.e)); });
    $$('#tb [data-d]').forEach(b => b.onclick = e => { e.stopPropagation(); del(cfg, by(cfg.col, b.dataset.d)); });
    $$('#tb [data-qk]').forEach(b => b.onclick = e => { e.stopPropagation(); cfg.quick.run(by(cfg.col, b.dataset.qk)); });
    if (cfg.detail) $$('#tb tr.click').forEach(tr => tr.onclick = () => cfg.detail(by(cfg.col, tr.dataset.id)));
    cur = rows;
  };
  view();
  $('#q').oninput = e => { ls.q = e.target.value; view(); };
  if (cfg.filter) $('#flt').onchange = e => { ls.f = e.target.value; view(); };
  $$('th[data-s]').forEach(th => th.onclick = () => { const i = +th.dataset.s; if (ls.s === i) ls.d *= -1; else { ls.s = i; ls.d = 1; } crud(cfg); });
  $('#novo').onclick = () => form(cfg, null);
  $('#csv').onclick = () => exportCsv(cfg, cur);
}
function del(cfg, it) {
  if (!it) return;
  if (cfg.col === 'usuarios' && me() && it.id === me().id) return toast('Você não pode excluir o próprio usuário enquanto está conectado.', 'warn', 'alert');
  confirmBox('Excluir registro?', cfg.col === 'progs' ? 'A programação e os pagamentos e recebimentos vinculados a ela serão excluídos. Esta ação não pode ser desfeita.' : 'Esta ação não pode ser desfeita.', 'Excluir', () => {
    S[cfg.col] = S[cfg.col].filter(x => x.id !== it.id);
    if (cfg.col === 'progs') ['pagamentos', 'recebimentos'].forEach(c => S[c] = S[c].filter(x => x.progId !== it.id));
    save(`Registro excluído em ${cfg.title}`, '🗑️');
  });
}
function exportCsv(cfg, rows) {
  const lines = [cfg.cols.map(c => c.label), ...rows.map(r => cfg.cols.map(c => cellTxt(c, r)))]
    .map(a => a.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';'));
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = cfg.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.csv';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast(`${rows.length} registro(s) exportado(s)`, 'info', 'download');
}
function form(cfg, item, preset) {
  const v = item ? { ...item } : { ...(cfg.defaults ? cfg.defaults() : {}), ...(preset || {}) };
  const fld = cfg.fields.map(f => {
    const val = v[f.k] ?? '';
    if (f.type === 'checkbox') return `<label class="chk ${f.full ? 'full' : ''}"><input type="checkbox" name="${f.k}" ${val ? 'checked' : ''}>${f.label}</label>`;
    let input;
    if (f.type === 'select') {
      const opts = (typeof f.options === 'function' ? f.options(v) : f.options).map(o => Array.isArray(o) ? o : [o, o]);
      input = `<select name="${f.k}" ${f.req ? 'required' : ''}><option value="">Selecione</option>${opts.map(o => `<option value="${esc(o[0])}" ${String(o[0]) === String(val) ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select>`;
    } else {
      input = `<input name="${f.k}" type="${f.type || 'text'}" value="${esc(val)}" ${f.type === 'number' ? 'step="0.01" min="0" inputmode="decimal"' : ''} ${f.req ? 'required' : ''} ${f.ph ? `placeholder="${esc(f.ph)}"` : ''}>`;
    }
    return `<label class="fld ${f.full ? 'full' : ''}">${f.label}${f.req ? '<span class="req">*</span>' : ''}${input}</label>`;
  }).join('');
  openModal({ title: item ? cfg.editText : cfg.newText, sub: item ? 'Altere as informações e salve.' : 'Preencha as informações abaixo. Campos com * são obrigatórios.',
    body: `<form id="f" novalidate><div class="fgrid">${fld}</div></form>`,
    footer: `<button class="btn btn-sec" type="button" data-x>Cancelar</button><button class="btn btn-pri" form="f" type="submit">${ic('check', 15)}Salvar</button>` });
  const fe = $('#f');
  const read = () => {
    const o = {};
    cfg.fields.forEach(f => { const el = fe.elements[f.k]; o[f.k] = f.type === 'checkbox' ? el.checked : f.type === 'number' ? (el.value === '' ? '' : parseFloat(el.value)) : el.value.trim(); });
    return o;
  };
  fe.addEventListener('change', e => {
    if (!cfg.onChange) return;
    const upd = cfg.onChange(read(), e.target.name) || {};
    Object.entries(upd).forEach(([k, val]) => { if (fe.elements[k]) fe.elements[k].value = val; });
  });
  fe.onsubmit = e => {
    e.preventDefault();
    const bad = cfg.fields.find(f => f.req && f.type !== 'checkbox' && !String(fe.elements[f.k].value).trim());
    if (bad) { fe.elements[bad.k].focus(); fe.elements[bad.k].style.borderColor = 'var(--red)'; return toast(`Preencha o campo “${bad.label}”.`, 'warn', 'alert'); }
    const o = read();
    cfg.fields.filter(f => f.type === 'number').forEach(f => { if (o[f.k] === '') o[f.k] = 0; });
    if (cfg.beforeSave) cfg.beforeSave(o);
    const isNew = !item;
    if (isNew) { o.id = uid(); S[cfg.col].push(o); } else Object.assign(item, o);
    closeModal();
    save(cfg.log ? cfg.log(o, isNew) : `${isNew ? 'Registro criado' : 'Registro atualizado'} em ${cfg.title}`, isNew ? '✅' : '✏️');
  };
}

/* ---------------- Ficha da programação ---------------- */
function progDetail(p) {
  const [pg, pgc] = stPagar(p), [rc, rcc] = stReceber(p);
  const pgm = S.pagamentos.find(g => g.progId === p.id), rec = S.recebimentos.find(g => g.progId === p.id);
  const pc = pct(p.qtdViagens, p.qtdPrevista);
  const step = (lbl, done, txt) => `<div class="step ${done ? 'done' : ''}"><span class="s-ic">${ic(done ? 'check' : 'clock', 15)}</span><div><span>${lbl}</span><b>${done ? 'Finalizado' : esc(txt)}</b></div></div>`;
  openModal({ size: 'lg', title: `Lote ${p.lote}`, sub: `${p.tipo === 'escala' ? 'Escala' : 'Serviço'} · ${fdate(p.data)} · ${esc(nome('empresas', p.clienteId))}`,
    body: `
      <div class="dt-badges">${badge(p.status, stProg(p.status))}${badge('A pagar: ' + pg, pgc)}${badge('A receber: ' + rc, rcc)}${p.ocorrencia ? badge('Com ocorrência', 'bad') : ''}</div>
      <div class="dl">
        <div><span>Cliente</span><b>${esc(nome('empresas', p.clienteId))}</b></div><div><span>Motorista</span><b>${esc(nome('motoristas', p.motoristaId))}</b></div>
        <div><span>Placa</span><b>${esc(p.placa)}</b></div><div><span>Vaga</span><b>${esc(p.vaga)}</b></div>
        <div><span>Valor da viagem (cliente)</span><b>${brl(p.valorViagem)}</b></div><div><span>Valor da viagem (motorista)</span><b>${brl(p.valorMotorista)}</b></div>
        <div><span>Início</span><b>${p.inicio || '—'}</b></div><div><span>Fim</span><b>${p.fim || '—'}</b></div>
      </div>
      <div class="dt-prog"><div class="prog-t"><span>Viagens realizadas</span><b>${p.qtdViagens} de ${p.qtdPrevista} (${pc}%)</b></div>${meter(pc, pc >= 100)}</div>
      <div class="dt-fin">
        <div><span>Total produzido</span><b>${brl(total(p))}</b><small>${p.ocorrencia ? 'Ocorrência: −' + brl(p.valorOcorrencia) : 'Sem ocorrências'}</small></div>
        <div><span>Pagamento ao motorista</span><b>${pgm ? brl(pgTotal(pgm)) : brl(custo(p))}</b><small>${pgm ? `Pago em ${fdate(pgm.data)} · vale ${brl(pgm.vale)}` : 'Ainda não lançado'}</small></div>
        <div><span>Recebimento do cliente</span><b>${rec ? brl(rec.valor) : brl(total(p))}</b><small>${rec ? `${rec.status} · ${fdate(rec.data)} · ${esc(rec.forma)}` : 'Ainda não lançado'}</small></div>
      </div>
      <div class="steps">${step('Escala', p.status === 'Finalizada', p.status)}${step('Valor a receber', rc === 'Recebido', rc)}${step('Valor a pagar', pg === 'Pago', pg)}</div>`,
    footer: `<button class="btn btn-sec" data-x>Fechar</button>
      ${p.qtdViagens > 0 && pg !== 'Pago' ? `<button class="btn btn-sec" id="dtPag">${ic('wallet', 15)}Lançar pagamento</button>` : ''}
      ${p.qtdViagens > 0 && rc !== 'Recebido' ? `<button class="btn btn-sec" id="dtRec">${ic('receipt', 15)}${rec ? 'Editar recebimento' : 'Lançar recebimento'}</button>` : ''}
      <button class="btn btn-pri" id="dtEdit">${ic('pencil', 15)}Editar programação</button>` });
  $('#dtEdit').onclick = () => { closeModal(); form(progCfg(p.tipo), p); };
  if ($('#dtPag')) $('#dtPag').onclick = () => { closeModal(); form(pagCfg((by('motoristas', p.motoristaId) || {}).tipo || 'Próprio'), null, { progId: p.id, qtd: p.qtdViagens, valorViagem: p.valorMotorista }); };
  if ($('#dtRec')) $('#dtRec').onclick = () => { closeModal(); rec ? form(recCfg, rec) : form(recCfg, null, { progId: p.id, valor: Math.max(0, total(p) - recProg(p.id)), status: 'Recebido' }); };
}

/* ---------------- Configuração das telas ---------------- */
const colData = { label: 'Data', render: r => fdate(r.data), sv: r => r.data };
const progCfg = tipo => ({
  col: 'progs', group: 'Programação', title: tipo === 'escala' ? 'Programar escala' : 'Programar serviço',
  newText: tipo === 'escala' ? 'Nova escala' : 'Novo serviço', editText: tipo === 'escala' ? 'Editar escala' : 'Editar serviço', searchPh: 'por lote, cliente, motorista ou placa',
  desc: 'Acompanhe cada operação da programação até o pagamento e o recebimento.',
  rows: () => S.progs.filter(p => p.tipo === tipo).sort((a, b) => b.data.localeCompare(a.data)),
  summary: rs => [['Programações', num(rs.length), 'calendar', 'Total cadastrado'], ['Em andamento', num(rs.filter(p => p.status === 'Em andamento').length), 'truck', 'Operações ativas agora'], ['Finalizadas', num(rs.filter(p => p.status === 'Finalizada').length), 'check', `${pct(rs.filter(p => p.status === 'Finalizada').length, rs.length)}% do total`], ['Total produzido', brl(sumBy(rs, total)), 'dollar', `${num(sumBy(rs, p => p.qtdViagens))} viagens realizadas`]],
  filter: { label: 'Status', get: p => p.status, options: ['Programada', 'Em andamento', 'Finalizada'] },
  cols: [
    colData, { label: 'Cliente', render: p => esc(nome('empresas', p.clienteId)) }, { label: 'Lote', k: 'lote', cls: 'mono' },
    { label: 'Motorista', render: p => person(nome('motoristas', p.motoristaId)) }, { label: 'Placa', k: 'placa', cls: 'mono' },
    { label: 'Viagens', sv: p => p.qtdViagens, render: p => { const v = pct(p.qtdViagens, p.qtdPrevista); return `<div class="prog"><div class="prog-t"><span>${p.qtdViagens}/${p.qtdPrevista}</span><span>${v}%</span></div>${meter(v, v >= 100)}</div>`; } },
    { label: 'Total produzido', r: 1, cls: 'strong', sv: total, render: p => brl(total(p)) },
    { label: 'Status', render: p => badge(p.status, stProg(p.status)) },
    { label: 'Pagamento', render: p => badge(...stPagar(p)) }, { label: 'Recebimento', render: p => badge(...stReceber(p)) }
  ],
  fields: [
    { k: 'data', label: 'Data', type: 'date', req: 1 },
    { k: 'clienteId', label: 'Cliente', type: 'select', req: 1, options: () => S.empresas.map(e => [e.id, e.nome]) },
    { k: 'lote', label: 'Lote', req: 1, ph: 'Ex.: 25GX5587HR' }, { k: 'vaga', label: 'Vaga', type: 'number' },
    { k: 'motoristaId', label: 'Motorista', type: 'select', req: 1, options: () => S.motoristas.filter(m => m.status !== 'Inativo').map(m => [m.id, `${m.nome} (${m.tipo})`]) },
    { k: 'placa', label: 'Placa', type: 'select', req: 1, options: () => S.veiculos.map(x => [x.placa, `${x.placa} · ${x.modelo}`]) },
    { k: 'valorViagem', label: 'Valor da viagem (cliente)', type: 'number', req: 1 }, { k: 'valorMotorista', label: 'Valor da viagem (motorista)', type: 'number', req: 1 },
    { k: 'qtdPrevista', label: 'Viagens previstas', type: 'number', req: 1 }, { k: 'qtdViagens', label: 'Viagens realizadas', type: 'number' },
    { k: 'inicio', label: 'Início', type: 'time' }, { k: 'fim', label: 'Fim', type: 'time' },
    { k: 'status', label: 'Status', type: 'select', req: 1, options: ['Programada', 'Em andamento', 'Finalizada'] },
    { k: 'valorOcorrencia', label: 'Valor da ocorrência (desconto)', type: 'number' },
    { k: 'ocorrencia', label: 'Houve ocorrência nesta operação', type: 'checkbox', full: 1 }
  ],
  defaults: () => ({ tipo, data: ymd(new Date()), status: 'Programada', qtdViagens: 0, valorOcorrencia: 0 }),
  onChange: (v, n) => n === 'motoristaId' ? { placa: (S.veiculos.find(x => x.proprietario === nome('motoristas', v.motoristaId)) || {}).placa || '' } : {},
  beforeSave: o => { o.tipo = tipo; if (o.status === 'Finalizada' && !o.qtdViagens) o.qtdViagens = o.qtdPrevista; },
  log: (o, n) => `${n ? 'Nova programação' : 'Programação atualizada'}: lote ${o.lote} — ${nome('motoristas', o.motoristaId)}`,
  detail: progDetail
});
const pagCfg = tipo => {
  const ok = id => { const p = by('progs', id); return p && (by('motoristas', p.motoristaId) || {}).tipo === tipo; };
  const mot = g => nome('motoristas', (by('progs', g.progId) || {}).motoristaId);
  const prop = tipo === 'Próprio';
  return {
    col: 'pagamentos', group: 'Pagamentos', title: prop ? 'Pagamento de motoristas' : 'Pagamento de terceiros',
    newText: 'Novo pagamento', editText: 'Editar pagamento', searchPh: 'por motorista ou lote',
    desc: prop ? 'Pagamentos aos motoristas da frota própria. Cada lançamento atualiza o status da programação.' : 'Pagamentos a agregados e terceiros. Cada lançamento atualiza o status da programação.',
    rows: () => S.pagamentos.filter(g => ok(g.progId)).sort((a, b) => b.data.localeCompare(a.data)),
    summary: rs => [['Pagamentos', num(rs.length), 'receipt', 'Lançamentos registrados'], ['Total pago (líquido)', brl(sumBy(rs, pgTotal)), 'wallet', 'Já descontados os vales'], ['Vales adiantados', brl(sumBy(rs, g => g.vale)), 'dollar', `${rs.filter(g => g.vale > 0).length} pagamento(s) com vale`], ['Média por pagamento', brl(rs.length ? sumBy(rs, pgTotal) / rs.length : 0), 'trend', 'Valor líquido médio']],
    filter: { label: 'Forma', get: g => g.forma, options: ['PIX', 'TED', 'Dinheiro'] },
    cols: [
      { label: 'Data de pagamento', render: g => fdate(g.data), sv: g => g.data },
      { label: 'Motorista', render: g => person(mot(g)) },
      { label: 'Lote', cls: 'mono', render: g => esc((by('progs', g.progId) || {}).lote) },
      { label: 'Viagens', r: 1, sv: g => g.qtd, render: g => num(g.qtd) }, { label: 'Valor da viagem', r: 1, sv: g => g.valorViagem, render: g => brl(g.valorViagem) },
      { label: 'Vale', r: 1, sv: g => g.vale, render: g => brl(g.vale) }, { label: 'Total pago', r: 1, cls: 'strong', sv: pgTotal, render: g => brl(pgTotal(g)) }, { label: 'Forma', k: 'forma' }
    ],
    fields: [
      { k: 'progId', label: 'Programação (lote)', type: 'select', req: 1, full: 1, options: () => S.progs.filter(p => ok(p.id) && p.qtdViagens > 0).map(p => [p.id, progLabel(p)]) },
      { k: 'data', label: 'Data de pagamento', type: 'date', req: 1 }, { k: 'forma', label: 'Forma de pagamento', type: 'select', req: 1, options: ['PIX', 'TED', 'Dinheiro'] },
      { k: 'qtd', label: 'Quantidade de viagens', type: 'number', req: 1 }, { k: 'valorViagem', label: 'Valor da viagem', type: 'number', req: 1 }, { k: 'vale', label: 'Vale (desconto)', type: 'number' }
    ],
    defaults: () => ({ data: ymd(new Date()), forma: 'PIX', vale: 0 }),
    onChange: (v, n) => { if (n !== 'progId') return {}; const p = by('progs', v.progId); return p ? { qtd: p.qtdViagens, valorViagem: p.valorMotorista } : {}; },
    log: o => `Pagamento lançado: ${mot(o)} — ${brl(pgTotal(o))}`
  };
};
const abastCfg = {
  col: 'abastecimentos', group: 'Pagamentos', title: 'Abastecimentos', newText: 'Novo abastecimento', editText: 'Editar abastecimento', searchPh: 'por placa ou posto',
  desc: 'Controle de combustível por veículo, com preço médio por litro.',
  rows: () => [...S.abastecimentos].sort((a, b) => b.data.localeCompare(a.data)),
  summary: rs => { const l = sumBy(rs, a => a.litros), v = sumBy(rs, a => a.valorTotal); return [['Abastecimentos', num(rs.length), 'fuel', 'Lançamentos registrados'], ['Total em litros', num(l) + ' L', 'fuel', `${num(rs.length ? Math.round(l / rs.length) : 0)} L por abastecimento`], ['Valor total', brl(v), 'dollar', 'Gasto com combustível'], ['Preço médio por litro', brl(l ? v / l : 0), 'trend', 'Média ponderada']]; },
  filter: { label: 'Placa', get: a => a.placa, options: () => S.veiculos.map(v => v.placa) },
  cols: [{ label: 'Data', render: a => fdate(a.data), sv: a => a.data }, { label: 'Placa', k: 'placa', cls: 'mono' }, { label: 'Veículo', render: a => esc(veic(a.placa).modelo || '—') }, { label: 'Local', k: 'local' }, { label: 'Litros', r: 1, sv: a => a.litros, render: a => num(a.litros) }, { label: 'Valor total', r: 1, cls: 'strong', sv: a => a.valorTotal, render: a => brl(a.valorTotal) }, { label: 'R$/L', r: 1, sv: a => a.litros ? a.valorTotal / a.litros : 0, render: a => brl(a.litros ? a.valorTotal / a.litros : 0) }],
  fields: [{ k: 'data', label: 'Data', type: 'date', req: 1 }, { k: 'placa', label: 'Placa', type: 'select', req: 1, options: () => S.veiculos.map(v => [v.placa, `${v.placa} · ${v.modelo}`]) }, { k: 'litros', label: 'Litros', type: 'number', req: 1 }, { k: 'valorTotal', label: 'Valor total', type: 'number', req: 1 }, { k: 'local', label: 'Local de abastecimento (posto)', type: 'select', full: 1, req: 1, options: v => { const l = S.fornecedores.filter(f => f.categoria === 'Posto de combustível').map(f => f.nome); if (v.local && !l.includes(v.local)) l.push(v.local); return l; } }],
  defaults: () => ({ data: ymd(new Date()) }),
  log: o => `Abastecimento registrado: ${o.placa} — ${brl(o.valorTotal)}`
};
const recCfg = {
  col: 'recebimentos', group: 'A receber', title: "RPA's — Recebimentos", newText: 'Novo recebimento', editText: 'Editar recebimento', searchPh: 'por lote ou cliente',
  desc: 'Valores a receber dos clientes por lote, com acompanhamento do que já foi pago.',
  rows: () => [...S.recebimentos].sort((a, b) => b.data.localeCompare(a.data)),
  summary: rs => { const rc = rs.filter(g => g.status === 'Recebido'), ab = rs.filter(g => g.status !== 'Recebido'); return [['Recebido', brl(sumBy(rc, g => g.valor)), 'check', `${rc.length} lançamento(s)`], ['Em aberto', brl(sumBy(ab, g => g.valor)), 'clock', `${ab.length} lançamento(s) pendente(s)`], ['Taxa de recebimento', pct(sumBy(rc, g => g.valor), sumBy(rs, g => g.valor)) + '%', 'pie', 'Recebido sobre o total lançado'], ['Ticket médio', brl(rs.length ? sumBy(rs, g => g.valor) / rs.length : 0), 'trend', 'Por lote']]; },
  filter: { label: 'Status', get: g => g.status, options: ['Recebido', 'Pendente'] },
  cols: [{ label: 'Recebido em / vencimento', render: g => fdate(g.data), sv: g => g.data }, { label: 'Lote', cls: 'mono', render: g => esc((by('progs', g.progId) || {}).lote) }, { label: 'Cliente', render: g => person(nome('empresas', (by('progs', g.progId) || {}).clienteId)) }, { label: 'Valor', r: 1, cls: 'strong', sv: g => g.valor, render: g => brl(g.valor) }, { label: 'Forma', k: 'forma' }, { label: 'Status', render: g => badge(g.status, g.status === 'Recebido' ? 'ok' : 'wait') }],
  fields: [
    { k: 'progId', label: 'Programação (lote)', type: 'select', req: 1, full: 1, options: () => S.progs.filter(p => p.qtdViagens > 0).map(p => [p.id, progLabel(p)]) },
    { k: 'data', label: 'Data do recebimento (ou vencimento)', type: 'date', req: 1 }, { k: 'valor', label: 'Valor', type: 'number', req: 1 },
    { k: 'forma', label: 'Forma de pagamento', type: 'select', req: 1, options: ['Boleto', 'TED', 'PIX'] }, { k: 'status', label: 'Status', type: 'select', req: 1, options: ['Pendente', 'Recebido'] }
  ],
  defaults: () => ({ data: ymd(new Date()), status: 'Recebido', forma: 'TED' }),
  onChange: (v, n) => { if (n !== 'progId') return {}; const p = by('progs', v.progId); return p ? { valor: total(p) } : {}; },
  quick: { label: 'Marcar como recebido', icon: 'check', show: g => g.status !== 'Recebido', run: g => { g.status = 'Recebido'; g.data = ymd(new Date()); save(`Recebimento confirmado: ${(by('progs', g.progId) || {}).lote} — ${brl(g.valor)}`, '💰'); } },
  log: o => `Recebimento ${o.status === 'Recebido' ? 'confirmado' : 'registrado'}: ${(by('progs', o.progId) || {}).lote} — ${brl(o.valor)}`
};
const cadastros = {
  motoristas: {
    col: 'motoristas', group: 'Cadastros', title: 'Motoristas', newText: 'Novo motorista', editText: 'Editar motorista', searchPh: 'por nome, CPF ou telefone', desc: 'Motoristas da frota própria e terceiros que podem ser programados.',
    summary: rs => [['Motoristas', num(rs.length), 'users', 'Total cadastrado'], ['Frota própria', num(rs.filter(m => m.tipo === 'Próprio').length), 'user', 'Motoristas próprios'], ['Terceiros', num(rs.filter(m => m.tipo === 'Terceiro').length), 'users', 'Agregados e terceiros'], ['Ativos', num(rs.filter(m => m.status === 'Ativo').length), 'check', 'Disponíveis para programação']],
    filter: { label: 'Tipo', get: m => m.tipo, options: ['Próprio', 'Terceiro'] },
    cols: [{ label: 'Nome', sv: m => m.nome, render: m => person(m.nome) }, { label: 'CPF', k: 'cpf' }, { label: 'Telefone', k: 'telefone' }, { label: 'CNH', k: 'cnh' }, { label: 'Tipo', render: m => badge(m.tipo, m.tipo === 'Próprio' ? 'run' : 'no') }, { label: 'Viagens', r: 1, sv: m => sumBy(S.progs.filter(p => p.motoristaId === m.id), p => p.qtdViagens), render: m => num(sumBy(S.progs.filter(p => p.motoristaId === m.id), p => p.qtdViagens)) }, { label: 'Status', render: m => badge(m.status, m.status === 'Ativo' ? 'ok' : 'no') }],
    fields: [{ k: 'nome', label: 'Nome completo', req: 1, full: 1 }, { k: 'cpf', label: 'CPF', req: 1, ph: '000.000.000-00' }, { k: 'telefone', label: 'Telefone', ph: '(00) 00000-0000' }, { k: 'cnh', label: 'Categoria da CNH', type: 'select', options: ['C', 'D', 'E'] }, { k: 'tipo', label: 'Tipo', type: 'select', req: 1, options: ['Próprio', 'Terceiro'] }, { k: 'status', label: 'Status', type: 'select', req: 1, options: ['Ativo', 'Inativo'] }],
    defaults: () => ({ tipo: 'Próprio', status: 'Ativo', cnh: 'E' }), log: (o, n) => `${n ? 'Motorista cadastrado' : 'Motorista atualizado'}: ${o.nome}`
  },
  veiculos: {
    col: 'veiculos', group: 'Cadastros', title: 'Veículos', newText: 'Novo veículo', editText: 'Editar veículo', searchPh: 'por placa, modelo ou proprietário', desc: 'Frota própria e veículos de terceiros.',
    summary: rs => [['Veículos', num(rs.length), 'truck', 'Total cadastrado'], ['Frota própria', num(rs.filter(v => v.proprietario === 'Frota própria').length), 'building', 'Veículos da empresa'], ['De terceiros', num(rs.filter(v => v.proprietario !== 'Frota própria').length), 'users', 'Agregados'], ['Combustível', brl(sumBy(S.abastecimentos, a => a.valorTotal)), 'fuel', 'Total abastecido']],
    cols: [{ label: 'Placa', k: 'placa', cls: 'mono' }, { label: 'Modelo', k: 'modelo' }, { label: 'Tipo', k: 'tipo' }, { label: 'Proprietário', k: 'proprietario' }, { label: 'Abastecimentos', r: 1, sv: v => S.abastecimentos.filter(a => a.placa === v.placa).length, render: v => num(S.abastecimentos.filter(a => a.placa === v.placa).length) }, { label: 'Litros', r: 1, sv: v => sumBy(S.abastecimentos.filter(a => a.placa === v.placa), a => a.litros), render: v => num(sumBy(S.abastecimentos.filter(a => a.placa === v.placa), a => a.litros)) + ' L' }],
    fields: [{ k: 'placa', label: 'Placa', req: 1, ph: 'AAA-0A00' }, { k: 'modelo', label: 'Modelo', req: 1 }, { k: 'tipo', label: 'Tipo', type: 'select', options: ['Cavalo mecânico', 'Carreta', 'Truck', 'VUC'] }, { k: 'proprietario', label: 'Proprietário', ph: 'Frota própria ou nome do terceiro' }],
    defaults: () => ({ tipo: 'Cavalo mecânico', proprietario: 'Frota própria' }), log: (o, n) => `${n ? 'Veículo cadastrado' : 'Veículo atualizado'}: ${o.placa}`
  },
  empresas: {
    col: 'empresas', group: 'Cadastros', title: 'Clientes', newText: 'Novo cliente', editText: 'Editar cliente', searchPh: 'por nome ou CNPJ', desc: 'Empresas atendidas pela operação.',
    summary: rs => [['Clientes', num(rs.length), 'building', 'Empresas cadastradas'], ['Faturamento total', brl(sumBy(S.progs, total)), 'dollar', 'Todas as programações'], ['Programações', num(S.progs.length), 'calendar', 'Para todos os clientes']],
    cols: [{ label: 'Empresa', sv: e => e.nome, render: e => person(e.nome) }, { label: 'CNPJ', k: 'cnpj' }, { label: 'Contato', k: 'contato' }, { label: 'Programações', r: 1, sv: e => S.progs.filter(p => p.clienteId === e.id).length, render: e => num(S.progs.filter(p => p.clienteId === e.id).length) }, { label: 'Faturamento', r: 1, cls: 'strong', sv: e => sumBy(S.progs.filter(p => p.clienteId === e.id), total), render: e => brl(sumBy(S.progs.filter(p => p.clienteId === e.id), total)) }],
    fields: [{ k: 'nome', label: 'Razão social / nome fantasia', req: 1, full: 1 }, { k: 'cnpj', label: 'CNPJ', ph: '00.000.000/0000-00' }, { k: 'contato', label: 'Contato' }],
    log: (o, n) => `${n ? 'Empresa cadastrada' : 'Empresa atualizada'}: ${o.nome}`
  },
  fornecedores: {
    col: 'fornecedores', group: 'Cadastros', title: 'Fornecedores', newText: 'Novo fornecedor', editText: 'Editar fornecedor', searchPh: 'por nome, CNPJ ou categoria', desc: 'Postos de combustível, oficinas, pneus e peças usados pela operação.',
    summary: rs => [['Fornecedores', num(rs.length), 'building', 'Total cadastrado'], ['Postos de combustível', num(rs.filter(f => f.categoria === 'Posto de combustível').length), 'fuel', 'Usados nos abastecimentos'], ['Gasto com combustível', brl(sumBy(S.abastecimentos, a => a.valorTotal)), 'dollar', `${num(S.abastecimentos.length)} abastecimentos`]],
    filter: { label: 'Categoria', get: f => f.categoria, options: ['Posto de combustível', 'Oficina mecânica', 'Pneus', 'Peças', 'Outros'] },
    cols: [{ label: 'Fornecedor', sv: f => f.nome, render: f => person(f.nome) }, { label: 'CNPJ', k: 'cnpj' }, { label: 'Categoria', render: f => badge(f.categoria, f.categoria === 'Posto de combustível' ? 'run' : 'no') }, { label: 'Contato', k: 'contato' }, { label: 'Telefone', k: 'telefone' }, { label: 'Abastecimentos', r: 1, sv: f => S.abastecimentos.filter(a => a.local === f.nome).length, render: f => num(S.abastecimentos.filter(a => a.local === f.nome).length) }, { label: 'Status', render: f => badge(f.status || 'Ativo', f.status === 'Inativo' ? 'no' : 'ok') }],
    fields: [{ k: 'nome', label: 'Razão social / nome fantasia', req: 1, full: 1 }, { k: 'cnpj', label: 'CNPJ', ph: '00.000.000/0000-00' }, { k: 'categoria', label: 'Categoria', type: 'select', req: 1, options: ['Posto de combustível', 'Oficina mecânica', 'Pneus', 'Peças', 'Outros'] }, { k: 'contato', label: 'Contato' }, { k: 'telefone', label: 'Telefone', ph: '(00) 0000-0000' }, { k: 'status', label: 'Status', type: 'select', req: 1, options: ['Ativo', 'Inativo'] }],
    defaults: () => ({ categoria: 'Posto de combustível', status: 'Ativo' }),
    log: (o, n) => `${n ? 'Fornecedor cadastrado' : 'Fornecedor atualizado'}: ${o.nome}`
  },
  usuarios: {
    col: 'usuarios', group: 'Cadastros', title: 'Usuários', newText: 'Novo usuário', editText: 'Editar usuário', searchPh: 'por nome ou e-mail', desc: 'O supervisor alimenta e controla todo o sistema e pode incluir outras pessoas para ajudar, acompanhando tudo.',
    summary: rs => [['Usuários', num(rs.length), 'users', 'Com acesso ao sistema'], ['Acesso total', num(rs.filter(u => ACESSO_TOTAL.includes(u.perfil)).length), 'lock', 'Supervisor e administradores'], ['Ativos', num(rs.filter(u => u.status !== 'Inativo').length), 'check', 'Podem entrar no sistema']],
    filter: { label: 'Perfil', get: u => u.perfil, options: PERFIS },
    cols: [{ label: 'Nome', sv: u => u.nome, render: u => person(u.nome) + (me() && u.id === me().id ? ' <span class="badge b-run" style="margin-left:6px">Você</span>' : '') }, { label: 'E-mail', k: 'email' }, { label: 'Perfil', render: u => badge(u.perfil, ACESSO_TOTAL.includes(u.perfil) ? 'run' : 'no') }, { label: 'Permissões', render: u => esc(PERMISSOES[u.perfil] || '—') }, { label: 'Status', render: u => badge(u.status || 'Ativo', u.status === 'Inativo' ? 'no' : 'ok') }],
    fields: [{ k: 'nome', label: 'Nome completo', req: 1, full: 1 }, { k: 'email', label: 'E-mail', type: 'email', req: 1, full: 1 }, { k: 'perfil', label: 'Perfil', type: 'select', req: 1, options: PERFIS }, { k: 'status', label: 'Status', type: 'select', req: 1, options: ['Ativo', 'Inativo'] }],
    defaults: () => ({ perfil: 'Operação', status: 'Ativo' }),
    log: (o, n) => `${n ? 'Usuário cadastrado' : 'Usuário atualizado'}: ${o.nome}`
  }
};

/* ---------------- Dashboard ---------------- */
let charts = [], lastKpi = {};
let per = store.get(PKEY) || '30';
const PERIODS = [['1', 'Hoje'], ['7', '7 dias'], ['30', '30 dias'], ['all', 'Tudo']];
const perLabel = p => ({ '1': 'hoje', '7': 'últimos 7 dias', '30': 'últimos 30 dias', all: 'todo o período' }[p]);
const sinceOf = p => { if (p === 'all') return ''; const d = new Date(); d.setDate(d.getDate() - (+p - 1)); return ymd(d); };
const daysOpen = d => Math.max(0, Math.round((new Date(ymd(new Date())) - new Date(d)) / 864e5));
const kshort = v => Math.abs(v) >= 1000 ? 'R$ ' + num(Math.round(v / 100) / 10) + ' mil' : 'R$ ' + num(v);

function pendencias(P) {
  const out = [];
  P.filter(p => p.status === 'Finalizada').forEach(p => {
    if (stReceber(p)[0] !== 'Recebido') out.push({ tipo: 'Receber', p, quem: nome('empresas', p.clienteId), valor: total(p) - recProg(p.id), dias: daysOpen(p.data) });
    if (stPagar(p)[0] !== 'Pago') out.push({ tipo: 'Pagar', p, quem: nome('motoristas', p.motoristaId), valor: Math.max(0, custo(p) - pagoProg(p.id)), dias: daysOpen(p.data) });
  });
  return out.filter(x => x.valor > 0).sort((a, b) => b.dias - a.dias);
}
function metrics(p) {
  const s = sinceOf(p);
  const P = S.progs.filter(x => !s || x.data >= s);
  const ids = new Set(P.map(x => x.id));
  const A = S.abastecimentos.filter(a => !s || a.data >= s);
  const produzido = sumBy(P, total);
  const recebido = sumBy(S.recebimentos.filter(g => ids.has(g.progId) && g.status === 'Recebido'), g => g.valor);
  const custoTot = sumBy(P, custo);
  const pago = sumBy(P, x => Math.min(pagoProg(x.id), custo(x)));
  const comb = sumBy(A, a => a.valorTotal);
  const viagens = sumBy(P, x => x.qtdViagens);
  const margem = produzido - custoTot - comb;
  const pend = pendencias(P);
  return {
    P, produzido, recebido, aReceber: Math.max(0, produzido - recebido), custoTot, pago, aPagar: Math.max(0, custoTot - pago),
    comb, litros: sumBy(A, a => a.litros), viagens, margem, margemPct: pct(margem, produzido), ticket: viagens ? produzido / viagens : 0,
    ativas: S.progs.filter(x => x.status === 'Em andamento'), programadas: S.progs.filter(x => x.status === 'Programada'),
    pend, pendRec: pend.filter(x => x.tipo === 'Receber'), pendPag: pend.filter(x => x.tipo === 'Pagar')
  };
}
function serie(p) {
  const first = S.progs.reduce((m, x) => x.data < m ? x.data : m, ymd(new Date()));
  const n = p === 'all' ? daysOpen(first) + 1 : Math.max(14, +p);
  const days = [];
  for (let i = n - 1; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(ymd(d)); }
  return { days, prod: days.map(d => sumBy(S.progs.filter(x => x.data === d), total)), cust: days.map(d => sumBy(S.progs.filter(x => x.data === d), custo)) };
}
const flash = (id, v) => lastKpi[id] !== undefined && lastKpi[id] !== v ? 'flash' : '';
function kpiHtml(m) {
  const pr = pct(m.recebido, m.produzido);
  return [
    ['Faturamento', brl(m.produzido), 'dollar', `${num(m.viagens)} viagens · ticket médio ${brl(m.ticket)}`, '', flash('produzido', m.produzido)],
    ['Recebido', brl(m.recebido), 'check', `${pr}% do faturamento`, meter(pr), flash('recebido', m.recebido)],
    ['A receber', brl(m.aReceber), 'clock', `${m.pendRec.length} lote(s) finalizado(s) em aberto`, '', flash('aReceber', m.aReceber)],
    ['Margem operacional', `<span class="${m.margem < 0 ? 'neg' : ''}">${brl(m.margem)}</span>`, 'trend', `${m.margemPct}% · faturamento − motoristas − combustível`, meter(m.margemPct), flash('margem', m.margem)]
  ].map(statCard).join('');
}
function stripHtmlBlock(m) {
  const c = (icon, l, v, s) => `<div><span class="ti">${ic(icon, 17)}</span><div><span>${l}</span><b>${v}</b><em>${s}</em></div></div>`;
  return `<div class="strip">${c('truck', 'Em andamento', num(m.ativas.length), 'operações agora')}${c('calendar', 'Programadas', num(m.programadas.length), 'aguardando início')}${c('wallet', 'A pagar a motoristas', brl(m.aPagar), 'inclui operações em andamento')}${c('fuel', 'Combustível', brl(m.comb), num(m.litros) + ' litros')}</div>`;
}
function stackHtml(m) {
  const row = (t, a, la, b, lb) => {
    const tot = a + b, pa = tot ? a / tot * 100 : 0;
    return `<div class="stack-row"><div class="stack-h"><b>${t}</b><span>${brl(tot)}</span></div>
      <div class="stack">${pa > 0 ? `<i class="s-a" style="width:${pa}%"></i>` : ''}${pa < 100 ? `<i class="s-b" style="width:${100 - pa}%"></i>` : ''}</div>
      <div class="stack-l"><span><i class="s-a"></i>${la} <b>${brl(a)}</b></span><span><i class="s-b"></i>${lb} <b>${brl(b)}</b></span></div></div>`;
  };
  return row('Clientes', m.recebido, 'Recebido', m.aReceber, 'A receber') + row('Motoristas e terceiros', m.pago, 'Pago', m.aPagar, 'A pagar');
}
function pendHtml(list, n, only) {
  if (!list.length) return emptyState('Nenhuma pendência', '<div>Tudo em dia no período selecionado.</div>', 'check');
  return `<div class="tscroll"><table class="tbl-min"><thead><tr>${only ? '' : '<th>Tipo</th>'}<th>Lote</th><th>${only === 'Receber' ? 'Cliente' : only === 'Pagar' ? 'Motorista' : 'Cliente / motorista'}</th><th class="r">Valor</th><th class="r">Em aberto</th></tr></thead><tbody>${list.slice(0, n).map(x => `<tr class="click" data-prog="${x.p.id}" title="Abrir ficha do lote">${only ? '' : `<td>${badge(x.tipo === 'Receber' ? 'A receber' : 'A pagar', x.tipo === 'Receber' ? 'run' : 'wait')}</td>`}<td>${esc(x.p.lote)}</td><td>${esc(x.quem)}</td><td class="r">${brl(x.valor)}</td><td class="r ${x.dias > 15 ? 'late' : ''}">${x.dias} dia${x.dias === 1 ? '' : 's'}</td></tr>`).join('')}</tbody></table></div>`;
}
function opsHtml(n) {
  const a = [...S.progs.filter(p => p.status === 'Em andamento'), ...S.progs.filter(p => p.status === 'Programada')].slice(0, n);
  if (!a.length) return emptyState('Nenhuma operação em andamento', '', 'truck');
  return a.map(p => {
    const v = pct(p.qtdViagens, p.qtdPrevista);
    return `<div class="op"><div class="op-h">${person(nome('motoristas', p.motoristaId))}${badge(p.status, stProg(p.status))}</div>
      <div class="op-s">${esc(nome('empresas', p.clienteId))} · Lote ${esc(p.lote)} · ${esc(p.placa)}</div>
      ${meter(v, v >= 100)}<div class="op-f"><span>${p.qtdViagens} de ${p.qtdPrevista} viagens (${v}%)</span><span>${brl(total(p))}</span></div></div>`;
  }).join('');
}
function clientesHtml(P) {
  const tot = sumBy(P, total) || 1;
  const r = S.empresas.map(e => [e.nome, sumBy(P.filter(p => p.clienteId === e.id), total)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);
  if (!r.length) return emptyState('Sem faturamento no período', '', 'building');
  return r.map(([n, v]) => `<div class="hb"><div class="hb-h"><span>${esc(n)}</span><b>${brl(v)}</b></div>${meter(v / tot * 100)}<small>${pct(v, tot)}% do faturamento</small></div>`).join('');
}
function rankHtml(P) {
  const m = {};
  P.forEach(p => { m[p.motoristaId] = m[p.motoristaId] || { v: 0, t: 0 }; m[p.motoristaId].v += total(p); m[p.motoristaId].t += p.qtdViagens; });
  const r = Object.entries(m).filter(e => e[1].v > 0).sort((a, b) => b[1].v - a[1].v).slice(0, 5);
  if (!r.length) return emptyState('Sem produção no período', '', 'users');
  const mx = r[0][1].v;
  return r.map(([id, o], i) => `<div class="rank-row"><span class="rank-n">${i + 1}</span><div><div class="hb-h"><span>${esc(nome('motoristas', id))}</span><b>${brl(o.v)}</b></div>${meter(o.v / mx * 100)}<small style="font-size:12px;color:var(--sub)">${num(o.t)} viagens</small></div></div>`).join('');
}
const panel = (title, body, note = '') => `<div class="panel"><div class="panel-h"><h3>${title}</h3>${note ? `<small>${note}</small>` : ''}</div><div class="panel-b">${body}</div></div>`;

function dashboard() {
  const m = metrics(per);
  const st = ['Programada', 'Em andamento', 'Finalizada'], stc = ['#c9d8ee', '#4f83c7', '#002147'];
  const stn = st.map(s => m.P.filter(p => p.status === s).length);
  const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  $('#app').innerHTML = `
    ${pageHead('', 'Dashboard', `<span class="live-tag"><i></i>Tempo real</span><span>Período: ${perLabel(per)}</span><span class="dotsep">·</span><span>Atualizado às ${hora}</span>`,
      `<div class="seg" role="group" aria-label="Período">${PERIODS.map(([v, l]) => `<button data-p="${v}" class="${v === per ? 'on' : ''}">${l}</button>`).join('')}</div><button class="btn btn-pri" id="btnTv">${ic('tv', 15)}Modo TV</button>`)}
    <div class="stats">${kpiHtml(m)}</div>
    ${stripHtmlBlock(m)}
    <div class="grid g-21">
      ${panel('Faturamento × custo com motoristas', '<div class="chartbox"><canvas id="c1" aria-label="Gráfico de faturamento diário"></canvas></div>', 'Por dia')}
      ${panel('Status das programações', `<div class="donut-w"><div class="chartbox sm"><canvas id="c2"></canvas><div class="donut-c"><b>${m.P.length}</b><span>programações</span></div></div>
        <ul class="leg">${st.map((s, i) => `<li><i style="background:${stc[i]}"></i>${s}<b>${stn[i]}</b><em>${pct(stn[i], m.P.length)}%</em></li>`).join('')}</ul></div>`)}
    </div>
    <div class="grid g-12">
      ${panel('Fluxo financeiro', stackHtml(m), perLabel(per))}
      ${panel('Pendências financeiras', pendHtml(m.pend, 6), 'Lotes finalizados aguardando pagamento ou recebimento')}
    </div>
    <div class="grid g-3">
      ${panel('Operações em andamento', opsHtml(4), `${m.ativas.length} ativa(s)`)}
      ${panel('Faturamento por cliente', clientesHtml(m.P))}
      ${panel('Ranking de motoristas', rankHtml(m.P), 'Por faturamento')}
    </div>
    ${panel('Atividade recente', `<ul class="feed">${S.log.slice(0, 8).map(l => { const [i, t] = feedIc(l.icon); return `<li><span class="f-ic t-${t}">${ic(i, 15)}</span><div><div class="f-msg">${esc(l.msg)}</div><small>${new Date(l.t).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</small></div></li>`; }).join('')}</ul>`, 'Últimos lançamentos no sistema')}`;
  lastKpi = { produzido: m.produzido, recebido: m.recebido, aReceber: m.aReceber, margem: m.margem };
  $$('.seg [data-p]').forEach(b => b.onclick = () => { per = b.dataset.p; store.set(PKEY, per); render(); });
  $('#btnTv').onclick = tvEnter;
  $$('#app [data-prog]').forEach(tr => tr.onclick = () => progDetail(by('progs', tr.dataset.prog)));
  charts.forEach(c => c.destroy()); charts = [];
  if (typeof Chart === 'undefined') return;
  Chart.defaults.font.family = 'Inter, Arial, sans-serif';
  charts.push(dailyChart($('#c1'), false));
  charts.push(new Chart($('#c2'), { type: 'doughnut', data: { labels: st, datasets: [{ data: stn, backgroundColor: stc, borderWidth: 3, borderColor: '#fff', hoverOffset: 4 }] }, options: { maintainAspectRatio: false, cutout: '74%', plugins: { legend: { display: false } } } }));
}
function chartBase(dark) {
  const tick = dark ? '#b8cbe6' : '#64748b', grid = dark ? 'rgba(255,255,255,.08)' : '#eef2f6';
  return { maintainAspectRatio: false, animation: { duration: 500 }, interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom', labels: { color: tick, usePointStyle: true, pointStyle: 'rectRounded', boxWidth: 10, padding: 18, font: { size: dark ? 15 : 12 } } },
      tooltip: { backgroundColor: '#0f1b2d', padding: 12, cornerRadius: 8, titleFont: { weight: '600' }, callbacks: { label: c => ' ' + c.dataset.label + ': ' + brl(c.parsed.y) } } },
    scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: tick, maxRotation: 0, autoSkipPadding: 16, font: { size: dark ? 14 : 11 } } },
      y: { grid: { color: grid }, border: { display: false }, ticks: { color: tick, font: { size: dark ? 14 : 11 }, callback: kshort } } } };
}
function dailyChart(el, dark) {
  const s = serie(per);
  return new Chart(el, { type: 'bar', data: { labels: s.days.map(d => fdate(d).slice(0, 5)), datasets: [
    { label: 'Faturamento', data: s.prod, backgroundColor: dark ? '#7ea7e6' : '#002147', borderRadius: 4, maxBarThickness: 30 },
    { label: 'Custo com motoristas', data: s.cust, backgroundColor: dark ? '#2fae4e' : '#9dbbe2', borderRadius: 4, maxBarThickness: 30 }] }, options: chartBase(dark) });
}

/* ---------------- Modo TV ---------------- */
const TV_MS = 12000;
let tvTimer = null, tvIdx = 0, tvT0 = 0, tvChart = null;
const tvSlides = [
  ['Resumo financeiro', m => `<div class="stats">${kpiHtml(m)}</div>${stripHtmlBlock(m)}${panel('Fluxo financeiro', stackHtml(m))}`],
  ['Operações em andamento', () => `<div class="ops-grid">${opsHtml(8)}</div>`],
  ['Faturamento diário', () => panel('Faturamento × custo com motoristas', '<div class="chartbox xl"><canvas id="tvc1"></canvas></div>')],
  ['Clientes e motoristas', m => `<div class="grid g-2">${panel('Faturamento por cliente', clientesHtml(m.P))}${panel('Ranking de motoristas', rankHtml(m.P))}</div>`],
  ['Pendências financeiras', m => `<div class="grid g-2">${panel(`A receber de clientes · ${brl(sumBy(m.pendRec, x => x.valor))}`, pendHtml(m.pendRec, 7, 'Receber'))}${panel(`A pagar a motoristas · ${brl(sumBy(m.pendPag, x => x.valor))}`, pendHtml(m.pendPag, 7, 'Pagar'))}</div>`]
];
function tvEnter() {
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  location.hash = '#/tv';
}
function tv() {
  document.body.classList.add('tv');
  if (!$('#tvBody')) {
    $('#app').innerHTML = `<div class="tv-wrap">
      <div class="tv-top"><div class="brand"><img src="img/logo-simbolo.png" alt=""><div class="wm"><b>SERAFINI</b><span>TRANSPORTES</span></div></div>
        <div class="tv-title"><small>Painel operacional · ${perLabel(per)}</small><b id="tvTitle"></b></div>
        <div class="tv-clock"><b id="tvClock"></b><span id="tvDate"></span></div></div>
      <div class="tv-body" id="tvBody"></div>
      <div class="tv-foot"><div class="tv-dots" id="tvDots"></div><div class="tv-live"><i></i>Atualização em tempo real</div><button class="tv-exit" id="tvExit">Sair do modo TV</button></div>
      <div class="tv-prog"><i id="tvProg"></i></div></div>`;
    $('#tvExit').onclick = tvExit;
  }
  tvShow(false);
  if (!tvTimer) { tvT0 = Date.now(); tvTimer = setInterval(tvLoop, 100); }
}
function tvLoop() {
  const e = Date.now() - tvT0, pr = $('#tvProg');
  if (pr) pr.style.width = Math.min(100, e / TV_MS * 100) + '%';
  if (e >= TV_MS) tvGo(1);
}
function tvGo(d) { tvIdx = (tvIdx + d + tvSlides.length) % tvSlides.length; tvT0 = Date.now(); tvShow(true); }
function tvShow(anim) {
  const m = metrics(per);
  const [t, fn] = tvSlides[tvIdx];
  $('#tvTitle').textContent = t;
  $('#tvBody').innerHTML = `<div class="tv-slide ${anim ? 'enter' : ''}">${fn(m)}</div>`;
  $('#tvDots').innerHTML = tvSlides.map((s, i) => `<i class="${i === tvIdx ? 'on' : ''}" data-i="${i}" title="${s[0]}"></i>`).join('');
  $$('#tvDots i').forEach(d => d.onclick = () => { tvIdx = +d.dataset.i; tvT0 = Date.now(); tvShow(true); });
  lastKpi = { produzido: m.produzido, recebido: m.recebido, aReceber: m.aReceber, margem: m.margem };
  if (tvChart) { tvChart.destroy(); tvChart = null; }
  if ($('#tvc1') && typeof Chart !== 'undefined') tvChart = dailyChart($('#tvc1'), true);
  clock();
}
function tvStop() {
  clearInterval(tvTimer); tvTimer = null;
  if (tvChart) { tvChart.destroy(); tvChart = null; }
  document.body.classList.remove('tv');
}
function tvExit() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  location.hash = '#/dashboard';
}
document.addEventListener('keydown', e => {
  if (!document.body.classList.contains('tv') || modalOpen) return;
  if (e.key === 'ArrowRight') tvGo(1);
  if (e.key === 'ArrowLeft') tvGo(-1);
});

/* ---------------- Rotas ---------------- */
const routes = {
  dashboard, tv,
  escala: () => crud(progCfg('escala')), servico: () => crud(progCfg('servico')),
  'pag-motorista': () => crud(pagCfg('Próprio')), 'pag-terceiros': () => crud(pagCfg('Terceiro')),
  abastecimentos: () => crud(abastCfg), rpas: () => crud(recCfg),
  motoristas: () => crud(cadastros.motoristas), veiculos: () => crud(cadastros.veiculos), empresas: () => crud(cadastros.empresas), fornecedores: () => crud(cadastros.fornecedores), usuarios: () => crud(cadastros.usuarios)
};
function render(fromChange) {
  if (!me()) return renderLogin();
  if (modalOpen) { pendingRender = true; return; }
  const r = location.hash.replace('#/', '') || 'dashboard';
  const route = routes[r] ? r : 'dashboard';
  if (route !== 'tv' && document.body.classList.contains('tv')) tvStop();
  if (!fromChange) ls.key = null;
  renderNav(route);
  const a = document.activeElement, caret = a && a.id === 'q' ? a.selectionStart : null;
  routes[route]();
  if (caret !== null && $('#q')) { $('#q').focus(); try { $('#q').setSelectionRange(caret, caret); } catch (e) {} }
  if (!fromChange) window.scrollTo(0, 0);
}
window.addEventListener('hashchange', () => { closeModal(); render(); });
function boot() {
  if (!me()) return renderLogin();
  $('#login').hidden = true; $('#login').innerHTML = '';
  $('#shell').hidden = false;
  renderShell();
  render();
}

/* ---------------- Simulação ao vivo ---------------- */
function tick() {
  const open = S.progs.filter(p => p.status !== 'Finalizada');
  const roll = Math.random();
  if (roll < .45 && open.length) {
    const p = pick(open), m = nome('motoristas', p.motoristaId);
    if (p.status === 'Programada') { p.status = 'Em andamento'; p.qtdViagens = rnd(1, 3); return save(`${m} iniciou a operação — lote ${p.lote}`, '🚛'); }
    p.qtdViagens = Math.min(p.qtdPrevista, p.qtdViagens + rnd(1, 4));
    if (p.qtdViagens >= p.qtdPrevista) { p.status = 'Finalizada'; p.fim = new Date().toTimeString().slice(0, 5); return save(`Escala finalizada: ${m} — ${p.qtdViagens} viagens (${brl(total(p))})`, '🏁'); }
    return save(`${m} concluiu viagens no lote ${p.lote}: ${p.qtdViagens}/${p.qtdPrevista}`, '📦');
  }
  if (roll < .65) {
    const f = S.progs.filter(p => p.status === 'Finalizada' && !S.pagamentos.some(g => g.progId === p.id));
    if (f.length) { const p = pick(f); const g = { id: uid(), progId: p.id, data: ymd(new Date()), qtd: p.qtdViagens, valorViagem: p.valorMotorista, vale: pick([0, 100, 200]), forma: 'PIX' }; S.pagamentos.push(g); return save(`Pagamento lançado: ${nome('motoristas', p.motoristaId)} — ${brl(pgTotal(g))}`, '💸'); }
  }
  if (roll < .85) {
    const pend = S.recebimentos.filter(g => g.status !== 'Recebido');
    if (pend.length) { const g = pick(pend); g.status = 'Recebido'; g.data = ymd(new Date()); return save(`Recebimento confirmado: ${(by('progs', g.progId) || {}).lote} — ${brl(g.valor)}`, '💰'); }
    const f = S.progs.filter(p => p.status === 'Finalizada' && !S.recebimentos.some(g => g.progId === p.id));
    if (f.length) { const p = pick(f); S.recebimentos.push({ id: uid(), progId: p.id, data: ymd(new Date()), valor: total(p), forma: 'TED', status: 'Pendente' }); return save(`RPA emitido: ${p.lote} — ${brl(total(p))}`, '🧾'); }
  }
  if (roll < .93) {
    const v = pick(S.veiculos), l = rnd(120, 260);
    S.abastecimentos.push({ id: uid(), data: ymd(new Date()), placa: v.placa, litros: l, valorTotal: Math.round(l * (5.9 + Math.random() * .5) * 100) / 100, local: pick(['Posto Ipiranga BR-116', 'Shell Rodovia Anchieta', 'Petrobras Cubatão']) });
    return save(`Abastecimento registrado: ${v.placa} — ${l} L`, '⛽');
  }
  const m = pick(S.motoristas), c = pick(S.empresas), v = pick(S.veiculos), vv = pick([150, 180, 210, 240]);
  S.progs.push({ id: uid(), tipo: pick(['escala', 'servico']), data: ymd(new Date()), clienteId: c.id, lote: `25GX${rnd(1000, 9999)}HR`, vaga: rnd(10, 99), motoristaId: m.id, placa: v.placa, valorViagem: vv, valorMotorista: Math.round(vv * .39), qtdPrevista: rnd(8, 24), qtdViagens: 0, inicio: '06:00', fim: '', status: 'Programada', ocorrencia: false, valorOcorrencia: 0 });
  save(`Nova programação: ${m.nome} → ${c.nome}`, '🗓️');
}
function toggleLive() {
  const b = $('#btnLive');
  if (timer) { clearInterval(timer); timer = null; }
  else { tick(); timer = setInterval(tick, 3500); }
  if (b) b.classList.toggle('on', !!timer);
}

/* ---------------- Início ---------------- */
S = load() || seed();
if (!S.fornecedores) S.fornecedores = seedFornecedores();
store.set(KEY, JSON.stringify(S));
if (new URLSearchParams(location.search).has('demo') && !me()) store.set(SKEY, 'u1');
setInterval(clock, 15000);
boot();
})();
