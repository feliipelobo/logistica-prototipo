/* LogiControl — protótipo de apresentação (dados fictícios, salvos no navegador) */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const brl = n => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const num = n => (n || 0).toLocaleString('pt-BR');
const fdate = s => s ? s.split('-').reverse().join('/') : '—';
const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[Math.floor(Math.random() * a.length)];

/* ---------------- Estado ---------------- */
const KEY = 'logicontrol_proto_v1';
let S;
let modalOpen = false, pendingRender = false;

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
    { id: 'u1', nome: 'Administrador', email: 'admin@logicontrol.com', perfil: 'Administrador' },
    { id: 'u2', nome: 'Fernanda Lima', email: 'fernanda@logicontrol.com', perfil: 'Financeiro' },
    { id: 'u3', nome: 'Ricardo Nunes', email: 'ricardo@logicontrol.com', perfil: 'Operação' }
  ];
  const vm = { 150: 60, 180: 70, 210: 85, 240: 95 };
  const progs = [], pagamentos = [], recebimentos = [], abastecimentos = [];
  const today = new Date();
  const N = 30;
  for (let i = 0; i < N; i++) {
    const daysAgo = Math.round(55 - (i * 55) / (N - 1));
    const d = new Date(today); d.setDate(d.getDate() - daysAgo);
    const mi = ri(0, 5), vi = mi;
    const vv = pk([150, 180, 180, 210, 240]);
    const prev = ri(8, 24);
    let status = 'Finalizada', real = prev;
    if (i >= N - 4) { status = 'Em andamento'; real = ri(2, prev - 2); }
    if (i >= N - 2) { status = 'Programada'; real = 0; }
    const p = {
      id: 'p' + (i + 1), tipo: i % 3 === 2 ? 'servico' : 'escala', data: ymd(d), clienteId: pk(empresas).id,
      lote: `25GX${ri(1000, 9999)}HR`, vaga: ri(10, 99), motoristaId: motoristas[mi].id, placa: veiculos[vi].placa,
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
    if (r() < .4) abastecimentos.push({ id: 'ab' + (i + 1), data: p.data, placa: p.placa, litros: ri(90, 220), valorTotal: 0, local: pk(['Posto Ipiranga BR-116', 'Shell Rodovia Anchieta', 'Posto Graal Imigrantes', 'Petrobras Cubatão']) });
  }
  abastecimentos.forEach(a => a.valorTotal = Math.round(a.litros * (5.9 + r() * .5) * 100) / 100);
  return { empresas, motoristas, veiculos, usuarios, progs, pagamentos, recebimentos, abastecimentos, log: [{ t: Date.now(), icon: '🚀', msg: 'Sistema iniciado com dados fictícios de demonstração' }] };
}

function load() { try { const v = localStorage.getItem(KEY); if (v) return JSON.parse(v); } catch (e) {} return null; }
function save(msg, icon) {
  if (msg) { S.log.unshift({ t: Date.now(), msg, icon: icon || '•' }); S.log = S.log.slice(0, 40); toast(msg); }
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  render(true);
}
window.addEventListener('storage', e => { if (e.key === KEY) { S = load() || S; render(true); } });
function toast(t) {
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = t;
  $('#toasts').appendChild(el); setTimeout(() => el.remove(), 3600);
}

/* ---------------- Derivados ---------------- */
const by = (col, id) => S[col].find(x => x.id === id);
const nome = (col, id) => (by(col, id) || {}).nome || '—';
const total = p => Math.max(0, p.qtdViagens * p.valorViagem - (p.ocorrencia ? p.valorOcorrencia : 0));
const custo = p => p.qtdViagens * p.valorMotorista;
const pgTotal = g => g.qtd * g.valorViagem - g.vale;
const pgBruto = g => g.qtd * g.valorViagem;
const pagoProg = id => S.pagamentos.filter(g => g.progId === id).reduce((s, g) => s + pgBruto(g), 0);
const recProg = id => S.recebimentos.filter(g => g.progId === id && g.status === 'Recebido').reduce((s, g) => s + g.valor, 0);
function stPagar(p) {
  const c = custo(p), pg = pagoProg(p.id);
  if (!p.qtdViagens) return ['Aguardando', 'no'];
  if (pg >= c && pg > 0) return ['Pago', 'ok'];
  if (pg > 0) return ['Parcial', 'wait'];
  return ['Pendente', 'wait'];
}
function stReceber(p) {
  if (!p.qtdViagens) return ['Aguardando', 'no'];
  const rc = recProg(p.id);
  if (rc >= total(p) && rc > 0) return ['Recebido', 'ok'];
  return S.recebimentos.some(g => g.progId === p.id) ? ['Em aberto', 'wait'] : ['Pendente', 'wait'];
}
const stProg = s => ({ 'Finalizada': 'ok', 'Em andamento': 'run', 'Programada': 'no' }[s] || 'no');
const badge = (t, c) => `<span class="badge b-${c}">${esc(t)}</span>`;
const progLabel = p => `${p.lote} · ${nome('empresas', p.clienteId)} · ${nome('motoristas', p.motoristaId)}`;
const veic = placa => S.veiculos.find(v => v.placa === placa);

/* ---------------- Modal ---------------- */
function openModal(title, body, footer) {
  modalOpen = true;
  const m = $('#modal'); m.hidden = false;
  m.innerHTML = `<div class="dlg"><header><h2>${esc(title)}</h2><button type="button" data-x>×</button></header>${body}${footer || ''}</div>`;
  m.onclick = e => { if (e.target === m || e.target.hasAttribute('data-x')) closeModal(); };
}
function closeModal() {
  modalOpen = false; const m = $('#modal'); m.hidden = true; m.innerHTML = '';
  if (pendingRender) { pendingRender = false; render(); }
}

/* ---------------- CRUD genérico ---------------- */
function crud(cfg) {
  const rows = cfg.rows ? cfg.rows() : S[cfg.col];
  const sum = cfg.summary ? cfg.summary(rows) : [];
  const app = $('#app');
  app.innerHTML = `
    <div class="head"><div><div class="crumb">Serafini Transportes › ${cfg.title}</div><h1>${cfg.title}</h1><p class="sub-h">${cfg.desc || ''}</p></div>
      <div class="tools"><input class="search" placeholder="Buscar..." id="q"><button class="btn pri" id="novo">+ ${cfg.newLabel || 'Novo'}</button></div></div>
    ${sum.length ? `<div class="list-kpis"><div class="kpis">${sum.map(k => `<div class="kpi ${k[2] || ''}"><small>${k[0]}</small><b>${k[1]}</b></div>`).join('')}</div></div>` : ''}
    <div class="tablewrap"><table><thead><tr>${cfg.cols.map(c => `<th class="${c.r ? 'r' : ''}">${c.label}</th>`).join('')}<th></th></tr></thead>
    <tbody>${rows.length ? rows.map(row => `<tr data-id="${row.id}" class="${cfg.detail ? 'click' : ''}">${cfg.cols.map(c => `<td class="${c.r ? 'r' : ''}">${c.render ? c.render(row) : esc(row[c.k])}</td>`).join('')}
      <td><div class="act"><button class="btn sm sec" data-e="${row.id}">Editar</button><button class="btn sm danger" data-d="${row.id}">Excluir</button></div></td></tr>`).join('') : `<tr><td class="empty" colspan="${cfg.cols.length + 1}">Nenhum registro ainda. Clique em “+ ${cfg.newLabel || 'Novo'}”.</td></tr>`}</tbody></table></div>`;
  $('#q').oninput = e => { const t = e.target.value.toLowerCase(); app.querySelectorAll('tbody tr[data-id]').forEach(tr => tr.hidden = !tr.textContent.toLowerCase().includes(t)); };
  $('#novo').onclick = () => form(cfg, null);
  app.querySelectorAll('[data-e]').forEach(b => b.onclick = e => { e.stopPropagation(); form(cfg, by(cfg.col, b.dataset.e)); });
  app.querySelectorAll('[data-d]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    const it = by(cfg.col, b.dataset.d);
    if (!confirm('Excluir este registro?')) return;
    S[cfg.col] = S[cfg.col].filter(x => x.id !== it.id);
    if (cfg.col === 'progs') ['pagamentos', 'recebimentos'].forEach(c => S[c] = S[c].filter(x => x.progId !== it.id));
    save('Registro excluído em ' + cfg.title, '🗑️');
  });
  if (cfg.detail) app.querySelectorAll('tbody tr.click').forEach(tr => tr.onclick = () => cfg.detail(by(cfg.col, tr.dataset.id)));
}

function form(cfg, item) {
  const v = item ? { ...item } : { ...(cfg.defaults ? cfg.defaults() : {}) };
  const fld = cfg.fields.map(f => {
    const val = v[f.k] ?? '';
    let input;
    if (f.type === 'select') {
      const opts = (typeof f.options === 'function' ? f.options(v) : f.options).map(o => Array.isArray(o) ? o : [o, o]);
      input = `<select name="${f.k}" ${f.req ? 'required' : ''}><option value="">Selecione...</option>${opts.map(o => `<option value="${esc(o[0])}" ${String(o[0]) === String(val) ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select>`;
    } else if (f.type === 'checkbox') {
      return `<label class="chk"><input type="checkbox" name="${f.k}" ${val ? 'checked' : ''}> ${f.label}</label>`;
    } else {
      input = `<input name="${f.k}" type="${f.type || 'text'}" value="${esc(val)}" ${f.type === 'number' ? 'step="0.01" min="0"' : ''} ${f.req ? 'required' : ''} ${f.ph ? `placeholder="${f.ph}"` : ''}>`;
    }
    return `<label class="${f.full ? 'full' : ''}">${f.label}${input}</label>`;
  }).join('');
  openModal((item ? 'Editar ' : 'Novo ') + (cfg.newLabel || cfg.title),
    `<form id="f"><div class="fgrid">${fld}</div></form>`,
    `<footer><button class="btn sec" type="button" data-x>Cancelar</button><button class="btn" form="f">Salvar</button></footer>`);
  const fe = $('#f');
  const read = () => {
    const o = {};
    cfg.fields.forEach(f => {
      const el = fe.elements[f.k];
      o[f.k] = f.type === 'checkbox' ? el.checked : f.type === 'number' ? (el.value === '' ? '' : parseFloat(el.value)) : el.value;
    });
    return o;
  };
  fe.addEventListener('change', e => {
    if (!cfg.onChange) return;
    const cur = read(); const upd = cfg.onChange(cur, e.target.name) || {};
    Object.entries(upd).forEach(([k, val]) => { if (fe.elements[k]) fe.elements[k].value = val; });
  });
  fe.onsubmit = e => {
    e.preventDefault();
    const o = read();
    cfg.fields.filter(f => f.type === 'number').forEach(f => { if (o[f.k] === '') o[f.k] = 0; });
    if (cfg.beforeSave) cfg.beforeSave(o);
    const isNew = !item;
    if (isNew) { o.id = uid(); S[cfg.col].push(o); } else Object.assign(item, o);
    closeModal();
    save(cfg.log ? cfg.log(o, isNew) : (isNew ? 'Novo registro em ' : 'Registro atualizado em ') + cfg.title, isNew ? '✅' : '✏️');
  };
}

/* ---------------- Detalhe da programação (layout da planilha) ---------------- */
function progDetail(p) {
  const [pg] = stPagar(p), [rc] = stReceber(p);
  const done = p.status === 'Finalizada';
  const pgm = S.pagamentos.find(g => g.progId === p.id), rec = S.recebimentos.find(g => g.progId === p.id);
  openModal('Programação ' + p.lote, `<div class="body"><div class="sheet">
    <div class="s1">DATA: ${fdate(p.data)}</div>
    <div class="s2">CLIENTE: ${esc(nome('empresas', p.clienteId))}</div><div class="s2">LOTE: ${esc(p.lote)}</div><div class="s2">VAGA: ${p.vaga}</div>
    <div class="s2">PLACA: ${esc(p.placa)}</div><div class="s2">MOTORISTA: ${esc(nome('motoristas', p.motoristaId))}</div>
    <div class="s2">VALOR DA VIAGEM: ${brl(p.valorViagem)}</div><div class="s2">INÍCIO: ${p.inicio || '—'}</div>
    <div class="s1">QUANTIDADE DE VIAGENS: ${p.qtdViagens} / ${p.qtdPrevista}</div><div class="s1">STATUS: ${p.status.toUpperCase()}</div><div class="s1">FIM: ${p.fim || '—'}</div>
    <div class="s3">OCORRÊNCIAS: ${p.ocorrencia ? 'SIM' : 'NÃO'}</div><div class="s3">VALOR OCORRÊNCIA: ${brl(p.ocorrencia ? p.valorOcorrencia : 0)}</div>
    <div class="s3">TOTAL PRODUZIDO: ${brl(total(p))}</div>
    <div class="s2">PAGAMENTO MOTORISTA: ${pgm ? fdate(pgm.data) + ' · ' + brl(pgTotal(pgm)) + ' (vale ' + brl(pgm.vale) + ')' : 'não lançado'}</div>
    <div class="s2">RECEBIMENTO: ${rec ? fdate(rec.data) + ' · ' + brl(rec.valor) + ' · ' + rec.status : 'não lançado'}</div>
    <div class="s4 ${done ? 'ok' : ''}">ESCALA: ${p.status.toUpperCase()}</div>
    <div class="s4 ${rc === 'Recebido' ? 'ok' : ''}">VALOR A RECEBER: ${rc === 'Recebido' ? 'FINALIZADO' : rc.toUpperCase()}</div>
    <div class="s4 ${pg === 'Pago' ? 'ok' : ''}">VALOR A PAGAR: ${pg === 'Pago' ? 'FINALIZADO' : pg.toUpperCase()}</div>
  </div></div>`, `<footer><button class="btn sec" data-x>Fechar</button></footer>`);
}

/* ---------------- Telas ---------------- */
const progCfg = tipo => ({
  col: 'progs', title: tipo === 'escala' ? 'Programar escala' : 'Programar serviço', newLabel: tipo === 'escala' ? 'Escala' : 'Serviço',
  desc: 'Clique numa linha para ver a ficha completa. Os status de pagamento e recebimento são atualizados automaticamente.',
  rows: () => S.progs.filter(p => p.tipo === tipo).sort((a, b) => b.data.localeCompare(a.data)),
  summary: rs => [['Programações', rs.length], ['Em andamento', rs.filter(p => p.status === 'Em andamento').length, 'a'], ['Finalizadas', rs.filter(p => p.status === 'Finalizada').length, 'g'], ['Total produzido', brl(rs.reduce((s, p) => s + total(p), 0)), 'n']],
  cols: [
    { label: 'Data', render: p => fdate(p.data) }, { label: 'Cliente', render: p => esc(nome('empresas', p.clienteId)) }, { label: 'Lote', k: 'lote' },
    { label: 'Motorista', render: p => esc(nome('motoristas', p.motoristaId)) }, { label: 'Placa', k: 'placa' },
    { label: 'Viagens', render: p => `${p.qtdViagens}/${p.qtdPrevista}<div class="bar"><i class="${p.qtdViagens >= p.qtdPrevista ? 'full' : ''}" style="width:${Math.min(100, p.qtdPrevista ? p.qtdViagens / p.qtdPrevista * 100 : 0)}%"></i></div>` },
    { label: 'Total produzido', r: 1, render: p => brl(total(p)) },
    { label: 'Status', render: p => badge(p.status, stProg(p.status)) },
    { label: 'Pagar', render: p => badge(...stPagar(p)) }, { label: 'Receber', render: p => badge(...stReceber(p)) }
  ],
  fields: [
    { k: 'data', label: 'Data', type: 'date', req: 1 },
    { k: 'clienteId', label: 'Cliente', type: 'select', req: 1, options: () => S.empresas.map(e => [e.id, e.nome]) },
    { k: 'lote', label: 'Lote', req: 1, ph: '25GX5587HR' }, { k: 'vaga', label: 'Vaga', type: 'number' },
    { k: 'motoristaId', label: 'Motorista', type: 'select', req: 1, options: () => S.motoristas.map(m => [m.id, m.nome + ' (' + m.tipo + ')']) },
    { k: 'placa', label: 'Placa', type: 'select', req: 1, options: () => S.veiculos.map(x => x.placa) },
    { k: 'valorViagem', label: 'Valor da viagem (cliente)', type: 'number', req: 1 }, { k: 'valorMotorista', label: 'Valor da viagem (motorista)', type: 'number', req: 1 },
    { k: 'qtdPrevista', label: 'Viagens previstas', type: 'number', req: 1 }, { k: 'qtdViagens', label: 'Viagens realizadas', type: 'number' },
    { k: 'inicio', label: 'Início', type: 'time' }, { k: 'fim', label: 'Fim', type: 'time' },
    { k: 'status', label: 'Status', type: 'select', req: 1, options: ['Programada', 'Em andamento', 'Finalizada'] },
    { k: 'ocorrencia', label: 'Houve ocorrência?', type: 'checkbox' }, { k: 'valorOcorrencia', label: 'Valor da ocorrência (desconto)', type: 'number' }
  ],
  defaults: () => ({ tipo, data: ymd(new Date()), status: 'Programada', qtdViagens: 0, valorOcorrencia: 0 }),
  onChange: (v, n) => n === 'motoristaId' ? { placa: (S.veiculos.find(x => x.proprietario === nome('motoristas', v.motoristaId)) || {}).placa || '' } : {},
  beforeSave: o => { o.tipo = tipo; if (o.status === 'Finalizada' && !o.qtdViagens) o.qtdViagens = o.qtdPrevista; },
  log: (o, n) => `${n ? 'Nova programação' : 'Programação atualizada'}: lote ${o.lote} — ${nome('motoristas', o.motoristaId)}`,
  detail: progDetail
});

const pagCfg = tipo => {
  const ok = id => { const p = by('progs', id); return p && (nome('motoristas', p.motoristaId) && (by('motoristas', p.motoristaId) || {}).tipo === tipo); };
  return {
    col: 'pagamentos', title: tipo === 'Próprio' ? 'Pagamento de motoristas' : 'Pagamento de terceiros', newLabel: 'Pagamento',
    desc: 'Cada pagamento atualiza automaticamente o status “A pagar” da programação e o Dashboard.',
    rows: () => S.pagamentos.filter(g => ok(g.progId)).sort((a, b) => b.data.localeCompare(a.data)),
    summary: rs => [['Pagamentos', rs.length], ['Total pago (líquido)', brl(rs.reduce((s, g) => s + pgTotal(g), 0)), 'g'], ['Vales adiantados', brl(rs.reduce((s, g) => s + g.vale, 0)), 'a']],
    cols: [
      { label: 'Data de pagamento', render: g => fdate(g.data) },
      { label: 'Motorista', render: g => esc(nome('motoristas', (by('progs', g.progId) || {}).motoristaId)) },
      { label: 'Lote', render: g => esc((by('progs', g.progId) || {}).lote) },
      { label: 'Qtd viagens', k: 'qtd' }, { label: 'Valor da viagem', r: 1, render: g => brl(g.valorViagem) },
      { label: 'Vale', r: 1, render: g => brl(g.vale) }, { label: 'Total pago', r: 1, render: g => `<b>${brl(pgTotal(g))}</b>` }, { label: 'Forma', k: 'forma' }
    ],
    fields: [
      { k: 'progId', label: 'Programação (lote)', type: 'select', req: 1, full: 1, options: () => S.progs.filter(p => ok(p.id) && p.qtdViagens > 0).map(p => [p.id, progLabel(p)]) },
      { k: 'data', label: 'Data de pagamento', type: 'date', req: 1 }, { k: 'forma', label: 'Forma de pagamento', type: 'select', req: 1, options: ['PIX', 'TED', 'Dinheiro'] },
      { k: 'qtd', label: 'Qtd de viagens', type: 'number', req: 1 }, { k: 'valorViagem', label: 'Valor da viagem', type: 'number', req: 1 }, { k: 'vale', label: 'Vale (desconto)', type: 'number' }
    ],
    defaults: () => ({ data: ymd(new Date()), forma: 'PIX', vale: 0 }),
    onChange: (v, n) => { if (n !== 'progId') return {}; const p = by('progs', v.progId); return p ? { qtd: p.qtdViagens, valorViagem: p.valorMotorista } : {}; },
    log: (o, n) => `Pagamento lançado: ${nome('motoristas', (by('progs', o.progId) || {}).motoristaId)} — ${brl(pgTotal(o))}`
  };
};

const abastCfg = {
  col: 'abastecimentos', title: 'Abastecimentos', newLabel: 'Abastecimento', desc: 'Controle de combustível por veículo.',
  rows: () => [...S.abastecimentos].sort((a, b) => b.data.localeCompare(a.data)),
  summary: rs => { const l = rs.reduce((s, a) => s + a.litros, 0), v = rs.reduce((s, a) => s + a.valorTotal, 0); return [['Abastecimentos', rs.length], ['Total em litros', num(l) + ' L', 'a'], ['Valor total', brl(v), 'r'], ['Preço médio/L', brl(l ? v / l : 0), 'n']]; },
  cols: [{ label: 'Data de abastecimento', render: a => fdate(a.data) }, { label: 'Placa', k: 'placa' }, { label: 'Local', k: 'local' }, { label: 'Litros', r: 1, render: a => num(a.litros) }, { label: 'Valor total', r: 1, render: a => brl(a.valorTotal) }, { label: 'R$/L', r: 1, render: a => brl(a.litros ? a.valorTotal / a.litros : 0) }],
  fields: [{ k: 'data', label: 'Data', type: 'date', req: 1 }, { k: 'placa', label: 'Placa', type: 'select', req: 1, options: () => S.veiculos.map(v => v.placa) }, { k: 'litros', label: 'Litros', type: 'number', req: 1 }, { k: 'valorTotal', label: 'Valor total', type: 'number', req: 1 }, { k: 'local', label: 'Local de abastecimento', full: 1, req: 1 }],
  defaults: () => ({ data: ymd(new Date()) }),
  log: o => `Abastecimento: ${o.placa} — ${brl(o.valorTotal)}`
};

const recCfg = {
  col: 'recebimentos', title: "RPA's — A receber", newLabel: 'Recebimento', desc: 'Controle dos valores a receber dos clientes por lote.',
  rows: () => [...S.recebimentos].sort((a, b) => b.data.localeCompare(a.data)),
  summary: rs => [['Recebido', brl(rs.filter(g => g.status === 'Recebido').reduce((s, g) => s + g.valor, 0)), 'g'], ['Em aberto', brl(rs.filter(g => g.status !== 'Recebido').reduce((s, g) => s + g.valor, 0)), 'a'], ['Lançamentos', rs.length]],
  cols: [{ label: 'Data que recebeu', render: g => fdate(g.data) }, { label: 'Lote', render: g => esc((by('progs', g.progId) || {}).lote) }, { label: 'Cliente', render: g => esc(nome('empresas', (by('progs', g.progId) || {}).clienteId)) }, { label: 'Valor', r: 1, render: g => brl(g.valor) }, { label: 'Forma', k: 'forma' }, { label: 'Status', render: g => badge(g.status.toUpperCase(), g.status === 'Recebido' ? 'ok' : 'wait') }],
  fields: [
    { k: 'progId', label: 'Programação (lote)', type: 'select', req: 1, full: 1, options: () => S.progs.filter(p => p.qtdViagens > 0).map(p => [p.id, progLabel(p)]) },
    { k: 'data', label: 'Data', type: 'date', req: 1 }, { k: 'valor', label: 'Valor', type: 'number', req: 1 },
    { k: 'forma', label: 'Forma de pagamento', type: 'select', req: 1, options: ['Boleto', 'TED', 'PIX'] }, { k: 'status', label: 'Status', type: 'select', req: 1, options: ['Pendente', 'Recebido'] }
  ],
  defaults: () => ({ data: ymd(new Date()), status: 'Recebido', forma: 'TED' }),
  onChange: (v, n) => { if (n !== 'progId') return {}; const p = by('progs', v.progId); return p ? { valor: total(p) } : {}; },
  log: o => `Recebimento ${o.status === 'Recebido' ? 'confirmado' : 'registrado'}: ${(by('progs', o.progId) || {}).lote} — ${brl(o.valor)}`
};

const cadastros = {
  motoristas: { col: 'motoristas', title: 'Cadastro de motoristas', newLabel: 'Motorista', cols: [{ label: 'Nome', k: 'nome' }, { label: 'CPF', k: 'cpf' }, { label: 'Telefone', k: 'telefone' }, { label: 'CNH', k: 'cnh' }, { label: 'Tipo', render: m => badge(m.tipo, m.tipo === 'Próprio' ? 'run' : 'wait') }, { label: 'Status', render: m => badge(m.status, m.status === 'Ativo' ? 'ok' : 'no') }], fields: [{ k: 'nome', label: 'Nome completo', req: 1, full: 1 }, { k: 'cpf', label: 'CPF', req: 1 }, { k: 'telefone', label: 'Telefone' }, { k: 'cnh', label: 'Categoria CNH', type: 'select', options: ['C', 'D', 'E'] }, { k: 'tipo', label: 'Tipo', type: 'select', req: 1, options: ['Próprio', 'Terceiro'] }, { k: 'status', label: 'Status', type: 'select', req: 1, options: ['Ativo', 'Inativo'] }], defaults: () => ({ tipo: 'Próprio', status: 'Ativo', cnh: 'E' }), log: (o, n) => `${n ? 'Motorista cadastrado' : 'Motorista atualizado'}: ${o.nome}` },
  veiculos: { col: 'veiculos', title: 'Cadastro de veículos', newLabel: 'Veículo', cols: [{ label: 'Placa', k: 'placa' }, { label: 'Modelo', k: 'modelo' }, { label: 'Tipo', k: 'tipo' }, { label: 'Proprietário', k: 'proprietario' }], fields: [{ k: 'placa', label: 'Placa', req: 1 }, { k: 'modelo', label: 'Modelo', req: 1 }, { k: 'tipo', label: 'Tipo', type: 'select', options: ['Cavalo mecânico', 'Carreta', 'Truck', 'VUC'] }, { k: 'proprietario', label: 'Proprietário' }], log: (o, n) => `${n ? 'Veículo cadastrado' : 'Veículo atualizado'}: ${o.placa}` },
  empresas: { col: 'empresas', title: 'Cadastro de empresas (clientes)', newLabel: 'Empresa', cols: [{ label: 'Empresa', k: 'nome' }, { label: 'CNPJ', k: 'cnpj' }, { label: 'Contato', k: 'contato' }], fields: [{ k: 'nome', label: 'Razão / nome fantasia', req: 1, full: 1 }, { k: 'cnpj', label: 'CNPJ' }, { k: 'contato', label: 'Contato' }], log: (o, n) => `${n ? 'Empresa cadastrada' : 'Empresa atualizada'}: ${o.nome}` },
  usuarios: { col: 'usuarios', title: 'Cadastro de usuários', newLabel: 'Usuário', cols: [{ label: 'Nome', k: 'nome' }, { label: 'E-mail', k: 'email' }, { label: 'Perfil', render: u => badge(u.perfil, 'run') }], fields: [{ k: 'nome', label: 'Nome', req: 1, full: 1 }, { k: 'email', label: 'E-mail', type: 'email', req: 1 }, { k: 'perfil', label: 'Perfil', type: 'select', req: 1, options: ['Administrador', 'Financeiro', 'Operação'] }], log: (o, n) => `${n ? 'Usuário cadastrado' : 'Usuário atualizado'}: ${o.nome}` }
};

/* ---------------- Dashboard ---------------- */
const dotCls = i => ({ '🏁': 'g', '💰': 'g', '✅': 'g', '💸': 'a', '⛽': 'a', '🧾': 'a', '🗑️': 'r' }[i] || 'n');
function clock() {
  const d = new Date();
  const t = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const dt = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  [['#clkTime', t], ['#clkDate', dt], ['#tvClock', t], ['#tvDate', dt]].forEach(([s, v]) => { const el = $(s); if (el) el.textContent = v; });
}
let charts = [], lastKpi = {};
const PKEY = 'serafini_periodo';
let per = (() => { try { return localStorage.getItem(PKEY) || '30'; } catch (e) { return '30'; } })();
const PERIODS = [['1', 'Hoje'], ['7', '7 dias'], ['30', '30 dias'], ['all', 'Tudo']];
const perLabel = p => ({ '1': 'hoje', '7': 'últimos 7 dias', '30': 'últimos 30 dias', all: 'todo o período' }[p]);
const sinceOf = p => { if (p === 'all') return ''; const d = new Date(); d.setDate(d.getDate() - (+p - 1)); return ymd(d); };
const sumBy = (a, f) => a.reduce((s, x) => s + f(x), 0);
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const daysOpen = d => Math.max(0, Math.round((new Date(ymd(new Date())) - new Date(d)) / 864e5));
const kshort = v => Math.abs(v) >= 1000 ? 'R$ ' + num(Math.round(v / 100) / 10) + ' mil' : 'R$ ' + num(v);

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
function pendencias(P) {
  const out = [];
  P.filter(p => p.status === 'Finalizada').forEach(p => {
    if (stReceber(p)[0] !== 'Recebido') out.push({ tipo: 'Receber', p, quem: nome('empresas', p.clienteId), valor: total(p) - recProg(p.id), dias: daysOpen(p.data) });
    if (stPagar(p)[0] !== 'Pago') out.push({ tipo: 'Pagar', p, quem: nome('motoristas', p.motoristaId), valor: Math.max(0, custo(p) - pagoProg(p.id)), dias: daysOpen(p.data) });
  });
  return out.filter(x => x.valor > 0).sort((a, b) => b.dias - a.dias);
}
function serie(p) {
  const first = S.progs.reduce((m, x) => x.data < m ? x.data : m, ymd(new Date()));
  const n = p === 'all' ? daysOpen(first) + 1 : Math.max(14, +p);
  const days = [];
  for (let i = n - 1; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(ymd(d)); }
  return { days, prod: days.map(d => sumBy(S.progs.filter(x => x.data === d), total)), cust: days.map(d => sumBy(S.progs.filter(x => x.data === d), custo)) };
}

/* blocos reutilizados no Dashboard e no Modo TV */
const flash = (id, v) => lastKpi[id] !== undefined && lastKpi[id] !== v ? 'flash' : '';
const meter = v => `<div class="meter"><i style="width:${Math.max(0, Math.min(100, v))}%"></i></div>`;
function kpiBig(m) {
  return `
    <div class="kpi kbig ${flash('produzido', m.produzido)}"><small>Faturamento</small><b>${brl(m.produzido)}</b><i>${num(m.viagens)} viagens · ticket médio ${brl(m.ticket)}</i></div>
    <div class="kpi kbig ${flash('recebido', m.recebido)}"><small>Recebido</small><b>${brl(m.recebido)}</b><i>${pct(m.recebido, m.produzido)}% do faturamento</i>${meter(pct(m.recebido, m.produzido))}</div>
    <div class="kpi kbig ${flash('aReceber', m.aReceber)}"><small>A receber</small><b>${brl(m.aReceber)}</b><i>${m.pendRec.length} lote(s) finalizado(s) em aberto</i></div>
    <div class="kpi kbig ${flash('margem', m.margem)}"><small>Margem operacional</small><b class="${m.margem < 0 ? 'neg' : ''}">${brl(m.margem)}</b><i>${m.margemPct}% · faturamento − motoristas − combustível</i>${meter(m.margemPct)}</div>`;
}
function kpiMini(m) {
  return `
    <div class="mini"><span>Em andamento</span><b>${m.ativas.length}</b><em>operações agora</em></div>
    <div class="mini"><span>Programadas</span><b>${m.programadas.length}</b><em>aguardando início</em></div>
    <div class="mini"><span>A pagar motoristas</span><b>${brl(m.aPagar)}</b><em>inclui operações em andamento</em></div>
    <div class="mini"><span>Combustível</span><b>${brl(m.comb)}</b><em>${num(m.litros)} litros</em></div>`;
}
function stackHtml(m) {
  const row = (t, a, la, b, lb) => {
    const tot = a + b, pa = tot ? a / tot * 100 : 0;
    return `<div class="stack-row"><div class="stack-h"><b>${t}</b><span>${brl(tot)}</span></div>
      <div class="stack"><i class="s-a" style="width:${pa}%"></i><i class="s-b" style="width:${100 - pa}%"></i></div>
      <div class="stack-l"><span><i class="s-a"></i>${la} <b>${brl(a)}</b></span><span><i class="s-b"></i>${lb} <b>${brl(b)}</b></span></div></div>`;
  };
  return row('Clientes', m.recebido, 'Recebido', m.aReceber, 'A receber') + row('Motoristas e terceiros', m.pago, 'Pago', m.aPagar, 'A pagar');
}
function pendHtml(list, n, tv) {
  if (!list.length) return '<div class="empty">Nenhuma pendência no período</div>';
  return `<table class="tbl-min"><thead><tr>${tv ? '' : '<th>Tipo</th>'}<th>Lote</th><th>${tv ? (list[0].tipo === 'Receber' ? 'Cliente' : 'Motorista') : 'Cliente / motorista'}</th><th class="r">Valor</th><th class="r">Em aberto</th></tr></thead><tbody>${list.slice(0, n).map(x => `<tr>${tv ? '' : `<td>${badge(x.tipo === 'Receber' ? 'A receber' : 'A pagar', x.tipo === 'Receber' ? 'run' : 'wait')}</td>`}<td>${esc(x.p.lote)}</td><td>${esc(x.quem)}</td><td class="r">${brl(x.valor)}</td><td class="r ${x.dias > 15 ? 'late' : ''}">${x.dias} dia${x.dias === 1 ? '' : 's'}</td></tr>`).join('')}</tbody></table>`;
}
function opsHtml(n) {
  const a = [...S.progs.filter(p => p.status === 'Em andamento'), ...S.progs.filter(p => p.status === 'Programada')].slice(0, n);
  if (!a.length) return '<div class="empty">Nenhuma operação em andamento</div>';
  return a.map(p => {
    const pc = pct(p.qtdViagens, p.qtdPrevista);
    return `<div class="op"><div class="op-h"><b>${esc(nome('motoristas', p.motoristaId))}</b>${badge(p.status, stProg(p.status))}</div>
      <div class="op-s">${esc(nome('empresas', p.clienteId))} · Lote ${esc(p.lote)} · ${esc(p.placa)}</div>
      ${meter(pc)}<div class="op-f"><span>${p.qtdViagens} de ${p.qtdPrevista} viagens (${pc}%)</span><span>${brl(total(p))}</span></div></div>`;
  }).join('');
}
function clientesHtml(P) {
  const tot = sumBy(P, total) || 1;
  const r = S.empresas.map(e => [e.nome, sumBy(P.filter(p => p.clienteId === e.id), total)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);
  if (!r.length) return '<div class="empty">Sem faturamento no período</div>';
  return r.map(([n, v]) => `<div class="hb"><div class="hb-h"><span>${esc(n)}</span><b>${brl(v)}</b></div>${meter(v / tot * 100)}<small>${pct(v, tot)}% do faturamento</small></div>`).join('');
}
function rankHtml(P) {
  const m = {};
  P.forEach(p => { m[p.motoristaId] = m[p.motoristaId] || { v: 0, t: 0 }; m[p.motoristaId].v += total(p); m[p.motoristaId].t += p.qtdViagens; });
  const r = Object.entries(m).filter(e => e[1].v > 0).sort((a, b) => b[1].v - a[1].v).slice(0, 5);
  if (!r.length) return '<div class="empty">Sem produção no período</div>';
  const mx = r[0][1].v;
  return r.map(([id, o], i) => `<div class="row"><div class="n">${i + 1}</div><div><div class="hb-h"><span>${esc(nome('motoristas', id))}</span><b>${brl(o.v)}</b></div>${meter(o.v / mx * 100)}<small>${num(o.t)} viagens</small></div></div>`).join('');
}

function dashboard() {
  const m = metrics(per);
  const st = ['Programada', 'Em andamento', 'Finalizada'], stc = ['#c9d5ee', '#4f7fd9', '#0b2a6b'];
  const stn = st.map(s => m.P.filter(p => p.status === s).length);
  $('#app').innerHTML = `
    <div class="head dhead"><div><div class="crumb">Serafini Transportes › Visão geral</div><h1>Dashboard</h1>
      <p class="sub-h"><span class="pulse"></span><span class="tag-live">Tempo real</span> &nbsp;·&nbsp; Período: ${perLabel(per)} &nbsp;·&nbsp; atualizado às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p></div>
      <div class="tools"><div class="seg">${PERIODS.map(([v, l]) => `<button data-p="${v}" class="${v === per ? 'on' : ''}">${l}</button>`).join('')}</div>
      <button class="btn" id="btnTv">Modo TV</button></div></div>
    <div class="kpis">${kpiBig(m)}</div>
    <div class="minis">${kpiMini(m)}</div>
    <div class="grid g2">
      <div class="card"><h3>Faturamento × custo com motoristas — por dia</h3><div class="chartbox"><canvas id="c1"></canvas></div></div>
      <div class="card"><h3>Status das programações</h3><div class="donut"><div class="chartbox sm"><canvas id="c2"></canvas><div class="donut-c"><b>${m.P.length}</b><span>programações</span></div></div>
        <ul class="leg">${st.map((s, i) => `<li><i style="background:${stc[i]}"></i>${s}<b>${stn[i]}</b></li>`).join('')}</ul></div></div>
    </div>
    <div class="grid g12">
      <div class="card"><h3>Fluxo financeiro</h3>${stackHtml(m)}</div>
      <div class="card"><h3>Pendências financeiras <span class="h-note">lotes finalizados aguardando pagamento ou recebimento</span></h3>${pendHtml(m.pend, 6)}</div>
    </div>
    <div class="grid g3">
      <div class="card"><h3>Operações em andamento</h3>${opsHtml(4)}</div>
      <div class="card"><h3>Faturamento por cliente</h3>${clientesHtml(m.P)}</div>
      <div class="card"><h3>Ranking de motoristas</h3><div class="rank">${rankHtml(m.P)}</div></div>
    </div>
    <div class="card"><h3>Atividade recente</h3><ul class="feed cols">${S.log.slice(0, 8).map(l => `<li><span class="dot ${dotCls(l.icon)}"></span><div>${esc(l.msg)}<small>${new Date(l.t).toLocaleTimeString('pt-BR')}</small></div></li>`).join('')}</ul></div>`;
  lastKpi = { produzido: m.produzido, recebido: m.recebido, aReceber: m.aReceber, margem: m.margem };
  document.querySelectorAll('.seg [data-p]').forEach(b => b.onclick = () => { per = b.dataset.p; try { localStorage.setItem(PKEY, per); } catch (e) {} render(); });
  $('#btnTv').onclick = tvEnter;
  drawCharts(m, stn, stc);
}
function chartBase(dark) {
  const tick = dark ? '#c5d3f0' : '#667189', grid = dark ? '#ffffff1a' : '#e6ebf3';
  return { maintainAspectRatio: false, animation: { duration: 500 }, plugins: { legend: { position: 'bottom', labels: { color: tick, boxWidth: 12, font: { size: dark ? 15 : 12 } } }, tooltip: { callbacks: { label: c => ' ' + c.dataset.label + ': ' + brl(c.parsed.y) } } },
    scales: { x: { grid: { display: false }, ticks: { color: tick, maxRotation: 0, autoSkipPadding: 14, font: { size: dark ? 14 : 11 } } }, y: { grid: { color: grid }, border: { display: false }, ticks: { color: tick, font: { size: dark ? 14 : 11 }, callback: kshort } } } };
}
function dailyChart(el, dark) {
  const s = serie(per);
  return new Chart(el, { data: { labels: s.days.map(d => fdate(d).slice(0, 5)), datasets: [
    { type: 'bar', label: 'Faturamento', data: s.prod, backgroundColor: dark ? '#6f9bff' : '#0b2a6b', maxBarThickness: 34 },
    { type: 'bar', label: 'Custo com motoristas', data: s.cust, backgroundColor: dark ? '#3dbb55' : '#9fb6e6', maxBarThickness: 34 }] }, options: chartBase(dark) });
}
function drawCharts(m, stn, stc) {
  charts.forEach(c => c.destroy()); charts = [];
  if (typeof Chart === 'undefined') return;
  Chart.defaults.font.family = '"Segoe UI", Roboto, Arial, sans-serif';
  charts.push(dailyChart($('#c1'), false));
  charts.push(new Chart($('#c2'), { type: 'doughnut', data: { labels: ['Programada', 'Em andamento', 'Finalizada'], datasets: [{ data: stn, backgroundColor: stc, borderWidth: 2, borderColor: '#fff' }] }, options: { maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } } }));
}

/* ---------------- Modo TV ---------------- */
const TV_MS = 12000;
let tvTimer = null, tvIdx = 0, tvT0 = 0, tvChart = null;
const tvSlides = [
  ['Resumo financeiro', m => `<div class="kpis">${kpiBig(m)}</div><div class="minis">${kpiMini(m)}</div><div class="card">${stackHtml(m)}</div>`],
  ['Operações em andamento', () => `<div class="ops-grid">${opsHtml(8)}</div>`],
  ['Faturamento diário', () => `<div class="card"><div class="chartbox xl"><canvas id="tvc1"></canvas></div></div>`],
  ['Clientes e motoristas', m => `<div class="grid g11"><div class="card"><h3>Faturamento por cliente</h3>${clientesHtml(m.P)}</div><div class="card"><h3>Ranking de motoristas</h3><div class="rank">${rankHtml(m.P)}</div></div></div>`],
  ['Pendências financeiras', m => `<div class="grid g11"><div class="card"><h3>A receber de clientes · ${brl(sumBy(m.pendRec, x => x.valor))}</h3>${pendHtml(m.pendRec, 7, 1)}</div><div class="card"><h3>A pagar a motoristas · ${brl(sumBy(m.pendPag, x => x.valor))}</h3>${pendHtml(m.pendPag, 7, 1)}</div></div>`]
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
      <div class="tv-top"><div class="brand"><img src="logo.svg" alt=""><div class="wm"><b>SERAFINI</b><span>TRANSPORTES</span></div></div>
        <div class="tv-title"><small>Painel operacional · ${perLabel(per)}</small><b id="tvTitle"></b></div>
        <div class="tv-clock"><b id="tvClock"></b><span id="tvDate"></span></div></div>
      <div class="tv-body" id="tvBody"></div>
      <div class="tv-foot"><div class="tv-dots" id="tvDots"></div><div class="tv-live"><span class="pulse"></span>Atualização em tempo real</div><button class="btn ghost sm" id="tvExit">Sair do modo TV</button></div>
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
  $('#tvDots').innerHTML = tvSlides.map((s, i) => `<i class="${i === tvIdx ? 'on' : ''}" data-i="${i}"></i>`).join('');
  $('#tvDots').querySelectorAll('i').forEach(d => d.onclick = () => { tvIdx = +d.dataset.i; tvT0 = Date.now(); tvShow(true); });
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
  if (!document.body.classList.contains('tv')) return;
  if (e.key === 'Escape') tvExit();
  if (e.key === 'ArrowRight') tvGo(1);
  if (e.key === 'ArrowLeft') tvGo(-1);
});

/* ---------------- Roteamento ---------------- */
const routes = {
  dashboard, tv, escala: () => crud(progCfg('escala')), servico: () => crud(progCfg('servico')),
  'pag-motorista': () => crud(pagCfg('Próprio')), 'pag-terceiros': () => crud(pagCfg('Terceiro')),
  abastecimentos: () => crud(abastCfg), rpas: () => crud(recCfg),
  motoristas: () => crud(cadastros.motoristas), veiculos: () => crud(cadastros.veiculos), empresas: () => crud(cadastros.empresas), usuarios: () => crud(cadastros.usuarios)
};
function render(fromChange) {
  if (modalOpen) { pendingRender = true; return; }
  const r = (location.hash.replace('#/', '') || 'dashboard');
  const route = routes[r] ? r : 'dashboard';
  if (route !== 'tv' && (tvTimer || document.body.classList.contains('tv'))) tvStop();
  document.querySelectorAll('.menu a').forEach(a => a.classList.toggle('on', a.dataset.r === route));
  document.querySelectorAll('.mi').forEach(m => m.classList.toggle('active', !!m.querySelector('a.on')));
  const q = $('#q'), qv = fromChange && q ? q.value : '';
  routes[route]();
  if (qv && $('#q')) { $('#q').value = qv; $('#q').dispatchEvent(new Event('input')); }
}
window.addEventListener('hashchange', () => render());

/* ---------------- Modo ao vivo (simulação para apresentação) ---------------- */
let timer = null;
function tick() {
  const open = S.progs.filter(p => p.status !== 'Finalizada');
  const roll = Math.random();
  if (roll < .45 && open.length) {
    const p = pick(open); const m = nome('motoristas', p.motoristaId);
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
    const v = pick(S.veiculos), l = rnd(180, 400);
    S.abastecimentos.push({ id: uid(), data: ymd(new Date()), placa: v.placa, litros: l, valorTotal: Math.round(l * (5.9 + Math.random() * .5) * 100) / 100, local: pick(['Posto Ipiranga BR-116', 'Shell Rodovia Anchieta', 'Petrobras Cubatão']) });
    return save(`Abastecimento registrado: ${v.placa} — ${l} L`, '⛽');
  }
  const m = pick(S.motoristas), c = pick(S.empresas), v = pick(S.veiculos), vv = pick([150, 180, 210, 240]);
  S.progs.push({ id: uid(), tipo: pick(['escala', 'servico']), data: ymd(new Date()), clienteId: c.id, lote: `25GX${rnd(1000, 9999)}HR`, vaga: rnd(10, 99), motoristaId: m.id, placa: v.placa, valorViagem: vv, valorMotorista: Math.round(vv * .39), qtdPrevista: rnd(8, 24), qtdViagens: 0, inicio: '06:00', fim: '', status: 'Programada', ocorrencia: false, valorOcorrencia: 0 });
  save(`Nova programação: ${m.nome} → ${c.nome}`, '🗓️');
}
function toggleLive() {
  const b = $('#btnLive');
  if (timer) { clearInterval(timer); timer = null; b.textContent = 'Simulação ao vivo'; b.classList.remove('on'); return; }
  b.textContent = 'Parar simulação'; b.classList.add('on'); tick(); timer = setInterval(tick, 3500);
}

/* ---------------- Início ---------------- */
S = load() || seed();
clock(); setInterval(clock, 15000);
$('#btnLive').onclick = toggleLive;
$('#btnReset').onclick = () => { if (!confirm('Restaurar os dados fictícios originais?')) return; S = seed(); save('Dados de demonstração restaurados', '↺'); };
render();
})();
