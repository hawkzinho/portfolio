const DEMO_STORAGE_KEY = 'autogest_demo_v1';

function demoNowIso() {
  return new Date().toISOString();
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

const DEMO_SEED = {
  carros: [
    {
      id: 'car_1',
      tipo: 'carro',
      modelo: 'Honda Civic EXL',
      placa: 'DMO-1A23',
      cor: 'Preto',
      ano: 2020,
      quilometragem: 48210,
      data_compra: '2026-01-10',
      data_venda: '2026-03-08',
      valor_compra: 78000,
      valor_venda: 89900,
      status: 'vendido',
      observacoes: 'Veículo com histórico de revisões e excelente estado geral.',
      flags: {
        nota_entrada: true,
        vistoria_entrada: true,
        atpv_reconhecida: true,
        renave: true,
        envio_despachante: true,
        pagamento_taxa: true,
      },
      created_at: '2026-01-10T09:00:00.000Z',
    },
    {
      id: 'car_2',
      tipo: 'carro',
      modelo: 'Toyota Corolla XEi',
      placa: 'DMO-4B57',
      cor: 'Prata',
      ano: 2021,
      quilometragem: 36120,
      data_compra: '2026-02-01',
      data_venda: null,
      valor_compra: 92000,
      valor_venda: 104900,
      status: 'disponivel',
      observacoes: 'Veículo com multimídia, bancos em couro e revisões em dia.',
      flags: {
        nota_entrada: true,
        vistoria_entrada: true,
        atpv_reconhecida: false,
        renave: false,
        envio_despachante: false,
        pagamento_taxa: false,
      },
      created_at: '2026-02-01T10:00:00.000Z',
    },
    {
      id: 'car_3',
      tipo: 'carro',
      modelo: 'Chevrolet Onix LT',
      placa: 'DMO-7C88',
      cor: 'Branco',
      ano: 2023,
      quilometragem: 14980,
      data_compra: '2026-02-18',
      data_venda: null,
      valor_compra: 57500,
      valor_venda: 63900,
      status: 'disponivel',
      observacoes: 'Excelente para giro rápido, baixa quilometragem.',
      flags: {
        nota_entrada: true,
        vistoria_entrada: true,
        atpv_reconhecida: true,
        renave: false,
        envio_despachante: false,
        pagamento_taxa: false,
      },
      created_at: '2026-02-18T14:30:00.000Z',
    },
    {
      id: 'car_4',
      tipo: 'carro',
      modelo: 'Volkswagen T-Cross Comfortline',
      placa: 'DMO-9D41',
      cor: 'Cinza',
      ano: 2021,
      quilometragem: 41700,
      data_compra: '2026-01-22',
      data_venda: '2026-03-18',
      valor_compra: 102000,
      valor_venda: 112900,
      status: 'repasse',
      observacoes: 'SUV muito procurado, com ótima margem para revenda.',
      flags: {
        nota_entrada: true,
        vistoria_entrada: true,
        atpv_reconhecida: true,
        renave: true,
        envio_despachante: true,
        pagamento_taxa: true,
      },
      created_at: '2026-01-22T11:15:00.000Z',
    },
    {
      id: 'car_5',
      tipo: 'carro',
      modelo: 'Volkswagen Saveiro Robust',
      placa: 'DMO-2E90',
      cor: 'Branca',
      ano: 2020,
      quilometragem: 63800,
      data_compra: '2026-02-05',
      data_venda: null,
      valor_compra: 68900,
      valor_venda: 78900,
      status: 'disponivel',
      observacoes: 'Utilitário com boa procura local e ótima liquidez.',
      flags: {
        nota_entrada: true,
        vistoria_entrada: false,
        atpv_reconhecida: false,
        renave: false,
        envio_despachante: false,
        pagamento_taxa: false,
      },
      created_at: '2026-02-05T09:40:00.000Z',
    },
    {
      id: 'car_6',
      tipo: 'moto',
      modelo: 'Honda CG 160 Titan',
      placa: 'DMO-3F22',
      cor: 'Vermelha',
      ano: 2024,
      quilometragem: 3200,
      data_compra: '2026-03-03',
      data_venda: null,
      valor_compra: 18900,
      valor_venda: 21900,
      status: 'disponivel',
      observacoes: 'Moto de giro rápido, baixa quilometragem e ótimo estado.',
      flags: {
        nota_entrada: true,
        vistoria_entrada: true,
        atpv_reconhecida: false,
        renave: false,
        envio_despachante: false,
        pagamento_taxa: false,
      },
      created_at: '2026-03-03T15:20:00.000Z',
    },
    {
      id: 'car_7',
      tipo: 'carro',
      modelo: 'Volkswagen Nivus Highline',
      placa: 'DMO-5G64',
      cor: 'Azul',
      ano: 2022,
      quilometragem: 29850,
      data_compra: '2026-01-05',
      data_venda: '2026-02-12',
      valor_compra: 104000,
      valor_venda: 118500,
      status: 'vendido',
      observacoes: 'Versão completa, com excelente acabamento interno.',
      flags: {
        nota_entrada: true,
        vistoria_entrada: true,
        atpv_reconhecida: true,
        renave: true,
        envio_despachante: true,
        pagamento_taxa: true,
      },
      created_at: '2026-01-05T08:25:00.000Z',
    },
    {
      id: 'car_8',
      tipo: 'carro',
      modelo: 'Hyundai HB20 Comfort Plus',
      placa: 'DMO-6H70',
      cor: 'Prata',
      ano: 2021,
      quilometragem: 44760,
      data_compra: '2026-03-01',
      data_venda: null,
      valor_compra: 61200,
      valor_venda: 69900,
      status: 'disponivel',
      observacoes: 'Hatch com ótima saída e histórico de manutenção organizado.',
      flags: {
        nota_entrada: true,
        vistoria_entrada: true,
        atpv_reconhecida: true,
        renave: false,
        envio_despachante: false,
        pagamento_taxa: false,
      },
      created_at: '2026-03-01T13:10:00.000Z',
    },
  ],
  despesas_carros: [
    { id: 'dc_1', carro_id: 'car_1', descricao: 'Polimento técnico', valor: 480, data: '2026-01-14', created_at: '2026-01-14T09:00:00.000Z' },
    { id: 'dc_2', carro_id: 'car_1', descricao: 'Revisão básica', valor: 920, data: '2026-02-02', created_at: '2026-02-02T10:00:00.000Z' },
    { id: 'dc_3', carro_id: 'car_2', descricao: 'Higienização interna', valor: 350, data: '2026-02-03', created_at: '2026-02-03T11:00:00.000Z' },
    { id: 'dc_4', carro_id: 'car_2', descricao: 'Troca de pneus dianteiros', valor: 1450, data: '2026-02-10', created_at: '2026-02-10T14:00:00.000Z' },
    { id: 'dc_5', carro_id: 'car_3', descricao: 'Cristalização', valor: 420, data: '2026-02-20', created_at: '2026-02-20T08:30:00.000Z' },
    { id: 'dc_6', carro_id: 'car_4', descricao: 'Preparação de pintura', valor: 890, data: '2026-01-25', created_at: '2026-01-25T16:00:00.000Z' },
    { id: 'dc_7', carro_id: 'car_4', descricao: 'Documentação e taxa', valor: 730, data: '2026-03-10', created_at: '2026-03-10T15:00:00.000Z' },
    { id: 'dc_8', carro_id: 'car_5', descricao: 'Troca de óleo', valor: 310, data: '2026-02-08', created_at: '2026-02-08T09:45:00.000Z' },
    { id: 'dc_9', carro_id: 'car_6', descricao: 'Revisão de entrega', valor: 180, data: '2026-03-05', created_at: '2026-03-05T13:15:00.000Z' },
    { id: 'dc_10', carro_id: 'car_7', descricao: 'Vistoria cautelar', valor: 250, data: '2026-01-08', created_at: '2026-01-08T10:30:00.000Z' },
    { id: 'dc_11', carro_id: 'car_7', descricao: 'Lavagem premium', valor: 160, data: '2026-02-01', created_at: '2026-02-01T09:20:00.000Z' },
    { id: 'dc_12', carro_id: 'car_8', descricao: 'Reparo de para-choque', valor: 740, data: '2026-03-06', created_at: '2026-03-06T16:10:00.000Z' },
  ],
  despesas_gerais: [
    { id: 'dg_1', descricao: 'Plano de gestão', tipo: 'sistemas', valor: 399.9, data: '2026-01-05', created_at: '2026-01-05T08:00:00.000Z' },
    { id: 'dg_2', descricao: 'Energia do escritório', tipo: 'outros', valor: 620.35, data: '2026-01-12', created_at: '2026-01-12T08:00:00.000Z' },
    { id: 'dg_3', descricao: 'Despachante de janeiro', tipo: 'documentacao', valor: 850, data: '2026-01-19', created_at: '2026-01-19T08:00:00.000Z' },
    { id: 'dg_4', descricao: 'Campanha de tráfego', tipo: 'outros', valor: 1200, data: '2026-02-03', created_at: '2026-02-03T08:00:00.000Z' },
    { id: 'dg_5', descricao: 'Aluguel comercial', tipo: 'outros', valor: 2800, data: '2026-02-08', created_at: '2026-02-08T08:00:00.000Z' },
    { id: 'dg_6', descricao: 'Taxas bancárias', tipo: 'impostos', valor: 415.44, data: '2026-02-18', created_at: '2026-02-18T08:00:00.000Z' },
    { id: 'dg_7', descricao: 'Internet e telefonia', tipo: 'sistemas', valor: 279.9, data: '2026-03-04', created_at: '2026-03-04T08:00:00.000Z' },
    { id: 'dg_8', descricao: 'Despachante de março', tipo: 'documentacao', valor: 980, data: '2026-03-09', created_at: '2026-03-09T08:00:00.000Z' },
    { id: 'dg_9', descricao: 'Pós-venda de garantia', tipo: 'pos_venda', valor: 1650, data: '2026-03-14', created_at: '2026-03-14T08:00:00.000Z' },
    { id: 'dg_10', descricao: 'Preparação do pátio', tipo: 'preparacao', valor: 1340, data: '2026-03-21', created_at: '2026-03-21T08:00:00.000Z' },
  ],
  checklist: [
    {
      id: 'cl_1',
      carro_id: 'car_1',
      obs_frente: 'Pequenos sinais de uso no para-choque dianteiro.',
      obs_tras: '',
      obs_lado_esq: 'Leve risco superficial na porta traseira esquerda.',
      obs_lado_dir: '',
      obs_geral: 'Interior muito conservado e pneus em bom estado.',
      chave_reserva: true,
      manual_fabrica: true,
      created_at: '2026-01-10T09:30:00.000Z',
      updated_at: '2026-03-08T11:00:00.000Z',
    },
    {
      id: 'cl_2',
      carro_id: 'car_2',
      obs_frente: '',
      obs_tras: 'Detalhe leve no acabamento do para-choque.',
      obs_lado_esq: '',
      obs_lado_dir: '',
      obs_geral: 'Manual presente. Necessário solicitar chave reserva ao antigo proprietário.',
      chave_reserva: false,
      manual_fabrica: true,
      created_at: '2026-02-01T10:20:00.000Z',
      updated_at: '2026-02-11T09:10:00.000Z',
    },
    {
      id: 'cl_3',
      carro_id: 'car_4',
      obs_frente: '',
      obs_tras: '',
      obs_lado_esq: '',
      obs_lado_dir: 'Risco discreto na maçaneta dianteira direita.',
      obs_geral: 'Veículo bem apresentado, pronto para repasse.',
      chave_reserva: true,
      manual_fabrica: true,
      created_at: '2026-01-23T10:00:00.000Z',
      updated_at: '2026-03-17T13:45:00.000Z',
    },
    {
      id: 'cl_4',
      carro_id: 'car_6',
      obs_frente: '',
      obs_tras: '',
      obs_lado_esq: '',
      obs_lado_dir: '',
      obs_geral: 'Moto em excelente estado geral.',
      chave_reserva: false,
      manual_fabrica: true,
      created_at: '2026-03-03T15:45:00.000Z',
      updated_at: '2026-03-03T15:45:00.000Z',
    },
  ],
};

function loadDemoStore() {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return deepClone(DEMO_SEED);
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return deepClone(DEMO_SEED);
    return {
      carros: Array.isArray(parsed.carros) ? parsed.carros : deepClone(DEMO_SEED.carros),
      despesas_carros: Array.isArray(parsed.despesas_carros) ? parsed.despesas_carros : deepClone(DEMO_SEED.despesas_carros),
      despesas_gerais: Array.isArray(parsed.despesas_gerais) ? parsed.despesas_gerais : deepClone(DEMO_SEED.despesas_gerais),
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist : deepClone(DEMO_SEED.checklist),
    };
  } catch {
    return deepClone(DEMO_SEED);
  }
}

function saveDemoStore(store) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(store));
}

function ensureDemoStore() {
  const store = loadDemoStore();
  saveDemoStore(store);
  return store;
}

function resetDemoData() {
  saveDemoStore(deepClone(DEMO_SEED));
  window.location.reload();
}

function projectColumns(rows, columns) {
  if (!columns || columns === '*' || columns === ' *') return rows;
  const fields = String(columns)
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);
  if (!fields.length) return rows;
  return rows.map(row => {
    const out = {};
    fields.forEach(field => {
      out[field] = row[field];
    });
    return out;
  });
}

class DemoQueryBuilder {
  constructor(table) {
    this.table = table;
    this.op = 'select';
    this.columns = '*';
    this.filters = [];
    this.orderRule = null;
    this.expectation = null;
    this.rows = null;
    this.values = null;
    this.options = {};
    this.returning = false;
  }

  select(columns = '*') {
    this.columns = columns;
    if (this.op !== 'select') this.returning = true;
    return this;
  }

  insert(rows) {
    this.op = 'insert';
    this.rows = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(values) {
    this.op = 'update';
    this.values = values || {};
    return this;
  }

  upsert(rows, options = {}) {
    this.op = 'upsert';
    this.rows = Array.isArray(rows) ? rows : [rows];
    this.options = options;
    return this;
  }

  delete() {
    this.op = 'delete';
    return this;
  }

  eq(field, value) {
    this.filters.push(row => row[field] === value);
    return this;
  }

  gte(field, value) {
    this.filters.push(row => (row[field] ?? null) >= value);
    return this;
  }

  lte(field, value) {
    this.filters.push(row => (row[field] ?? null) <= value);
    return this;
  }

  order(field, { ascending = true } = {}) {
    this.orderRule = { field, ascending };
    return this;
  }

  single() {
    this.expectation = 'single';
    return this;
  }

  maybeSingle() {
    this.expectation = 'maybeSingle';
    return this;
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }

  async execute() {
    try {
      const store = loadDemoStore();
      const tableRows = Array.isArray(store[this.table]) ? store[this.table] : [];
      let resultRows = [];

      const applyFilters = rows => rows.filter(row => this.filters.every(fn => fn(row)));
      const applyOrder = rows => {
        if (!this.orderRule) return rows;
        const { field, ascending } = this.orderRule;
        return [...rows].sort((a, b) => {
          const va = a[field] ?? null;
          const vb = b[field] ?? null;
          if (va === vb) return 0;
          if (va === null) return ascending ? -1 : 1;
          if (vb === null) return ascending ? 1 : -1;
          return va < vb ? (ascending ? -1 : 1) : (ascending ? 1 : -1);
        });
      };

      if (this.op === 'select') {
        resultRows = applyOrder(applyFilters(deepClone(tableRows)));
        resultRows = projectColumns(resultRows, this.columns);
      }

      if (this.op === 'insert') {
        const inserted = this.rows.map(row => {
          const next = { ...row };
          if (!next.id) next.id = makeId(this.table);
          if (!next.created_at) next.created_at = demoNowIso();
          if (this.table === 'checklist' && !next.updated_at) next.updated_at = next.created_at;
          return next;
        });
        store[this.table] = [...tableRows, ...inserted];
        saveDemoStore(store);
        resultRows = deepClone(inserted);
      }

      if (this.op === 'update') {
        const updated = [];
        store[this.table] = tableRows.map(row => {
          if (!this.filters.every(fn => fn(row))) return row;
          const next = { ...row, ...this.values };
          if (this.table === 'checklist' && !('updated_at' in this.values)) next.updated_at = demoNowIso();
          updated.push(deepClone(next));
          return next;
        });
        saveDemoStore(store);
        resultRows = updated;
      }

      if (this.op === 'delete') {
        const removed = [];
        store[this.table] = tableRows.filter(row => {
          const match = this.filters.every(fn => fn(row));
          if (match) removed.push(deepClone(row));
          return !match;
        });
        if (this.table === 'carros') {
          const removedIds = new Set(removed.map(row => row.id));
          store.despesas_carros = store.despesas_carros.filter(row => !removedIds.has(row.carro_id));
          store.checklist = store.checklist.filter(row => !removedIds.has(row.carro_id));
        }
        saveDemoStore(store);
        resultRows = removed;
      }

      if (this.op === 'upsert') {
        const conflictField = this.options.onConflict || 'id';
        const out = [];
        const rowsCopy = [...tableRows];
        this.rows.forEach(row => {
          const idx = rowsCopy.findIndex(item => item[conflictField] === row[conflictField]);
          if (idx >= 0) {
            const current = rowsCopy[idx];
            const next = {
              ...current,
              ...row,
              id: current.id,
              created_at: current.created_at || row.created_at || demoNowIso(),
              updated_at: row.updated_at || demoNowIso(),
            };
            rowsCopy[idx] = next;
            out.push(deepClone(next));
          } else {
            const next = {
              ...row,
              id: row.id || makeId(this.table),
              created_at: row.created_at || demoNowIso(),
            };
            if (this.table === 'checklist') next.updated_at = row.updated_at || demoNowIso();
            rowsCopy.push(next);
            out.push(deepClone(next));
          }
        });
        store[this.table] = rowsCopy;
        saveDemoStore(store);
        resultRows = out;
      }

      if ((this.op === 'insert' || this.op === 'update' || this.op === 'upsert') && this.returning) {
        resultRows = projectColumns(resultRows, this.columns);
      }

      if (this.expectation === 'single') {
        if (resultRows.length !== 1) {
          return { data: null, error: { message: 'Expected a single row' } };
        }
        return { data: resultRows[0], error: null };
      }

      if (this.expectation === 'maybeSingle') {
        if (resultRows.length > 1) {
          return { data: null, error: { message: 'Expected zero or one row' } };
        }
        return { data: resultRows[0] || null, error: null };
      }

      return { data: resultRows, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Erro interno da demo' } };
    }
  }
}

const db = {
  from(table) {
    return new DemoQueryBuilder(table);
  },
};

ensureDemoStore();
window.db = db;
window.resetDemoData = resetDemoData;
window.__DEMO_MODE__ = true;
