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
  pie: '<path d="M21.2 15.9A10 10 0 1 1 8 2.8"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>'
};
const ic = (n, s = 16, c = '') => `<svg class="ic ${c}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------------- Estado ---------------- */
const KEY = 'serafini_dados_v6', SKEY = 'serafini_sessao', PKEY = 'serafini_periodo', RKEY = 'serafini_resumo';
let S, modalOpen = false, pendingRender = false, timer = null;

function seed() {
  // Um registro de exemplo por área (baseado no exemplo da planilha original)
  const dia = n => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d); };
  const empresas = [{ id: 'e1', nome: 'Maersk', cnpj: '02.265.718/0001-04', contato: 'Operações Santos' }];
  const motoristas = [{ id: 'm1', nome: 'Carlos Griss', cpf: '123.456.789-01', telefone: '(13) 99811-2200', cnh: 'E', tipo: 'Próprio', status: 'Ativo' }];
  motoristas.forEach(m => Object.assign(m, cnhSeed()[m.id]));
  const mes = n => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + n); return ymd(d).slice(0, 7); };
  const veiculos = [{ id: 'v1', placa: 'ANS-4G47', modelo: 'Scania R450', tipo: 'Cavalo mecânico', proprietario: 'Frota própria', ipvaVenc: mes(1) }];
  const usuarios = [{ id: 'u1', nome: 'Leonardo Silva', email: 'leonardo@serafinitransportes.com.br', perfil: 'Diretor / CEO', status: 'Ativo' }];
  const terceiros = [{ id: 't1', nome: 'Borracharia Dois Irmãos', categoria: 'Borracharia', documento: '18.402.377/0001-56', telefone: '(13) 3361-4420', pix: '18.402.377/0001-56', status: 'Ativo' }];
  const progs = [
    { id: 'p1', tipo: 'escala', data: dia(-1), clienteId: 'e1', lote: '25GX5587HR', vaga: 92, motoristaId: 'm1', placa: 'ANS-4G47',
      valorViagem: 180, valorMotorista: 70, qtdPrevista: 20, qtdViagens: 20, inicio: '15:45', fim: '22:00', status: 'Finalizada', ocorrencia: false, valorOcorrencia: 0 },
    { id: 'p2', tipo: 'escala', data: dia(0), clienteId: 'e1', lote: '25GX6012HR', vaga: 47, motoristaId: 'm1', placa: 'ANS-4G47',
      valorViagem: 210, valorMotorista: 85, qtdPrevista: 12, qtdViagens: 5, inicio: '07:30', fim: '', status: 'Em andamento', ocorrencia: false, valorOcorrencia: 0 }
  ];
  const pagamentos = [{ id: 'pg1', progId: 'p1', data: dia(0), qtd: 20, valorViagem: 70, vale: 200, forma: 'PIX' }];
  const pagTerceiros = [{ id: 'pt1', terceiroId: 't1', data: dia(-2), servico: 'Troca de 2 pneus e alinhamento', placa: 'ANS-4G47', valor: 680, forma: 'PIX' }];
  const recebimentos = [{ id: 'rc1', progId: 'p1', data: dia(0), valor: 3600, forma: 'TED', status: 'Recebido' }];
  const abastecimentos = [{ id: 'ab1', data: dia(-1), placa: 'ANS-4G47', litros: 180, valorTotal: 1098, local: 'Posto Ipiranga BR-116' }];
  const now = Date.now();
  const log = [
    { t: now - 5 * 6e4, icon: '📦', msg: 'Carlos Griss concluiu viagens no lote 25GX6012HR: 5/12' },
    { t: now - 40 * 6e4, icon: '💰', msg: 'Recebimento confirmado: 25GX5587HR — R$ 3.600,00' },
    { t: now - 55 * 6e4, icon: '💸', msg: 'Pagamento lançado: Carlos Griss — R$ 1.200,00' },
    { t: now - 90 * 6e4, icon: '🚛', msg: 'Carlos Griss iniciou a operação — lote 25GX6012HR' },
    { t: now - 20 * 36e5, icon: '🏁', msg: 'Escala finalizada: Carlos Griss — 20 viagens (R$ 3.600,00)' },
    { t: now - 22 * 36e5, icon: '⛽', msg: 'Abastecimento registrado: ANS-4G47 — 180 L' },
    { t: now - 46 * 36e5, icon: '🔧', msg: 'Serviço pago: Borracharia Dois Irmãos — R$ 680,00' }
  ];
  return { empresas, motoristas, veiculos, usuarios, terceiros, progs, pagamentos, pagTerceiros, recebimentos, abastecimentos, log };
}
function migrate(d) {
  d.terceiros = d.terceiros || []; d.pagTerceiros = d.pagTerceiros || [];
  d.progs.forEach(p => { if (p.tipo === 'servico') p.tipo = 'escala'; });
  d.usuarios.forEach(u => { if (u.perfil === 'Supervisor') u.perfil = 'Diretor / CEO'; });
  d.motoristas.forEach(m => { if (m.tipo === 'Terceiro') m.tipo = 'Agregado'; const c = cnhSeed()[m.id]; if (!m.cnhNum && c) Object.assign(m, c); });
  return d;
}
function cnhSeed() {
  const em = d => { const x = new Date(); x.setDate(x.getDate() + d); return ymd(x); };
  return {
    m1: { cnhNum: '04518237610', cnhVal: em(920) }, m2: { cnhNum: '05129834472', cnhVal: em(1240) },
    m3: { cnhNum: '03876512093', cnhVal: em(-12) }, m4: { cnhNum: '06231875540', cnhVal: em(18) },
    m5: { cnhNum: '04790213385', cnhVal: em(610) }, m6: { cnhNum: '05583029147', cnhVal: em(1460) }
  };
}
const diasAte = s => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); const h = new Date(); h.setHours(0, 0, 0, 0); return Math.round((new Date(y, m - 1, d) - h) / 864e5); };
/* Vencimentos: CNH (data) e IPVA (mês/ano). Alerta quando faltar 1 mês. Nível: -1 sem data, 0 em dia, 1 atenção, 2 vencido */
const fmes = s => s ? `${s.slice(5, 7)}/${s.slice(0, 4)}` : '—';
function sitCnh(m) {
  const d = diasAte(m.cnhVal);
  if (d === null) return ['Não informada', 'no', -1];
  if (d < 0) return ['Vencida', 'bad', 2];
  if (d <= 30) return [d === 0 ? 'Vence hoje' : `Vence em ${d} dia${d === 1 ? '' : 's'}`, 'wait', 1];
  return ['Em dia', 'ok', 0];
}
function sitIpva(v) {
  if (!v.ipvaVenc) return ['Não informado', 'no', -1];
  const [y, m] = v.ipvaVenc.split('-').map(Number), h = new Date();
  const d = (y * 12 + m) - (h.getFullYear() * 12 + h.getMonth() + 1);
  if (d < 0) return ['Vencido', 'bad', 2];
  if (d === 0) return ['Vence este mês', 'wait', 1];
  if (d === 1) return ['Vence no próximo mês', 'wait', 1];
  return ['Em dia', 'ok', 0];
}
const vencCell = (txt, s) => s[2] < 0 ? '<span style="color:var(--sub)">—</span>' : s[2] >= 1 ? `${txt} ${badge(s[0], s[1])}` : txt;
const cnhStatus = m => vencCell(fdate(m.cnhVal), sitCnh(m));
const ipvaStatus = v => vencCell(fmes(v.ipvaVenc), sitIpva(v));
function vencs() {
  return [
    ...S.veiculos.map(v => ({ key: 'veiculos:' + v.id, tipo: 'Veículo', col: 'veiculos', ref: v, ident: v.placa, sub: v.modelo, doc: 'IPVA', venc: fmes(v.ipvaVenc), sv: v.ipvaVenc ? v.ipvaVenc + '-01' : '9999', sit: sitIpva(v) })),
    ...S.motoristas.map(m => ({ key: 'motoristas:' + m.id, tipo: 'Motorista', col: 'motoristas', ref: m, ident: m.nome, sub: `Categoria ${m.cnh || '—'}`, doc: 'CNH', venc: fdate(m.cnhVal), sv: m.cnhVal || '9999', sit: sitCnh(m) }))
  ].sort((a, b) => b.sit[2] - a.sit[2] || a.sv.localeCompare(b.sv));
}
const alertas = () => vencs().filter(x => x.sit[2] >= 1);
const alertTxt = x => `${x.doc} ${x.tipo === 'Veículo' ? x.ident : x.ident.split(' ')[0]}: ${x.sit[0].toLowerCase()}`;
function load() { const v = store.get(KEY); if (!v) return null; try { return JSON.parse(v); } catch (e) { return null; } }
function save(msg, icon) {
  if (msg) { S.log.unshift({ t: Date.now(), msg, icon: icon || '•' }); S.log = S.log.slice(0, 40); const f = feedIc(icon); toast(msg, f[1], f[0]); }
  store.set(KEY, JSON.stringify(S));
  render(true);
}
window.addEventListener('storage', e => { if (e.key === KEY) { const d = load(); if (d) S = migrate(d); render(true); } });

/* ---------------- Sessão ---------------- */
const me = () => S.usuarios.find(u => u.id === store.get(SKEY));

/* ---------------- Perfis de acesso ---------------- */
const PERFIS = ['Diretor / CEO', 'Administrador', 'Financeiro', 'Operação'];
const ACESSO_TOTAL = ['Diretor / CEO', 'Administrador'];
const PERMISSOES = {
  'Diretor / CEO': 'Acesso total · alimenta e controla todo o sistema',
  Administrador: 'Acesso total',
  Financeiro: 'Pagamentos, abastecimentos e recebimentos',
  'Operação': 'Programação de escalas e controle de vencimentos'
};
const CAT_TERC = ['Fornecedor', 'Borracharia', 'Oficina mecânica', 'Auto elétrica', 'Lava-jato', 'Outros'];

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
const FEED = { '🔧': ['tool', 'warn'], '🚛': ['truck', 'info'], '🏁': ['check', 'ok'], '📦': ['truck', 'info'], '💸': ['wallet', 'warn'], '💰': ['dollar', 'ok'], '🧾': ['receipt', 'info'], '⛽': ['fuel', 'warn'], '🗓️': ['calendar', 'info'], '✅': ['check', 'ok'], '✏️': ['pencil', 'neu'], '🗑️': ['trash', 'red'] };
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
  if ($('#nt') && $('#nt').classList.contains('open')) return $('#nt').classList.remove('open');
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
          <li><span class="ck">${ic('check', 14)}</span>Programação de escalas por cliente, lote e vaga</li>
          <li><span class="ck">${ic('check', 14)}</span>Pagamentos de motoristas, serviços de terceiros e abastecimentos</li>
          <li><span class="ck">${ic('check', 14)}</span>Controle de recebimentos e pendências financeiras</li>
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
    const al = alertas();
    if (al.length) setTimeout(() => toast(`${al.length} vencimento${al.length === 1 ? '' : 's'} precisa${al.length === 1 ? '' : 'm'} de atenção. Veja em Controle.`, 'warn', 'alert'), 600);
  };
}
function logout() {
  store.del(SKEY);
  renderLogin();
}

/* ---------------- Estrutura (topo e menu) ---------------- */
const NAV = [
  { label: 'Programação', icon: 'calendar', items: [['escala', 'Programar escala', 'Escalas de motoristas por cliente', 'calendar']] },
  { label: 'Pagamentos', icon: 'wallet', items: [['pag-motorista', 'Pagamento de motoristas', 'Motoristas próprios e agregados', 'user'], ['pag-terceiros', 'Pagamento de terceiros', 'Serviços de prestadores', 'tool'], ['abastecimentos', 'Abastecimentos', 'Combustível por veículo', 'fuel']] },
  { label: 'A receber', icon: 'receipt', items: [['rpas', "RPA's", 'Recebimentos de clientes', 'receipt']] },
  { label: 'Cadastros', icon: 'folder', items: [['motoristas', 'Motorista', 'Equipe própria e agregados', 'user'], ['veiculos', 'Veículo', 'Frota e placas', 'truck'], ['empresas', 'Empresa', 'Clientes atendidos', 'building'], ['terceiros', 'Terceiro', 'Fornecedores e prestadores', 'tool'], ['usuarios', 'Usuário', 'Acessos ao sistema', 'users']] },
  { label: 'Controle', icon: 'shield', r: 'controle', group: 'Vencimentos', desc: 'IPVA dos veículos e CNH dos motoristas', count: () => alertas().length },
  { label: 'Dashboard', icon: 'grid', r: 'dashboard', group: 'Visão geral', desc: 'Indicadores em tempo real' }
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
      <div class="nt" id="nt">
        <button class="ib-top nt-btn" id="ntBtn" aria-haspopup="true" aria-expanded="false" aria-label="Notificações" title="Notificações">${ic('bell', 19)}<span class="nt-c" id="ntC" hidden></span></button>
        <div class="nt-dd" id="ntDd"></div></div>
      <div class="um" id="um">
        <button class="um-btn" id="umBtn" aria-haspopup="menu" aria-expanded="false" title="${esc(u.nome)} · ${esc(u.perfil)}" aria-label="Menu do usuário">${userIc()}</button>
        <div class="um-dd" role="menu">
          <div class="um-head">${userIc('lg')}<div><b>${esc(u.nome)}</b><small>${esc(u.email)}</small><span class="badge b-run" style="margin-top:6px">${esc(u.perfil)}</span></div></div>
          <button class="mi-btn" data-um="perfil">${ic('user')}Meu perfil</button>
          <a class="mi-btn" href="#/usuarios">${ic('users')}Usuários e acessos</a>
          <a class="mi-btn" href="https://wa.me/5547991058869?text=" target="_blank" rel="noopener" id="umHelp">${ic('help')}Ajuda<small class="mi-sub">WhatsApp do suporte</small></a>
          <button class="mi-btn" data-um="reset">${ic('refresh')}Restaurar dados de demonstração</button>
          <div class="dd-sep"></div>
          <button class="mi-btn danger" data-um="sair">${ic('logout')}Sair</button>
        </div></div></div>`;
  $('#btnLive').onclick = toggleLive;
  $('#ntBtn').onclick = e => {
    e.stopPropagation();
    $('#um').classList.remove('open');
    const o = $('#nt').classList.toggle('open');
    $('#ntBtn').setAttribute('aria-expanded', o);
    if (o) { notifNovas = new Set(notifs().filter(x => !lidas.has(x.id)).map(x => x.id)); renderNotif(); marcarLidas(); }
  };
  $('#burger').onclick = () => $('#mnav').classList.add('open');
  $('#umBtn').onclick = e => { e.stopPropagation(); $('#nt').classList.remove('open'); const o = $('#um').classList.toggle('open'); $('#umBtn').setAttribute('aria-expanded', o); };
  $$('#um .um-dd a, #um .um-dd button').forEach(b => b.addEventListener('click', () => $('#um').classList.remove('open')));
  $('[data-um=sair]').onclick = logout;
  $('[data-um=perfil]').onclick = profile;
  $('#umHelp').href = 'https://wa.me/5547991058869?text=' + encodeURIComponent(`Olá! Sou ${u.nome} e preciso de ajuda com o Sistema Serafini Transportes.`);
  $('[data-um=reset]').onclick = () => confirmBox('Restaurar dados de demonstração?', 'Todos os lançamentos feitos nesta demonstração serão substituídos pelos dados fictícios originais.', 'Restaurar dados', () => { S = seed(); if (!me()) store.set(SKEY, 'u1'); renderShell(); save('Dados de demonstração restaurados', '↺'); });
  clock();
}
function renderNav(route) {
  const on = it => it.r === route || (it.items || []).some(i => i[0] === route);
  const cnt = it => { const n = it.count ? it.count() : 0; return n ? `<span class="nb" title="${n} vencimento(s) precisam de atenção">${n}</span>` : ''; };
  const link = (i, n = '') => i === '-' ? '' : `<a class="dd-a ${i[0] === route ? 'on' : ''}" href="#/${i[0]}"><span class="ti">${ic(i[3], 16)}</span><span><b>${i[1]}${n}</b><small>${i[2]}</small></span></a>`;
  const simple = i => i === '-' ? '<div class="dd-sep"></div>' : `<a class="dd-s ${i[0] === route ? 'on' : ''}" href="#/${i[0]}">${i[1]}</a>`;
  $('#navLinks').innerHTML = NAV.map(it => it.r
    ? `<div class="nav-item ${on(it) ? 'active' : ''}"><a class="nav-link" href="#/${it.r}">${it.label}${cnt(it)}</a></div>`
    : `<div class="nav-item ${on(it) ? 'active' : ''}"><button class="nav-link" type="button" aria-haspopup="true">${it.label}</button><div class="dd"><div class="dd-in">${it.items.map(simple).join('')}</div></div></div>`).join('');
  $$('#navLinks .dd-s').forEach(a => a.addEventListener('click', () => a.blur()));
  if ($('#burger')) $('#burger').classList.toggle('has-al', alertas().length > 0);
  renderNotif();
  $('#mnav').innerHTML = `<div class="mnav-bg" data-close></div><div class="mnav-p"><div class="mnav-h"><div class="brand"><img src="img/logo-simbolo.png" alt="" style="width:32px;height:32px"><div class="wm"><b>SERAFINI</b><span>TRANSPORTES</span></div></div><button data-close aria-label="Fechar menu">${ic('x', 20)}</button></div>
    <div class="mnav-b">${NAV.map(it => it.r ? (it.group ? `<div class="mnav-g">${it.label}</div>` : '') + link([it.r, it.group || it.label, it.desc, it.icon], cnt(it)) : `<div class="mnav-g">${it.label}</div>${it.items.map(i => link(i)).join('')}`).join('')}</div></div>`;
  $$('#mnav [data-close], #mnav a').forEach(el => el.addEventListener('click', () => $('#mnav').classList.remove('open')));
}
document.addEventListener('click', e => {
  const um = $('#um'), nt = $('#nt');
  if (um && !um.contains(e.target)) um.classList.remove('open');
  if (nt && !nt.contains(e.target)) nt.classList.remove('open');
});

/* ---------------- Notificações ---------------- */
const NKEY = 'serafini_notif_lidas';
let lidas = (() => { try { return new Set(JSON.parse(store.get(NKEY) || '[]')); } catch (e) { return new Set(); } })();
const ago = t => { const m = Math.round((Date.now() - t) / 6e4); return m < 1 ? 'agora' : m < 60 ? `há ${m} min` : m < 1440 ? `há ${Math.round(m / 60)} h` : new Date(t).toLocaleDateString('pt-BR'); };
function notifs() {
  const out = [];
  alertas().forEach(x => out.push({ id: `v:${x.key}:${x.sit[2]}`, icon: 'alert', tone: x.sit[2] === 2 ? 'red' : 'warn', title: `${x.doc} ${x.tipo === 'Veículo' ? 'do veículo' : 'de'} ${x.ident}`, msg: `${x.sit[0]} · ${x.venc}`, tag: 'Vencimento', go: () => { location.hash = '#/controle'; } }));
  pendencias(S.progs).slice(0, 4).forEach(x => out.push({ id: `p:${x.p.id}:${x.tipo}`, icon: x.tipo === 'Receber' ? 'receipt' : 'wallet', tone: 'info', title: x.tipo === 'Receber' ? `A receber de ${x.quem}` : `A pagar para ${x.quem}`, msg: `${brl(x.valor)} · lote ${x.p.lote} · ${x.dias} dia${x.dias === 1 ? '' : 's'} em aberto`, tag: 'Financeiro', go: () => progDetail(x.p) }));
  S.log.filter(l => Date.now() - l.t < 2 * 864e5).slice(0, 8).forEach(l => { const [i, t] = feedIc(l.icon); out.push({ id: `l:${l.t}`, icon: i, tone: t, title: l.msg, msg: '', tag: ago(l.t) }); });
  return out;
}
let notifCache = [], notifNovas = new Set();
function renderNotif() {
  const c = $('#ntC'), dd = $('#ntDd'); if (!c || !dd) return;
  const open = $('#nt').classList.contains('open');
  notifCache = notifs();
  const n = notifCache.filter(x => !lidas.has(x.id)).length;
  c.hidden = !n || open; c.textContent = n > 9 ? '9+' : n;
  $('#ntBtn').title = n ? `${n} notificação(ões) nova(s)` : 'Notificações';
  if (!open) return;
  dd.innerHTML = `<div class="nt-h"><b>Notificações</b><span>${notifNovas.size ? `${notifNovas.size} nova${notifNovas.size === 1 ? '' : 's'}` : 'Tudo em dia'}</span></div>
    <div class="nt-l">${notifCache.length ? notifCache.map((x, i) => `<button class="nt-i ${notifNovas.has(x.id) ? 'new' : ''} ${x.go ? '' : 'ro'}" data-n="${i}" type="button"><span class="f-ic t-${x.tone}">${ic(x.icon, 15)}</span><span class="nt-x"><b>${esc(x.title)}</b>${x.msg ? `<small>${esc(x.msg)}</small>` : ''}<em>${esc(x.tag)}</em></span></button>`).join('')
      : `<div class="nt-e">${ic('check', 18)}<span>Nenhuma notificação no momento.</span></div>`}</div>
    <a class="nt-f" href="#/dashboard">Ver painel completo</a>`;
  $$('#ntDd [data-n]').forEach(b => b.onclick = e => { e.stopPropagation(); const x = notifCache[+b.dataset.n]; if (!x.go) return; $('#nt').classList.remove('open'); x.go(); });
  $('#ntDd .nt-f').onclick = () => $('#nt').classList.remove('open');
}
function marcarLidas() {
  notifCache.forEach(x => lidas.add(x.id));
  lidas = new Set([...lidas].slice(-300));
  store.set(NKEY, JSON.stringify([...lidas]));
  $('#ntC').hidden = true;
}
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
/* Resumo (cards) recolhível; a preferência fica salva neste navegador */
function sumBlock(cards) {
  if (!cards.length) return '';
  const off = store.get(RKEY) === '0';
  return `<section class="sum ${off ? 'off' : ''}"><div class="sum-h"><span>Resumo</span><i></i><button class="sum-t" id="sumT" type="button" aria-expanded="${!off}" title="${off ? 'Mostrar resumo' : 'Ocultar resumo'}">${ic('chev', 15)}<em>${off ? 'Mostrar' : 'Ocultar'}</em></button></div><div class="stats">${cards.map(statCard).join('')}</div></section>`;
}
function bindSum() {
  const b = $('#sumT'); if (!b) return;
  b.onclick = () => {
    const off = b.closest('.sum').classList.toggle('off');
    store.set(RKEY, off ? '0' : '1');
    b.setAttribute('aria-expanded', !off); b.title = off ? 'Mostrar resumo' : 'Ocultar resumo';
    $('em', b).textContent = off ? 'Mostrar' : 'Ocultar';
  };
}
/* Banner com foto (área de programação) */
function heroHead(cfg, rows) {
  const hoje = rows.filter(r => r.data === ymd(new Date()));
  const and = rows.filter(r => r.status === 'Em andamento').length;
  return `<section class="hero">
    <img class="hero-img" src="${cfg.hero.img}" alt="${esc(cfg.hero.alt)}">
    <div class="hero-top"><div class="hero-k"><span><b>${num(hoje.length)}</b> ${hoje.length === 1 ? 'escala hoje' : 'escalas hoje'}</span><span><b>${num(and)}</b> em andamento</span></div><span class="hero-tag">${ic('pin', 13)}${esc(cfg.hero.place)}</span></div>
    ${cfg.hero.credit ? `<a class="hero-cr" href="${cfg.hero.credit[1]}" target="_blank" rel="noopener">${esc(cfg.hero.credit[0])}</a>` : ''}
    <div class="hero-in">
      <div class="hero-t"><nav class="crumb" aria-label="Você está em"><span>Início</span>${ic('chevR', 13)}<span>${cfg.group}</span>${ic('chevR', 13)}<b>${cfg.title}</b></nav>
        <h1>${cfg.title}</h1><p>${cfg.desc}</p></div>
      <div class="hero-a"><button class="btn btn-hero" id="novo">${ic('plus')}${cfg.newText}</button></div>
    </div></section>`;
}
const noteBox = h =>`<div class="note">${ic('info', 17)}<div>${h}</div></div>`;
let ls = { key: null, q: '', f: '', day: '', s: -1, d: 1, sel: new Set() };
const cellTxt = (c, r) => c.render ? stripHtml(String(c.render(r))) : String(r[c.k] ?? '');
function crud(cfg) {
  if (ls.key !== cfg.title) ls = { key: cfg.title, q: '', f: '', day: '', s: -1, d: 1, sel: new Set(), selMode: false };
  const all = cfg.rows ? cfg.rows() : S[cfg.col];
  ls.sel.forEach(id => { if (!all.some(r => r.id === id)) ls.sel.delete(id); });
  const sum = cfg.summary ? cfg.summary(all) : [];
  const fopts = cfg.filter ? (typeof cfg.filter.options === 'function' ? cfg.filter.options() : cfg.filter.options) : [];
  const selOn = !!cfg.select && ls.selMode;
  $('#app').innerHTML = `<div class="${cfg.hero ? 'pg-c' : 'pg'}">
    ${cfg.hero ? heroHead(cfg, all) : pageHead(cfg.group, cfg.title, cfg.desc, `<button class="btn btn-pri" id="novo">${ic('plus')}${cfg.newText}</button>`)}
    ${cfg.note ? noteBox(cfg.note) : ''}
    ${sumBlock(sum)}
    <div class="panel">
      <div class="toolbar">
        <div class="tb-l"><div class="search">${ic('search')}<input id="q" placeholder="Buscar ${cfg.searchPh || 'registros'}..." value="${esc(ls.q)}" aria-label="Buscar"></div>
          ${cfg.dayFilter ? `<div class="day-f"><label for="day">Dia</label><input type="date" id="day" value="${esc(ls.day)}"><button class="btn btn-sec btn-sm" id="dayHoje" type="button">Hoje</button>${ls.day ? `<button class="ib" id="dayClr" type="button" title="Mostrar todos os dias" aria-label="Limpar dia">${ic('x', 15)}</button>` : ''}</div>` : ''}
          ${cfg.filter ? `<select id="flt" class="sel-sm" aria-label="Filtrar por ${cfg.filter.label}"><option value="">${cfg.filter.label}: todos</option>${fopts.map(o => `<option ${o === ls.f ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>` : ''}</div>
        <div class="tb-r"><span class="count" id="cnt"></span><button class="btn btn-sec btn-sm" id="csv">${ic('download', 15)}Exportar CSV</button>
          ${cfg.select ? `<button class="btn btn-sec btn-sm ${selOn ? 'is-on' : ''}" id="selMode" type="button" aria-pressed="${selOn}">${ic(selOn ? 'x' : 'pencil', 15)}${selOn ? 'Cancelar' : 'Selecionar'}</button>` : ''}
          ${selOn ? `<button class="btn btn-pri btn-sm" id="selRun" disabled>${ic('image', 15)}<span id="selLbl">${cfg.select.label}</span></button>` : ''}</div>
      </div>
      ${selOn ? `<div class="selbar" id="selbar" hidden><span id="selTxt"></span><button class="lnk" id="selClr" type="button">Limpar seleção</button></div>` : ''}
      <div class="tscroll"><table class="tbl"><thead><tr>${selOn ? `<th class="ck-c"><input type="checkbox" id="ckAll" aria-label="Selecionar todos"></th>` : ''}${cfg.cols.map((c, i) => `<th class="sortable ${c.r ? 'r' : ''}" data-s="${i}" title="Ordenar">${c.label}<span class="sa">${ls.s === i ? (ls.d > 0 ? '↑' : '↓') : ''}</span></th>`).join('')}<th class="act" aria-label="Ações"></th></tr></thead><tbody id="tb"></tbody></table></div>
      <div class="tbl-foot"><span id="cnt2"></span><span>${selOn ? 'Marque as programações e clique em “' + cfg.select.label + '”' : cfg.detail ? 'Clique em uma linha para ver os detalhes' : 'Clique no título da coluna para ordenar'}</span></div>
    </div></div>`;
  let cur = [];
  const syncSel = () => {
    if (!selOn) return;
    const n = ls.sel.size, vis = cur.filter(r => ls.sel.has(r.id)).length;
    $('#selRun').disabled = !n;
    $('#selLbl').textContent = n ? `${cfg.select.label} (${n})` : cfg.select.label;
    $('#selbar').hidden = !n;
    $('#selTxt').textContent = `${n} ${n === 1 ? 'programação selecionada' : 'programações selecionadas'}`;
    const all2 = $('#ckAll');
    all2.checked = cur.length > 0 && vis === cur.length;
    all2.indeterminate = vis > 0 && vis < cur.length;
    $$('#tb tr[data-id]').forEach(tr => tr.classList.toggle('sel', ls.sel.has(tr.dataset.id)));
  };
  const view = () => {
    let rows = all.filter(r => !cfg.filter || !ls.f || cfg.filter.get(r) === ls.f);
    if (cfg.dayFilter && ls.day) rows = rows.filter(r => r.data === ls.day);
    if (ls.q) { const q = ls.q.toLowerCase(); rows = rows.filter(r => cfg.cols.map(c => cellTxt(c, r)).join(' ').toLowerCase().includes(q)); }
    if (ls.s >= 0) {
      const c = cfg.cols[ls.s], v = r => c.sv ? c.sv(r) : cellTxt(c, r);
      rows = [...rows].sort((a, b) => { const x = v(a), y = v(b); return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'pt-BR', { numeric: true })) * ls.d; });
    }
    const span = cfg.cols.length + 1 + (selOn ? 1 : 0);
    $('#tb').innerHTML = rows.length ? rows.map(row => `<tr data-id="${row.id}" class="${cfg.detail ? 'click' : ''}">${selOn ? `<td class="ck-c"><input type="checkbox" data-ck="${row.id}" ${ls.sel.has(row.id) ? 'checked' : ''} aria-label="Selecionar"></td>` : ''}${cfg.cols.map(c => `<td class="${c.r ? 'r ' : ''}${c.cls || ''}">${c.render ? c.render(row) : esc(row[c.k])}</td>`).join('')}
      <td class="act"><div>${cfg.quick && cfg.quick.show(row) ? `<button class="ib ok" data-qk="${row.id}" title="${cfg.quick.label}" aria-label="${cfg.quick.label}">${ic(cfg.quick.icon, 15)}</button>` : ''}<button class="ib" data-e="${row.id}" title="Editar" aria-label="Editar">${ic('pencil', 15)}</button><button class="ib danger" data-d="${row.id}" title="Excluir" aria-label="Excluir">${ic('trash', 15)}</button></div></td></tr>`).join('')
      : `<tr><td colspan="${span}">${all.length ? emptyState('Nenhum resultado encontrado', `<div>${ls.day ? 'Não há programações neste dia. ' : ''}Ajuste a busca ou o filtro.</div>`, 'search') : emptyState('Nenhum registro ainda', `<div>Clique em “${cfg.newText}” para começar.</div>`)}</td></tr>`;
    $('#cnt').textContent = `${rows.length} de ${all.length}`;
    $('#cnt2').textContent = `Mostrando ${rows.length} de ${all.length} registro${all.length === 1 ? '' : 's'}`;
    $$('#tb [data-e]').forEach(b => b.onclick = e => { e.stopPropagation(); form(cfg, by(cfg.col, b.dataset.e)); });
    $$('#tb [data-d]').forEach(b => b.onclick = e => { e.stopPropagation(); del(cfg, by(cfg.col, b.dataset.d)); });
    $$('#tb [data-qk]').forEach(b => b.onclick = e => { e.stopPropagation(); cfg.quick.run(by(cfg.col, b.dataset.qk)); });
    $$('#tb .ck-c').forEach(td => td.onclick = e => e.stopPropagation());
    $$('#tb [data-ck]').forEach(ck => ck.onchange = () => { ck.checked ? ls.sel.add(ck.dataset.ck) : ls.sel.delete(ck.dataset.ck); syncSel(); });
    if (cfg.detail) $$('#tb tr.click').forEach(tr => tr.onclick = () => cfg.detail(by(cfg.col, tr.dataset.id)));
    cur = rows;
    syncSel();
  };
  view();
  bindSum();
  $('#q').oninput = e => { ls.q = e.target.value; view(); };
  if (cfg.filter) $('#flt').onchange = e => { ls.f = e.target.value; view(); };
  if (cfg.dayFilter) {
    $('#day').onchange = e => { ls.day = e.target.value; crud(cfg); };
    $('#dayHoje').onclick = () => { ls.day = ymd(new Date()); crud(cfg); };
    if ($('#dayClr')) $('#dayClr').onclick = () => { ls.day = ''; crud(cfg); };
  }
  if (cfg.select) $('#selMode').onclick = () => { ls.selMode = !ls.selMode; if (!ls.selMode) ls.sel.clear(); crud(cfg); };
  if (selOn) {
    $('#ckAll').onchange = e => { cur.forEach(r => e.target.checked ? ls.sel.add(r.id) : ls.sel.delete(r.id)); $$('#tb [data-ck]').forEach(ck => ck.checked = e.target.checked); syncSel(); };
    $('#selClr').onclick = () => { ls.sel.clear(); $$('#tb [data-ck]').forEach(ck => ck.checked = false); syncSel(); };
    $('#selRun').onclick = () => cfg.select.run(all.filter(r => ls.sel.has(r.id)));
  }
  $$('th[data-s]').forEach(th => th.onclick = () => { const i = +th.dataset.s; if (ls.s === i) ls.d *= -1; else { ls.s = i; ls.d = 1; } crud(cfg); });
  $('#novo').onclick = () => form(cfg, null);
  $('#csv').onclick = () => exportCsv(cfg, cur);
}

/* ---------------- Imagem da escala / serviços (para enviar no grupo) ---------------- */
const DIAS_L = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const dataLonga = s => { const [y, m, d] = s.split('-').map(Number); return `${DIAS_L[new Date(y, m - 1, d).getDay()]}, ${fdate(s)}`; };
function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function drawLogo(c, x, y, size) {
  const k = size / 104;
  c.save(); c.translate(x - 8 * k, y - 8 * k); c.scale(k, k);
  c.strokeStyle = '#2fae4e'; c.lineWidth = 5; c.beginPath(); c.arc(60, 60, 48, 0, Math.PI * 2); c.stroke();
  c.fillStyle = '#2fae4e';
  const poly = pts => { c.beginPath(); pts.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.closePath(); c.fill(); };
  poly([[40, 27], [53, 50], [46, 50], [57, 68], [23, 68], [34, 50], [27, 50]]);
  poly([[80, 27], [93, 50], [86, 50], [97, 68], [63, 68], [74, 50], [67, 50]]);
  c.fillRect(37, 68, 6, 10); c.fillRect(77, 68, 6, 10); c.fillRect(31, 78, 58, 4);
  c.restore();
}
async function escalaImagem(tipo, rows) {
  if (!rows.length) return;
  try { await Promise.all([document.fonts.load('700 20px Inter'), document.fonts.load('600 20px Inter'), document.fonts.load('500 20px Inter')]); } catch (e) {}
  rows = [...rows].sort((a, b) => (a.data + (a.inicio || '99')).localeCompare(b.data + (b.inicio || '99')));
  const dias = [...new Set(rows.map(r => r.data))].sort();
  const multi = dias.length > 1;
  const W = 1080, P = 48, RH = 62, HEAD = 168, SUM = 98, TH = 46, FOOT = 84;
  const H = HEAD + SUM + TH + rows.length * RH + FOOT;
  const sc = 2, cv = document.createElement('canvas');
  cv.width = W * sc; cv.height = H * sc;
  const c = cv.getContext('2d'); c.scale(sc, sc);
  const F = (w, s) => `${w} ${s}px Inter, Arial, sans-serif`;
  const fit = (t, max) => { t = String(t ?? '—'); if (c.measureText(t).width <= max) return t; while (t.length > 1 && c.measureText(t + '…').width > max) t = t.slice(0, -1); return t + '…'; };
  const spaced = (t, x, y, sp) => { for (const ch of t) { c.fillText(ch, x, y); x += c.measureText(ch).width + sp; } };

  // fundo e cabeçalho
  c.fillStyle = '#f5f7fa'; c.fillRect(0, 0, W, H);
  c.fillStyle = '#002147'; c.fillRect(0, 0, W, HEAD);
  c.fillStyle = '#2fae4e'; c.fillRect(0, HEAD - 5, W, 5);
  drawLogo(c, P, 42, 80);
  c.fillStyle = '#ffffff'; c.font = F(700, 30); spaced('SERAFINI', P + 100, 84, 5);
  c.fillStyle = '#8fd6a0'; c.font = F(600, 13); spaced('TRANSPORTES', P + 101, 108, 7.4);
  c.textAlign = 'right';
  c.fillStyle = '#9fb6e6'; c.font = F(600, 15); c.fillText(tipo === 'escala' ? 'ESCALA PROGRAMADA' : 'SERVIÇOS PROGRAMADOS', W - P, 72);
  c.fillStyle = '#ffffff'; c.font = F(700, 27); c.fillText(multi ? `${fdate(dias[0])} a ${fdate(dias[dias.length - 1])}` : dataLonga(dias[0]), W - P, 108);
  c.textAlign = 'left';

  // resumo
  const mots = new Set(rows.map(r => r.motoristaId)).size, via = sumBy(rows, r => +r.qtdPrevista || 0);
  const nomeTipo = tipo === 'escala' ? (rows.length === 1 ? 'escala' : 'escalas') : (rows.length === 1 ? 'serviço' : 'serviços');
  let cx = P; const cy = HEAD + 26;
  [[rows.length, nomeTipo], [mots, mots === 1 ? 'motorista' : 'motoristas'], [via, 'viagens previstas']].forEach(([n, l]) => {
    c.font = F(700, 20); const a = String(n), wa = c.measureText(a).width;
    c.font = F(500, 16); const w = wa + c.measureText(l).width + 46;
    roundRect(c, cx, cy, w, 46, 23); c.fillStyle = '#ffffff'; c.fill(); c.strokeStyle = '#e4e9f0'; c.lineWidth = 1; c.stroke();
    c.fillStyle = '#002147'; c.font = F(700, 20); c.fillText(a, cx + 18, cy + 30);
    c.fillStyle = '#475467'; c.font = F(500, 16); c.fillText(l, cx + 26 + wa, cy + 30);
    cx += w + 12;
  });

  // tabela
  const cols = [...(multi ? [['Data', 92, r => fdate(r.data).slice(0, 5)]] : []), ['Início', 82, r => r.inicio || '—'], ['Motorista', 0, r => nome('motoristas', r.motoristaId)], ['Placa', 116, r => r.placa], ['Cliente', 150, r => nome('empresas', r.clienteId)], ['Lote', 142, r => r.lote], ['Vaga', 84, r => r.vaga || '—'], ['Viagens', 90, r => r.qtdPrevista]];
  const fixed = sumBy(cols, x => x[1]); cols.forEach(x => { if (!x[1]) x[1] = W - 2 * P - fixed; });
  let ty = HEAD + SUM;
  const TW = W - 2 * P, TB = TH + rows.length * RH;
  roundRect(c, P, ty, TW, TB, 14); c.fillStyle = '#ffffff'; c.fill(); c.strokeStyle = '#e4e9f0'; c.lineWidth = 1; c.stroke();
  c.save(); roundRect(c, P, ty, TW, TB, 14); c.clip();
  c.fillStyle = '#eef2f7'; c.fillRect(P, ty, TW, TH);
  let x = P; c.font = F(600, 13); c.fillStyle = '#64748b';
  cols.forEach(([l, w], i) => { const last = i === cols.length - 1; c.textAlign = last ? 'right' : 'left'; c.fillText(l.toUpperCase(), last ? x + w - 18 : x + 18, ty + 29); x += w; });
  ty += TH;
  rows.forEach((r, i) => {
    if (i % 2) { c.fillStyle = '#f8fafc'; c.fillRect(P, ty, TW, RH); }
    c.fillStyle = '#eef2f6'; c.fillRect(P, ty, TW, 1);
    let x = P;
    cols.forEach(([l, w, f], j) => {
      const last = j === cols.length - 1, forte = l === 'Motorista' || l === 'Início' || l === 'Data';
      if (l === 'Vaga' && r.vaga) {
        c.font = F(700, 18); const t = String(r.vaga), tw = Math.max(40, c.measureText(t).width + 20);
        roundRect(c, x + 14, ty + 15, tw, 32, 8); c.fillStyle = '#002147'; c.fill();
        c.fillStyle = '#ffffff'; c.textAlign = 'center'; c.fillText(t, x + 14 + tw / 2, ty + 38); c.textAlign = 'left';
        x += w; return;
      }
      c.font = F(forte ? 600 : 500, 17); c.fillStyle = forte ? '#0f1b2d' : '#344257';
      c.textAlign = last ? 'right' : 'left';
      c.fillText(fit(f(r), w - 30), last ? x + w - 18 : x + 18, ty + 38);
      x += w;
    });
    ty += RH;
  });
  c.restore(); c.textAlign = 'left';

  // rodapé
  const now = new Date();
  c.font = F(500, 14); c.fillStyle = '#64748b';
  c.fillText(`Gerado em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, P, H - 34);
  c.textAlign = 'right'; c.fillStyle = '#002147'; c.font = F(600, 14);
  c.fillText('Serafini Transportes · Sistema de Gestão', W - P, H - 34); c.textAlign = 'left';

  const blob = await new Promise(res => cv.toBlob(res, 'image/png'));
  if (!blob) return toast('Não foi possível gerar a imagem neste navegador.', 'warn', 'alert');
  const arq = `${tipo === 'escala' ? 'escala' : 'servicos'}-${multi ? dias[0] + '-a-' + dias[dias.length - 1] : dias[0]}.png`;
  const url = URL.createObjectURL(blob);
  let file = null; try { file = new File([blob], arq, { type: 'image/png' }); } catch (e) {}
  const canShare = !!(file && navigator.canShare && navigator.canShare({ files: [file] }));
  openModal({ size: 'lg', title: tipo === 'escala' ? 'Imagem da escala' : 'Imagem dos serviços', sub: `${rows.length} ${nomeTipo} · pronta para enviar no grupo`,
    body: `<div class="img-prev"><img src="${url}" alt="Prévia da imagem gerada"></div>`,
    footer: `<button class="btn btn-sec" data-x>Fechar</button>${canShare ? `<button class="btn btn-sec" id="imgShare">${ic('share', 15)}Compartilhar</button>` : ''}<button class="btn btn-pri" id="imgDown">${ic('download', 15)}Baixar imagem</button>` });
  $('#imgDown').onclick = () => { const a = document.createElement('a'); a.href = url; a.download = arq; document.body.appendChild(a); a.click(); a.remove(); toast('Imagem baixada. É só enviar no grupo.', 'ok', 'download'); };
  if ($('#imgShare')) $('#imgShare').onclick = () => navigator.share({ files: [file], title: 'Serafini Transportes' }).catch(() => {});
}
function del(cfg, it) {
  if (!it) return;
  if (cfg.col === 'usuarios' && me() && it.id === me().id) return toast('Você não pode excluir o próprio usuário enquanto está conectado.', 'warn', 'alert');
  if (cfg.col === 'terceiros' && S.pagTerceiros.some(g => g.terceiroId === it.id)) return toast('Este terceiro tem pagamentos lançados. Marque-o como Inativo em vez de excluir.', 'warn', 'alert');
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
    body: `${cfg.formNote ? noteBox(cfg.formNote) : ''}<form id="f" novalidate><div class="fgrid">${fld}</div></form>`,
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
  openModal({ size: 'lg', title: `Lote ${p.lote}`, sub: `Escala · Vaga ${esc(p.vaga || '—')} · ${fdate(p.data)} · ${esc(nome('empresas', p.clienteId))}`,
    body: `
      <div class="dt-badges">${badge(p.status, stProg(p.status))}${badge('A pagar: ' + pg, pgc)}${badge('A receber: ' + rc, rcc)}${p.ocorrencia ? badge('Com ocorrência', 'bad') : ''}</div>
      <div class="dl">
        <div><span>Cliente</span><b>${esc(nome('empresas', p.clienteId))}</b></div><div><span>Motorista</span><b>${esc(nome('motoristas', p.motoristaId))}</b></div>
        <div><span>Placa</span><b>${esc(p.placa)}</b></div><div><span>Vaga</span><b>${vagaTag(p)}</b></div>
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
  $('#dtEdit').onclick = () => { closeModal(); form(progCfg(), p); };
  if ($('#dtPag')) $('#dtPag').onclick = () => { closeModal(); form(pagCfg, null, { progId: p.id, qtd: p.qtdViagens, valorViagem: p.valorMotorista }); };
  if ($('#dtRec')) $('#dtRec').onclick = () => { closeModal(); rec ? form(recCfg, rec) : form(recCfg, null, { progId: p.id, valor: Math.max(0, total(p) - recProg(p.id)), status: 'Recebido' }); };
}

/* ---------------- Configuração das telas ---------------- */
const colData = { label: 'Data', render: r => fdate(r.data), sv: r => r.data };
const vagaTag = p => p.vaga ? `<span class="vaga" title="Vaga ${esc(p.vaga)}">${esc(p.vaga)}</span>` : '<span style="color:var(--sub)">—</span>';
const progCfg = (tipo = 'escala') => ({
  col: 'progs', group: 'Programação', title: 'Programar escala',
  newText: 'Nova escala', editText: 'Editar escala', searchPh: 'por vaga, lote, cliente, motorista ou placa',
  desc: 'Acompanhe cada operação da programação até o pagamento e o recebimento.',
  rows: () => S.progs.filter(p => p.tipo === tipo).sort((a, b) => b.data.localeCompare(a.data)),
  summary: rs => [['Programações', num(rs.length), 'calendar', 'Total cadastrado'], ['Em andamento', num(rs.filter(p => p.status === 'Em andamento').length), 'truck', 'Operações ativas agora'], ['Finalizadas', num(rs.filter(p => p.status === 'Finalizada').length), 'check', `${pct(rs.filter(p => p.status === 'Finalizada').length, rs.length)}% do total`], ['Total produzido', brl(sumBy(rs, total)), 'dollar', `${num(sumBy(rs, p => p.qtdViagens))} viagens realizadas`]],
  filter: { label: 'Status', get: p => p.status, options: ['Programada', 'Em andamento', 'Finalizada'] },
  cols: [
    colData, { label: 'Vaga', sv: p => +p.vaga || 0, render: vagaTag }, { label: 'Cliente', render: p => esc(nome('empresas', p.clienteId)) }, { label: 'Lote', k: 'lote', cls: 'mono' },
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
  dayFilter: true,
  hero: { img: 'img/porto-itapoa.jpg', alt: 'Navio porta-contêineres da Maersk atracado no Porto Itapoá', place: 'Porto Itapoá · SC',
    credit: ['Foto: Stanglavine / Wikimedia Commons · CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Maersk_Lebu_in_Itapo%C3%A1,_Brazil,_2025.jpg'] },
  select: { label: 'Gerar imagem', run: rows => escalaImagem(tipo, rows) },
  detail: progDetail
});
const pagCfg = (() => {
  const ok = id => !!by('progs', id);
  const mot = g => nome('motoristas', (by('progs', g.progId) || {}).motoristaId);
  return {
    col: 'pagamentos', group: 'Pagamentos', title: 'Pagamento de motoristas',
    newText: 'Novo pagamento', editText: 'Editar pagamento', searchPh: 'por motorista ou lote',
    desc: 'Pagamentos aos motoristas próprios e agregados, por lote. Cada lançamento atualiza o status da programação.',
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
})();
const tercAtivos = v => S.terceiros.filter(t => t.status !== 'Inativo' || t.id === v.terceiroId);
const pagTercCfg = {
  col: 'pagTerceiros', group: 'Pagamentos', title: 'Pagamento de terceiros', newText: 'Novo pagamento', editText: 'Editar pagamento de serviço', searchPh: 'por terceiro, serviço ou placa',
  desc: 'Pagamentos a fornecedores e prestadores cadastrados em Cadastros › Terceiro.',
  note: '<b>Somente pagamentos de serviços.</b> Use esta tela para borracharia, oficina, fornecedores e outros prestadores. Pagamentos de motoristas ficam em <a href="#/pag-motorista">Pagamento de motoristas</a>.',
  formNote: 'Somente pagamentos de <b>serviços</b> prestados por terceiros. Não é preciso informar lote.',
  rows: () => [...S.pagTerceiros].sort((a, b) => b.data.localeCompare(a.data)),
  summary: rs => { const t = sumBy(rs, g => g.valor); return [['Serviços pagos', num(rs.length), 'tool', 'Lançamentos registrados'], ['Total pago', brl(t), 'wallet', 'Em serviços de terceiros'], ['Prestadores', num(new Set(rs.map(g => g.terceiroId)).size), 'users', 'Terceiros diferentes pagos'], ['Média por serviço', brl(rs.length ? t / rs.length : 0), 'trend', 'Valor médio']]; },
  filter: { label: 'Categoria', get: g => (by('terceiros', g.terceiroId) || {}).categoria, options: CAT_TERC },
  cols: [
    { label: 'Data de pagamento', render: g => fdate(g.data), sv: g => g.data },
    { label: 'Terceiro', sv: g => nome('terceiros', g.terceiroId), render: g => person(nome('terceiros', g.terceiroId)) },
    { label: 'Categoria', render: g => esc((by('terceiros', g.terceiroId) || {}).categoria || '—') },
    { label: 'Serviço', k: 'servico' },
    { label: 'Veículo', cls: 'mono', render: g => g.placa ? esc(g.placa) : '<span style="color:var(--sub)">—</span>' },
    { label: 'Valor', r: 1, cls: 'strong', sv: g => g.valor, render: g => brl(g.valor) }, { label: 'Forma', k: 'forma' }
  ],
  fields: [
    { k: 'terceiroId', label: 'Terceiro', type: 'select', req: 1, full: 1, options: v => tercAtivos(v).map(t => [t.id, `${t.nome} · ${t.categoria}`]) },
    { k: 'servico', label: 'Descrição do serviço', req: 1, full: 1, ph: 'Ex.: troca de 2 pneus e alinhamento' },
    { k: 'data', label: 'Data de pagamento', type: 'date', req: 1 }, { k: 'valor', label: 'Valor', type: 'number', req: 1 },
    { k: 'forma', label: 'Forma de pagamento', type: 'select', req: 1, options: ['PIX', 'TED', 'Boleto', 'Dinheiro'] },
    { k: 'placa', label: 'Veículo atendido (opcional)', type: 'select', options: () => S.veiculos.map(v => [v.placa, `${v.placa} · ${v.modelo}`]) }
  ],
  defaults: () => ({ data: ymd(new Date()), forma: 'PIX' }),
  log: o => `Serviço pago: ${nome('terceiros', o.terceiroId)} — ${brl(o.valor)}`
};
const abastCfg = {
  col: 'abastecimentos', group: 'Pagamentos', title: 'Abastecimentos', newText: 'Novo abastecimento', editText: 'Editar abastecimento', searchPh: 'por placa ou posto',
  desc: 'Controle de combustível por veículo, com preço médio por litro.',
  rows: () => [...S.abastecimentos].sort((a, b) => b.data.localeCompare(a.data)),
  summary: rs => { const l = sumBy(rs, a => a.litros), v = sumBy(rs, a => a.valorTotal); return [['Abastecimentos', num(rs.length), 'fuel', 'Lançamentos registrados'], ['Total em litros', num(l) + ' L', 'fuel', `${num(rs.length ? Math.round(l / rs.length) : 0)} L por abastecimento`], ['Valor total', brl(v), 'dollar', 'Gasto com combustível'], ['Preço médio por litro', brl(l ? v / l : 0), 'trend', 'Média ponderada']]; },
  filter: { label: 'Placa', get: a => a.placa, options: () => S.veiculos.map(v => v.placa) },
  cols: [{ label: 'Data', render: a => fdate(a.data), sv: a => a.data }, { label: 'Placa', k: 'placa', cls: 'mono' }, { label: 'Veículo', render: a => esc(veic(a.placa).modelo || '—') }, { label: 'Local', k: 'local' }, { label: 'Litros', r: 1, sv: a => a.litros, render: a => num(a.litros) }, { label: 'Valor total', r: 1, cls: 'strong', sv: a => a.valorTotal, render: a => brl(a.valorTotal) }, { label: 'R$/L', r: 1, sv: a => a.litros ? a.valorTotal / a.litros : 0, render: a => brl(a.litros ? a.valorTotal / a.litros : 0) }],
  fields: [{ k: 'data', label: 'Data', type: 'date', req: 1 }, { k: 'placa', label: 'Placa', type: 'select', req: 1, options: () => S.veiculos.map(v => [v.placa, `${v.placa} · ${v.modelo}`]) }, { k: 'litros', label: 'Litros', type: 'number', req: 1 }, { k: 'valorTotal', label: 'Valor total', type: 'number', req: 1 }, { k: 'local', label: 'Local de abastecimento', full: 1, req: 1, ph: 'Ex.: Posto Ipiranga BR-116' }],
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
    col: 'motoristas', group: 'Cadastros', title: 'Motoristas', newText: 'Novo motorista', editText: 'Editar motorista', searchPh: 'por nome, CPF ou telefone', desc: 'Motoristas próprios e agregados que podem ser programados. A validade da CNH alimenta a aba Controle.',
    summary: rs => [['Motoristas', num(rs.length), 'users', 'Total cadastrado'], ['Frota própria', num(rs.filter(m => m.tipo === 'Próprio').length), 'user', 'Motoristas próprios'], ['Agregados', num(rs.filter(m => m.tipo === 'Agregado').length), 'users', 'Motoristas agregados'], ['Ativos', num(rs.filter(m => m.status === 'Ativo').length), 'check', 'Disponíveis para programação']],
    filter: { label: 'Tipo', get: m => m.tipo, options: ['Próprio', 'Agregado'] },
    cols: [{ label: 'Nome', sv: m => m.nome, render: m => person(m.nome) }, { label: 'CPF', k: 'cpf' }, { label: 'Telefone', k: 'telefone' }, { label: 'CNH', sv: m => m.cnhNum || '', render: m => m.cnhNum ? `${esc(m.cnhNum)} <span style="color:var(--mut)">· ${esc(m.cnh || '—')}</span>` : `<span style="color:var(--sub)">Cat. ${esc(m.cnh || '—')}</span>` }, { label: 'Validade da CNH', sv: m => m.cnhVal || '', render: cnhStatus }, { label: 'Tipo', render: m => badge(m.tipo, m.tipo === 'Próprio' ? 'run' : 'no') }, { label: 'Viagens', r: 1, sv: m => sumBy(S.progs.filter(p => p.motoristaId === m.id), p => p.qtdViagens), render: m => num(sumBy(S.progs.filter(p => p.motoristaId === m.id), p => p.qtdViagens)) }, { label: 'Status', render: m => badge(m.status, m.status === 'Ativo' ? 'ok' : 'no') }],
    fields: [{ k: 'nome', label: 'Nome completo', req: 1, full: 1 }, { k: 'cpf', label: 'CPF', req: 1, ph: '000.000.000-00' }, { k: 'telefone', label: 'Telefone', ph: '(00) 00000-0000' }, { k: 'cnhNum', label: 'Número da CNH', req: 1, ph: '00000000000' }, { k: 'cnh', label: 'Categoria da CNH', type: 'select', req: 1, options: ['C', 'D', 'E'] }, { k: 'cnhVal', label: 'Validade da CNH', type: 'date', req: 1 }, { k: 'tipo', label: 'Tipo', type: 'select', req: 1, options: ['Próprio', 'Agregado'] }, { k: 'status', label: 'Status', type: 'select', req: 1, options: ['Ativo', 'Inativo'] }],
    defaults: () => ({ tipo: 'Próprio', status: 'Ativo', cnh: 'E' }), log: (o, n) => `${n ? 'Motorista cadastrado' : 'Motorista atualizado'}: ${o.nome}`
  },
  veiculos: {
    col: 'veiculos', group: 'Cadastros', title: 'Veículos', newText: 'Novo veículo', editText: 'Editar veículo', searchPh: 'por placa, modelo ou proprietário', desc: 'Frota própria e veículos de agregados. O mês de vencimento do IPVA alimenta a aba Controle.',
    summary: rs => [['Veículos', num(rs.length), 'truck', 'Total cadastrado'], ['Frota própria', num(rs.filter(v => v.proprietario === 'Frota própria').length), 'building', 'Veículos da empresa'], ['IPVA em atenção', num(rs.filter(v => sitIpva(v)[2] >= 1).length), 'alert', 'Vencido ou vence em até 1 mês'], ['Combustível', brl(sumBy(S.abastecimentos, a => a.valorTotal)), 'fuel', 'Total abastecido']],
    cols: [{ label: 'Placa', k: 'placa', cls: 'mono' }, { label: 'Modelo', k: 'modelo' }, { label: 'Tipo', k: 'tipo' }, { label: 'Proprietário', k: 'proprietario' }, { label: 'Vencimento do IPVA', sv: v => v.ipvaVenc || '', render: ipvaStatus }, { label: 'Abastecimentos', r: 1, sv: v => S.abastecimentos.filter(a => a.placa === v.placa).length, render: v => num(S.abastecimentos.filter(a => a.placa === v.placa).length) }, { label: 'Litros', r: 1, sv: v => sumBy(S.abastecimentos.filter(a => a.placa === v.placa), a => a.litros), render: v => num(sumBy(S.abastecimentos.filter(a => a.placa === v.placa), a => a.litros)) + ' L' }],
    fields: [{ k: 'placa', label: 'Placa', req: 1, ph: 'AAA-0A00' }, { k: 'modelo', label: 'Modelo', req: 1 }, { k: 'tipo', label: 'Tipo', type: 'select', options: ['Cavalo mecânico', 'Carreta', 'Truck', 'VUC'] }, { k: 'proprietario', label: 'Proprietário', ph: 'Frota própria ou nome do agregado' }, { k: 'ipvaVenc', label: 'Vencimento do IPVA (mês/ano)', type: 'month', req: 1, ph: 'AAAA-MM' }],
    defaults: () => ({ tipo: 'Cavalo mecânico', proprietario: 'Frota própria' }), log: (o, n) => `${n ? 'Veículo cadastrado' : 'Veículo atualizado'}: ${o.placa}`
  },
  empresas: {
    col: 'empresas', group: 'Cadastros', title: 'Empresas', newText: 'Nova empresa', editText: 'Editar empresa', searchPh: 'por nome ou CNPJ', desc: 'Empresas atendidas pela operação.',
    summary: rs => [['Clientes', num(rs.length), 'building', 'Empresas cadastradas'], ['Faturamento total', brl(sumBy(S.progs, total)), 'dollar', 'Todas as programações'], ['Programações', num(S.progs.length), 'calendar', 'Para todos os clientes']],
    cols: [{ label: 'Empresa', sv: e => e.nome, render: e => person(e.nome) }, { label: 'CNPJ', k: 'cnpj' }, { label: 'Contato', k: 'contato' }, { label: 'Programações', r: 1, sv: e => S.progs.filter(p => p.clienteId === e.id).length, render: e => num(S.progs.filter(p => p.clienteId === e.id).length) }, { label: 'Faturamento', r: 1, cls: 'strong', sv: e => sumBy(S.progs.filter(p => p.clienteId === e.id), total), render: e => brl(sumBy(S.progs.filter(p => p.clienteId === e.id), total)) }],
    fields: [{ k: 'nome', label: 'Razão social / nome fantasia', req: 1, full: 1 }, { k: 'cnpj', label: 'CNPJ', ph: '00.000.000/0000-00' }, { k: 'contato', label: 'Contato' }],
    log: (o, n) => `${n ? 'Empresa cadastrada' : 'Empresa atualizada'}: ${o.nome}`
  },
  terceiros: {
    col: 'terceiros', group: 'Cadastros', title: 'Terceiros', newText: 'Novo terceiro', editText: 'Editar terceiro', searchPh: 'por nome, categoria ou documento', desc: 'Fornecedores, borracharias, oficinas e outros prestadores de serviço. Os pagamentos ficam em Pagamentos › Pagamento de terceiros.',
    summary: rs => { const pago = id => sumBy(S.pagTerceiros.filter(g => g.terceiroId === id), g => g.valor); return [['Terceiros', num(rs.length), 'tool', 'Prestadores cadastrados'], ['Ativos', num(rs.filter(t => t.status !== 'Inativo').length), 'check', 'Disponíveis para pagamento'], ['Total pago', brl(sumBy(rs, t => pago(t.id))), 'wallet', 'Em serviços'], ['Serviços pagos', num(S.pagTerceiros.length), 'receipt', 'Lançamentos registrados']]; },
    filter: { label: 'Categoria', get: t => t.categoria, options: CAT_TERC },
    cols: [
      { label: 'Nome', sv: t => t.nome, render: t => person(t.nome) }, { label: 'Categoria', k: 'categoria' }, { label: 'CPF / CNPJ', k: 'documento' }, { label: 'Telefone', k: 'telefone' }, { label: 'Chave PIX', k: 'pix' },
      { label: 'Total pago', r: 1, cls: 'strong', sv: t => sumBy(S.pagTerceiros.filter(g => g.terceiroId === t.id), g => g.valor), render: t => brl(sumBy(S.pagTerceiros.filter(g => g.terceiroId === t.id), g => g.valor)) },
      { label: 'Status', render: t => badge(t.status || 'Ativo', t.status === 'Inativo' ? 'no' : 'ok') }
    ],
    fields: [{ k: 'nome', label: 'Nome / razão social', req: 1, full: 1 }, { k: 'categoria', label: 'Categoria', type: 'select', req: 1, options: CAT_TERC }, { k: 'documento', label: 'CPF ou CNPJ', ph: '00.000.000/0000-00' }, { k: 'telefone', label: 'Telefone', ph: '(00) 00000-0000' }, { k: 'pix', label: 'Chave PIX' }, { k: 'status', label: 'Status', type: 'select', req: 1, options: ['Ativo', 'Inativo'] }],
    defaults: () => ({ status: 'Ativo' }), log: (o, n) => `${n ? 'Terceiro cadastrado' : 'Terceiro atualizado'}: ${o.nome}`
  },
  usuarios: {
    col: 'usuarios', group: 'Cadastros', title: 'Usuários', newText: 'Novo usuário', editText: 'Editar usuário', searchPh: 'por nome ou e-mail', desc: 'O diretor (CEO) alimenta e controla todo o sistema e pode incluir outras pessoas para ajudar, acompanhando tudo.',
    summary: rs => [['Usuários', num(rs.length), 'users', 'Com acesso ao sistema'], ['Acesso total', num(rs.filter(u => ACESSO_TOTAL.includes(u.perfil)).length), 'lock', 'Diretor e administradores'], ['Ativos', num(rs.filter(u => u.status !== 'Inativo').length), 'check', 'Podem entrar no sistema']],
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
  const serv = sumBy(S.pagTerceiros.filter(g => !s || g.data >= s), g => g.valor);
  const viagens = sumBy(P, x => x.qtdViagens);
  const margem = produzido - custoTot - comb - serv;
  const pend = pendencias(P);
  return {
    P, produzido, recebido, aReceber: Math.max(0, produzido - recebido), custoTot, pago, aPagar: Math.max(0, custoTot - pago),
    comb, serv, litros: sumBy(A, a => a.litros), viagens, margem, margemPct: pct(margem, produzido), ticket: viagens ? produzido / viagens : 0,
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
    ['Margem operacional', `<span class="${m.margem < 0 ? 'neg' : ''}">${brl(m.margem)}</span>`, 'trend', `${m.margemPct}% · após motoristas, combustível e serviços`, meter(m.margemPct), flash('margem', m.margem)]
  ].map(statCard).join('');
}
function stripHtmlBlock(m) {
  const c = (icon, l, v, s) => `<div><span class="ti">${ic(icon, 17)}</span><div><span>${l}</span><b>${v}</b><em>${s}</em></div></div>`;
  return `<div class="strip">${c('truck', 'Em andamento', num(m.ativas.length), 'operações agora')}${c('calendar', 'Programadas', num(m.programadas.length), 'aguardando início')}${c('wallet', 'A pagar a motoristas', brl(m.aPagar), 'inclui operações em andamento')}${c('fuel', 'Combustível e serviços', brl(m.comb + m.serv), `${brl(m.comb)} comb. · ${brl(m.serv)} serv.`)}</div>`;
}
function stackHtml(m) {
  const row = (t, a, la, b, lb) => {
    const tot = a + b, pa = tot ? a / tot * 100 : 0;
    return `<div class="stack-row"><div class="stack-h"><b>${t}</b><span>${brl(tot)}</span></div>
      <div class="stack">${pa > 0 ? `<i class="s-a" style="width:${pa}%"></i>` : ''}${pa < 100 ? `<i class="s-b" style="width:${100 - pa}%"></i>` : ''}</div>
      <div class="stack-l"><span><i class="s-a"></i>${la} <b>${brl(a)}</b></span><span><i class="s-b"></i>${lb} <b>${brl(b)}</b></span></div></div>`;
  };
  return row('Clientes', m.recebido, 'Recebido', m.aReceber, 'A receber') + row('Motoristas', m.pago, 'Pago', m.aPagar, 'A pagar');
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
      <div class="op-s">${p.vaga ? `<span class="vaga sm">${esc(p.vaga)}</span>` : ''}${esc(nome('empresas', p.clienteId))} · Lote ${esc(p.lote)} · ${esc(p.placa)}</div>
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
    ${alertBar()}
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

/* ---------------- Controle de vencimentos ---------------- */
function alertBar() {
  const al = alertas();
  if (!al.length) return '';
  const venc = al.filter(x => x.sit[2] === 2).length;
  return `<a class="alert-bar ${venc ? 'bad' : ''}" href="#/controle"><span class="ab-ic">${ic('alert', 17)}</span><div class="ab-t"><b>${al.length} vencimento${al.length === 1 ? '' : 's'} precisa${al.length === 1 ? '' : 'm'} de atenção</b><span>${al.slice(0, 3).map(x => esc(alertTxt(x))).join(' · ')}${al.length > 3 ? ` · e mais ${al.length - 3}` : ''}</span></div><span class="ab-go">Ver controle${ic('chevR', 15)}</span></a>`;
}
let ctl = { q: '', t: '', s: '' };
function controle() {
  const all = vencs();
  const nv = all.filter(x => x.sit[2] === 2), na = all.filter(x => x.sit[2] === 1), nk = all.filter(x => x.sit[2] === 0), ns = all.filter(x => x.sit[2] < 0);
  const sum = [
    ['Vencidos', num(nv.length), 'alert', 'Precisam ser regularizados', '', nv.length ? 'is-bad' : ''],
    ['Vencem em até 1 mês', num(na.length), 'clock', 'Programe a renovação', '', na.length ? 'is-warn' : ''],
    ['Em dia', num(nk.length), 'check', `${pct(nk.length, all.length)}% dos documentos`],
    ['Acompanhados', num(all.length), 'shield', `${num(S.veiculos.length)} veículo(s) · ${num(S.motoristas.length)} motorista(s)${ns.length ? ` · ${ns.length} sem data` : ''}`]
  ];
  const sitOpts = [['2', 'Vencido'], ['1', 'Vence em até 1 mês'], ['0', 'Em dia'], ['-1', 'Sem data informada']];
  $('#app').innerHTML = `
    ${pageHead('', 'Controle de vencimentos', 'IPVA dos veículos e CNH dos motoristas. O sistema avisa quando faltar 1 mês para o vencimento.')}
    ${sumBlock(sum)}
    <div class="panel">
      <div class="toolbar">
        <div class="tb-l"><div class="search">${ic('search')}<input id="q" placeholder="Buscar por placa ou nome..." value="${esc(ctl.q)}" aria-label="Buscar"></div>
          <select id="fT" class="sel-sm" aria-label="Filtrar por tipo"><option value="">Tipo: todos</option>${['Veículo', 'Motorista'].map(o => `<option ${o === ctl.t ? 'selected' : ''}>${o}</option>`).join('')}</select>
          <select id="fS" class="sel-sm" aria-label="Filtrar por situação"><option value="">Situação: todas</option>${sitOpts.map(([v, l]) => `<option value="${v}" ${v === ctl.s ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="tb-r"><span class="count" id="cnt"></span></div>
      </div>
      <div class="tscroll"><table class="tbl"><thead><tr><th>Tipo</th><th>Identificação</th><th>Documento</th><th>Vencimento</th><th>Situação</th><th class="act" aria-label="Ações"></th></tr></thead><tbody id="tb"></tbody></table></div>
      <div class="tbl-foot"><span id="cnt2"></span><span>IPVA pelo mês/ano · CNH pela data de validade · clique na linha para atualizar</span></div>
    </div>`;
  const view = () => {
    const q = ctl.q.toLowerCase();
    const rows = all.filter(x => (!ctl.t || x.tipo === ctl.t) && (ctl.s === '' || String(x.sit[2]) === ctl.s) && (!q || `${x.ident} ${x.sub}`.toLowerCase().includes(q)));
    $('#tb').innerHTML = rows.length ? rows.map(x => `<tr class="click" data-k="${x.key}">
        <td>${badge(x.tipo, x.tipo === 'Veículo' ? 'run' : 'no')}</td>
        <td>${x.tipo === 'Veículo' ? `<span class="mono"><b>${esc(x.ident)}</b></span> <span style="color:var(--mut)">· ${esc(x.sub)}</span>` : person(x.ident)}</td>
        <td><b>${x.doc}</b> <span style="color:var(--mut)">${x.doc === 'IPVA' ? 'mês/ano' : esc(x.sub)}</span></td>
        <td class="mono">${x.sit[2] < 0 ? '<span style="color:var(--sub)">Não informado</span>' : esc(x.venc)}</td>
        <td>${badge(x.sit[0], x.sit[1])}</td>
        <td class="act"><div><button class="ib" data-e="${x.key}" title="Atualizar vencimento" aria-label="Atualizar vencimento">${ic('pencil', 15)}</button></div></td></tr>`).join('')
      : `<tr><td colspan="6">${emptyState('Nenhum resultado encontrado', '<div>Ajuste a busca ou os filtros.</div>', 'search')}</td></tr>`;
    $('#cnt').textContent = `${rows.length} de ${all.length}`;
    $('#cnt2').textContent = `Mostrando ${rows.length} de ${all.length} documento${all.length === 1 ? '' : 's'}`;
    const open = k => { const x = all.find(y => y.key === k); if (x) form(cadastros[x.col], x.ref); };
    $$('#tb tr[data-k]').forEach(tr => tr.onclick = () => open(tr.dataset.k));
    $$('#tb [data-e]').forEach(b => b.onclick = e => { e.stopPropagation(); open(b.dataset.e); });
  };
  view();
  bindSum();
  $('#q').oninput = e => { ctl.q = e.target.value; view(); };
  $('#fT').onchange = e => { ctl.t = e.target.value; view(); };
  $('#fS').onchange = e => { ctl.s = e.target.value; view(); };
}

/* ---------------- Rotas ---------------- */
const routes = {
  dashboard, tv, controle,
  escala: () => crud(progCfg()),
  'pag-motorista': () => crud(pagCfg), 'pag-terceiros': () => crud(pagTercCfg),
  abastecimentos: () => crud(abastCfg), rpas: () => crud(recCfg),
  motoristas: () => crud(cadastros.motoristas), veiculos: () => crud(cadastros.veiculos), empresas: () => crud(cadastros.empresas), terceiros: () => crud(cadastros.terceiros), usuarios: () => crud(cadastros.usuarios)
};
function render(fromChange) {
  if (!me()) return renderLogin();
  if (modalOpen) { pendingRender = true; return; }
  let r = location.hash.replace('#/', '') || 'dashboard';
  if (r === 'servico') { history.replaceState(null, '', '#/escala'); r = 'escala'; }
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
  S.progs.push({ id: uid(), tipo: 'escala', data: ymd(new Date()), clienteId: c.id, lote: `25GX${rnd(1000, 9999)}HR`, vaga: rnd(10, 99), motoristaId: m.id, placa: v.placa, valorViagem: vv, valorMotorista: Math.round(vv * .39), qtdPrevista: rnd(8, 24), qtdViagens: 0, inicio: '06:00', fim: '', status: 'Programada', ocorrencia: false, valorOcorrencia: 0 });
  save(`Nova programação: ${m.nome} → ${c.nome}`, '🗓️');
}
function toggleLive() {
  const b = $('#btnLive');
  if (timer) { clearInterval(timer); timer = null; }
  else { tick(); timer = setInterval(tick, 3500); }
  if (b) b.classList.toggle('on', !!timer);
}

/* ---------------- Início ---------------- */
S = migrate(load() || seed());
store.set(KEY, JSON.stringify(S));
if (new URLSearchParams(location.search).has('demo') && !me()) store.set(SKEY, 'u1');
setInterval(clock, 15000);
let lastY = 0;
const onScroll = () => {
  const t = $('#top'); if (!t) return;
  const y = Math.max(0, window.scrollY), um = $('#um');
  t.classList.toggle('scrolled', y > 8);
  if (y < 80 || (um && um.classList.contains('open')) || ($('#nt') && $('#nt').classList.contains('open'))) t.classList.remove('nav-hidden');
  else if (y > lastY + 4) t.classList.add('nav-hidden');
  else if (y < lastY - 4) t.classList.remove('nav-hidden');
  if (Math.abs(y - lastY) > 4) lastY = y;
};
window.addEventListener('scroll', onScroll, { passive: true });
boot();
})();
