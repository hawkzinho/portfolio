const PRICES = {
    'Frango': 60.0,
    'Tropeiro P': 20.0,
    'Tropeiro M': 30.0,
    'Tropeiro G': 60.0,
    'Salpicão P': 25.0,
    'Salpicão M': 37.0,
    'Salpicão G': 75.0,
    'Suco P': 15.0,
    'Suco G': 20.0,
    'Costela': 70.0
};

const PESO_POR_UNIDADE = {
    'Tropeiro P': 0.3,
    'Tropeiro M': 0.5,
    'Tropeiro G': 1.0,
    'Salpicão P': 0.3,
    'Salpicão M': 0.5,
    'Salpicão G': 1.0,
};


// Máscara de dinheiro: digita centavos da direita: 2000 -> 20,00
function applyMoneyMask(input) {
    let raw = input.value.replace(/\D/g, '');
    if (!raw) raw = '0';
    const cents = parseInt(raw, 10);
    const val = cents / 100;
    input.dataset.rawValue = val;
    input.value = val.toFixed(2).replace('.', ',');
}

function getMoneyValue(input) {
    if (input.dataset && input.dataset.rawValue !== undefined) return parseFloat(input.dataset.rawValue) || 0;
    return parseFloat((input.value || '0').replace(',', '.')) || 0;
}

function setupMoneyInput(id, onChangeCb) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = '0,00';
    el.dataset.rawValue = 0;
    el.addEventListener('input', () => { applyMoneyMask(el); if (onChangeCb) onChangeCb(); });
    el.addEventListener('focus', () => { if (el.value === '0,00') el.value = ''; });
    el.addEventListener('blur', () => { if (!el.value) { el.value = '0,00'; el.dataset.rawValue = 0; } });
}

function addOutroRow(containerId, onChangeCb, descricao = '', valor = 0) {
    const container = document.getElementById(containerId);
    const row = document.createElement('div');
    row.className = 'outro-row';

    const valorFmt = parseFloat(valor || 0).toFixed(2).replace('.', ',');
    row.innerHTML = `
        <input type="text" class="outro-desc" placeholder="Descrição (ex: Refrigerante...)" value="${descricao}">
        <div class="outro-valor-wrap">
            <span>R$</span>
            <input type="text" class="outro-val" inputmode="numeric" placeholder="0,00" value="${valorFmt}">
        </div>
        <button type="button" class="btn-remove-outro">✕</button>
    `;

    const valInput = row.querySelector('.outro-val');
    valInput.dataset.rawValue = parseFloat(valor || 0);
    valInput.addEventListener('input', () => { applyMoneyMask(valInput); if (onChangeCb) onChangeCb(); });
    valInput.addEventListener('focus', () => { if (valInput.value === '0,00') valInput.value = ''; });
    valInput.addEventListener('blur', () => { if (!valInput.value) { valInput.value = '0,00'; valInput.dataset.rawValue = 0; } });

    row.querySelector('.outro-desc').addEventListener('input', () => { if (onChangeCb) onChangeCb(); });
    row.querySelector('.btn-remove-outro').addEventListener('click', () => {
        row.remove();
        if (onChangeCb) onChangeCb();
    });

    container.appendChild(row);
    if (onChangeCb) onChangeCb();
}

function getOutrosItems(containerId) {
    const rows = document.querySelectorAll(`#${containerId} .outro-row`);
    const items = [];
    rows.forEach(row => {
        const desc = row.querySelector('.outro-desc').value.trim();
        const valInput = row.querySelector('.outro-val');
        const val = getMoneyValue(valInput);
        if (desc && val > 0) items.push({ produto: 'Outros', descricao: desc, valor: val, qtd: 1 });
    });
    return items;
}

function clearOutros(containerId) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = '';
}


const DEMO_STORAGE_KEY = 'gestao_vendas_demo_v1';

function createId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function isoNow() {
    return new Date().toISOString();
}

function todayISO() {
    return new Date().toISOString().split('T')[0];
}

function dayOffsetISO(offset) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
}

function buildDemoSeed() {
    const today = todayISO();
    const yesterday = dayOffsetISO(-1);
    const lastSunday = dayOffsetISO(-7);

    const dayTodayId = createId();
    const dayYesterdayId = createId();
    const dayLastSundayId = createId();

    return {
        days: [
            { id: dayTodayId, date: today, total_chickens: 82, finished: false, created_at: isoNow() },
            { id: dayYesterdayId, date: yesterday, total_chickens: 76, finished: true, created_at: isoNow() },
            { id: dayLastSundayId, date: lastSunday, total_chickens: 91, finished: true, created_at: isoNow() }
        ],
        orders: [
            {
                id: createId(),
                day_id: dayTodayId,
                customer_name: 'Carlos Henrique',
                order_type: 'delivery',
                delivery_fee: 8,
                address: 'Rua das Palmeiras, 184',
                items: [{ produto: 'Frango', qtd: 2 }, { produto: 'Tropeiro M', qtd: 1 }, { produto: 'Suco G', qtd: 1 }],
                order_total: 178,
                payment_status: 'paid',
                delivery_status: 'pending',
                pickup_status: null,
                order_status: 'pending',
                created_at: isoNow()
            },
            {
                id: createId(),
                day_id: dayTodayId,
                customer_name: 'Fernanda Souza',
                order_type: 'pickup',
                delivery_fee: 0,
                address: null,
                items: [{ produto: 'Frango', qtd: 1 }, { produto: 'Salpicão P', qtd: 1 }],
                order_total: 85,
                payment_status: 'pending',
                delivery_status: null,
                pickup_status: 'pending',
                order_status: 'pending',
                created_at: isoNow()
            },
            {
                id: createId(),
                day_id: dayTodayId,
                customer_name: 'Marcos Vinícius',
                order_type: 'in-store',
                delivery_fee: 0,
                address: null,
                items: [{ produto: 'Frango', qtd: 1 }, { produto: 'Costela', qtd: 1, peso: 1.2 }],
                order_total: 144,
                payment_status: 'paid',
                delivery_status: null,
                pickup_status: 'ok',
                order_status: 'finished',
                created_at: isoNow()
            },
            {
                id: createId(),
                day_id: dayYesterdayId,
                customer_name: 'Ana Paula',
                order_type: 'delivery',
                delivery_fee: 10,
                address: 'Av. Central, 520',
                items: [{ produto: 'Frango', qtd: 3 }, { produto: 'Tropeiro G', qtd: 1 }],
                order_total: 250,
                payment_status: 'paid',
                delivery_status: 'delivered',
                pickup_status: null,
                order_status: 'finished',
                created_at: isoNow()
            },
            {
                id: createId(),
                day_id: dayYesterdayId,
                customer_name: 'João Pedro',
                order_type: 'fiado',
                delivery_fee: 0,
                address: null,
                items: [{ produto: 'Frango', qtd: 2 }, { produto: 'Salpicão M', qtd: 1 }],
                order_total: 157,
                payment_status: 'pending',
                delivery_status: null,
                pickup_status: null,
                order_status: 'pending',
                created_at: isoNow()
            },
            {
                id: createId(),
                day_id: dayLastSundayId,
                customer_name: 'Luciana Alves',
                order_type: 'pickup',
                delivery_fee: 0,
                address: null,
                items: [{ produto: 'Frango', qtd: 2 }, { produto: 'Tropeiro P', qtd: 2 }],
                order_total: 160,
                payment_status: 'paid',
                delivery_status: null,
                pickup_status: 'ok',
                order_status: 'finished',
                created_at: isoNow()
            }
        ]
    };
}

function loadDemoStore() {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) {
        const seed = buildDemoSeed();
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(seed));
        return seed;
    }
    try {
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.days) || !Array.isArray(parsed.orders)) throw new Error('invalid');
        return parsed;
    } catch (e) {
        const seed = buildDemoSeed();
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(seed));
        return seed;
    }
}

function saveDemoStore(store) {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(store));
}

window.resetSalesDemo = function resetSalesDemo() {
    if (!confirm('Resetar a demonstração e restaurar os dados iniciais?')) return;
    localStorage.removeItem(DEMO_STORAGE_KEY);
    window.location.reload();
};

class DemoQuery {
    constructor(table, operation = 'select', payload = null) {
        this.table = table;
        this.operation = operation;
        this.payload = payload;
        this.filters = [];
        this.orderField = null;
        this.orderAsc = true;
        this.returnMode = 'many';
        this._selectCalled = false;
    }

    select() {
        this._selectCalled = true;
        return this;
    }

    eq(field, value) {
        this.filters.push({ field, value });
        return this;
    }

    order(field, { ascending = true } = {}) {
        this.orderField = field;
        this.orderAsc = ascending;
        return this;
    }

    maybeSingle() {
        this.returnMode = 'maybeSingle';
        return this;
    }

    single() {
        this.returnMode = 'single';
        return this;
    }

    async execute() {
        try {
            const store = loadDemoStore();
            const rows = [...(store[this.table] || [])];

            const applyFilters = (list) => list.filter(row =>
                this.filters.every(f => row[f.field] === f.value)
            );

            if (this.operation === 'select') {
                let result = applyFilters(rows);
                if (this.orderField) {
                    result.sort((a, b) => {
                        const av = a[this.orderField];
                        const bv = b[this.orderField];
                        if (av === bv) return 0;
                        if (av == null) return this.orderAsc ? -1 : 1;
                        if (bv == null) return this.orderAsc ? 1 : -1;
                        return av < bv ? (this.orderAsc ? -1 : 1) : (this.orderAsc ? 1 : -1);
                    });
                }
                return this._formatResult(result);
            }

            if (this.operation === 'insert') {
                const inserted = (this.payload || []).map(item => ({
                    id: item.id || createId(),
                    created_at: item.created_at || isoNow(),
                    ...item
                }));
                store[this.table] = [...rows, ...inserted];
                saveDemoStore(store);
                return this._formatResult(inserted);
            }

            if (this.operation === 'update') {
                const updated = [];
                store[this.table] = rows.map(row => {
                    if (applyFilters([row]).length) {
                        const merged = { ...row, ...this.payload };
                        updated.push(merged);
                        return merged;
                    }
                    return row;
                });
                saveDemoStore(store);
                return this._formatResult(updated);
            }

            if (this.operation === 'delete') {
                const remaining = [];
                const deleted = [];
                rows.forEach(row => {
                    if (applyFilters([row]).length) deleted.push(row);
                    else remaining.push(row);
                });
                store[this.table] = remaining;
                saveDemoStore(store);
                return { data: deleted, error: null };
            }

            return { data: null, error: { message: 'Operação não suportada' } };
        } catch (error) {
            return { data: null, error };
        }
    }

    _formatResult(result) {
        if (this.returnMode === 'maybeSingle') {
            return { data: result[0] || null, error: null };
        }
        if (this.returnMode === 'single') {
            if (!result.length) return { data: null, error: { message: 'Registro não encontrado' } };
            return { data: result[0], error: null };
        }
        return { data: result, error: null };
    }

    then(resolve, reject) {
        return this.execute().then(resolve, reject);
    }
}

const supabaseClient = {
    from(table) {
        return {
            select() {
                return new DemoQuery(table, 'select').select();
            },
            insert(payload) {
                return new DemoQuery(table, 'insert', payload);
            },
            update(payload) {
                return new DemoQuery(table, 'update', payload);
            },
            delete() {
                return new DemoQuery(table, 'delete');
            }
        };
    }
};



function injectDemoControls() {
    const headerMeta = document.querySelector('.header-meta');
    if (headerMeta && !document.getElementById('reset-demo-btn')) {
        const btn = document.createElement('button');
        btn.id = 'reset-demo-btn';
        btn.className = 'btn btn-ghost btn-reset-demo';
        btn.type = 'button';
        btn.innerHTML = 'Resetar demo';
        btn.addEventListener('click', window.resetSalesDemo);
        headerMeta.prepend(btn);
    }
}

let currentDay = null;
const products = Object.keys(PRICES);

const views = {
    initial: document.getElementById('initial-view'),
    dashboard: document.getElementById('dashboard-view'),
    previous: document.getElementById('previous-days-view'),
    report: document.getElementById('report-view')
};

document.addEventListener('DOMContentLoaded', async () => {
    injectDemoControls();
    await checkToday();
    setupEventListeners();
    renderProductsForm();
    renderEditProductsForm();
    updateHomeButtons();
});

// ============================================================
// DIA ATUAL
// ============================================================

async function checkToday() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabaseClient
        .from('days').select('*').eq('date', today).eq('finished', false).maybeSingle();
    if (error) { console.error(error); alert('Erro ao verificar dia atual.'); return; }
    currentDay = data || null;
    updateHomeButtons();
}

function updateHomeButtons() {
    const startBtn = document.getElementById('start-day-btn');
    const continueBtn = document.getElementById('continue-day-btn');
    if (currentDay) {
        startBtn.style.display = 'none';
        continueBtn.style.display = 'block';
    } else {
        startBtn.style.display = 'block';
        continueBtn.style.display = 'none';
    }
}

// ============================================================
// EVENT LISTENERS
// ============================================================

function setupEventListeners() {
    document.getElementById('start-day-btn').addEventListener('click', () => openModal('modal-start-day'));
    document.getElementById('continue-day-btn').addEventListener('click', loadDashboard);
    document.getElementById('view-previous-btn').addEventListener('click', loadPreviousDays);
    document.getElementById('back-to-initial').addEventListener('click', backToInitial);
    document.getElementById('back-from-previous').addEventListener('click', () => showView('initial'));
    document.getElementById('finish-day-btn').addEventListener('click', finishDay);
    document.getElementById('close-report').addEventListener('click', closeReport);

    document.getElementById('cancel-start').addEventListener('click', () => closeModal('modal-start-day'));
    document.getElementById('confirm-start').addEventListener('click', startNewDay);

    document.getElementById('cancel-order').addEventListener('click', () => closeModal('modal-order'));
    document.getElementById('order-form').addEventListener('submit', saveOrder);
    document.getElementById('order-type').addEventListener('change', toggleOrderTypeFields);

    document.getElementById('cancel-edit').addEventListener('click', () => closeModal('modal-edit-day'));
    document.getElementById('confirm-edit').addEventListener('click', saveDayEdit);

    document.getElementById('new-order-btn').addEventListener('click', openOrderModal);

    document.getElementById('edit-order-form').addEventListener('submit', saveOrderEdit);
    document.getElementById('cancel-edit-order').addEventListener('click', () => closeModal('modal-edit-order'));
    const editOrderType = document.getElementById('edit-order-type');
    if (editOrderType) editOrderType.addEventListener('change', toggleEditOrderTypeFields);

    // Campos de dinheiro com máscara (delivery-fee fixos)
    setupMoneyInput('delivery-fee', calculateOrderTotal);
    setupMoneyInput('edit-delivery-fee', calculateEditOrderTotal);

    // Outros dinâmico
    document.getElementById('add-outro-btn').addEventListener('click', () => addOutroRow('outros-list', calculateOrderTotal));
    document.getElementById('edit-add-outro-btn').addEventListener('click', () => addOutroRow('edit-outros-list', calculateEditOrderTotal));
}

function showView(name) {
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[name].classList.add('active');
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// ============================================================
// INICIAR / FINALIZAR DIA
// ============================================================

async function startNewDay() {
    const total = document.getElementById('total-chickens-input').value;
    if (!total || total <= 0) return alert('Informe a quantidade de frangos');
    const today = new Date().toISOString().split('T')[0];

    const { data: existing, error: checkErr } = await supabaseClient
        .from('days').select('*').eq('date', today).maybeSingle();
    if (checkErr) { alert('Erro ao verificar dia existente.'); return; }

    if (existing) {
        if (!existing.finished) {
            alert('Já existe um dia ativo para hoje. Continue o dia existente.');
            closeModal('modal-start-day'); return;
        }
        if (!confirm('Já existe um dia finalizado para hoje. Deseja reabri-lo?')) {
            closeModal('modal-start-day'); return;
        }
        const { error: upErr } = await supabaseClient
            .from('days').update({ finished: false, total_chickens: parseInt(total) }).eq('id', existing.id);
        if (upErr) { alert('Erro ao reabrir dia: ' + upErr.message); return; }
        currentDay = { ...existing, finished: false, total_chickens: parseInt(total) };
        closeModal('modal-start-day');
        updateHomeButtons();
        await loadDashboard();
        return;
    }

    const { data, error } = await supabaseClient
        .from('days').insert([{ date: today, total_chickens: parseInt(total), finished: false }]).select().single();
    if (error) { alert('Erro ao criar dia: ' + error.message); return; }
    currentDay = data;
    closeModal('modal-start-day');
    updateHomeButtons();
    await loadDashboard();
}

async function finishDay() {
    if (!currentDay) return;
    if (!confirm('Tem certeza que deseja finalizar o dia? O relatório será exibido.')) return;
    try {
        const { data: orders } = await supabaseClient.from('orders').select('*').eq('day_id', currentDay.id);
        await updateAllOrdersStatus(orders || []);
        const { error } = await supabaseClient.from('days').update({ finished: true }).eq('id', currentDay.id);
        if (error) { alert('Erro ao finalizar dia: ' + error.message); return; }
        await loadDayReport(currentDay.id);
        currentDay = null;
        updateHomeButtons();
    } catch (err) { console.error(err); alert('Erro inesperado ao finalizar o dia.'); }
}

function backToInitial() {
    if (window.__reportDayId) { window.__reportDayId = null; loadPreviousDays(); }
    else { showView('initial'); updateHomeButtons(); }
    document.getElementById('finish-day-btn').style.display = 'inline-block';
}

function closeReport() {
    if (window.__reportDayId) { window.__reportDayId = null; loadPreviousDays(); }
    else { showView('initial'); updateHomeButtons(); }
}

// ============================================================
// DASHBOARD
// ============================================================

async function loadDashboard() {
    if (!currentDay) {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabaseClient
            .from('days').select('*').eq('date', today).eq('finished', false).maybeSingle();
        if (error) { alert('Erro ao carregar dia.'); return; }
        currentDay = data;
        if (!currentDay) { alert('Nenhum dia ativo. Inicie um novo dia.'); showView('initial'); updateHomeButtons(); return; }
    }

    const { data: orders, error } = await supabaseClient
        .from('orders').select('*').eq('day_id', currentDay.id).order('created_at', { ascending: false });
    if (error) { alert('Erro ao carregar pedidos.'); return; }

    await updateAllOrdersStatus(orders || []);

    const { data: updated, error: refErr } = await supabaseClient
        .from('orders').select('*').eq('day_id', currentDay.id).order('created_at', { ascending: false });
    if (refErr) { alert('Erro ao recarregar pedidos.'); return; }

    updateIndicators(updated || []);
    updatePendingCounters(updated || []);
    renderOrdersList(updated || []);
    showView('dashboard');
}

async function updateAllOrdersStatus(orders) {
    for (const order of orders) {
        try {
            const status = computeOrderStatus(order);
            if (order.order_status !== status) {
                await supabaseClient.from('orders').update({ order_status: status }).eq('id', order.id);
            }
        } catch (err) { console.error(err); }
    }
}

function computeOrderStatus(order) {
    if (order.order_type === 'fiado') return order.order_status === 'finished' ? 'finished' : 'pending';
    const payOk = order.payment_status === 'paid';
    const delOk = order.order_type === 'delivery' ? order.delivery_status === 'delivered' : true;
    const pickOk = (order.order_type === 'pickup' || order.order_type === 'in-store') ? order.pickup_status === 'ok' : true;
    return (payOk && delOk && pickOk) ? 'finished' : 'pending';
}

function updateIndicators(orders) {
    const total = currentDay.total_chickens;
    let sold = 0, collected = 0, money = 0;
    orders.forEach(o => {
        o.items.forEach(i => { if (i.produto === 'Frango') sold += i.qtd || 0; });
        const col = (o.order_type === 'pickup' && o.pickup_status === 'ok') ||
                    (o.order_type === 'delivery' && o.delivery_status === 'delivered') ||
                    (o.order_type === 'in-store');
        if (col) o.items.forEach(i => { if (i.produto === 'Frango') collected += i.qtd || 0; });
        money += parseFloat(o.order_total);
    });
    document.getElementById('total-chickens').textContent = total;
    document.getElementById('sold-chickens').textContent = sold;
    document.getElementById('available-chickens').textContent = total - sold;
    document.getElementById('collected-chickens').textContent = collected;
    document.getElementById('in-shop-chickens').textContent = total - collected;
    document.getElementById('total-money').textContent = `R$ ${money.toFixed(2).replace('.', ',')}`;
}

function updatePendingCounters(orders) {
    const pend = orders.filter(o => o.order_status !== 'finished');
    let pay = 0, del = 0, pick = 0;
    pend.forEach(o => {
        if (o.payment_status !== 'paid') pay++;
        if (o.order_type === 'delivery' && o.delivery_status !== 'delivered') del++;
        if ((o.order_type === 'pickup' || o.order_type === 'in-store') && o.pickup_status !== 'ok') pick++;
        // fiado já conta no pagamento pendente acima
    });
    document.getElementById('pending-total').textContent = pend.length;
    document.getElementById('pending-payment').textContent = pay;
    document.getElementById('pending-delivery').textContent = del;
    document.getElementById('pending-pickup').textContent = pick;

    // Encomendas pendentes por tamanho
    const enc = { 'Tropeiro P':0,'Tropeiro M':0,'Tropeiro G':0,'Salpicão P':0,'Salpicão M':0,'Salpicão G':0 };
    pend.forEach(o => {
        (o.items || []).forEach(i => {
            const pNorm = (i.produto||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
            if (pNorm === 'tropeiro p') enc['Tropeiro P'] += i.qtd || 0;
            else if (pNorm === 'tropeiro m') enc['Tropeiro M'] += i.qtd || 0;
            else if (pNorm === 'tropeiro g') enc['Tropeiro G'] += i.qtd || 0;
            else if (pNorm === 'salpicao p') enc['Salpicão P'] += i.qtd || 0;
            else if (pNorm === 'salpicao m') enc['Salpicão M'] += i.qtd || 0;
            else if (pNorm === 'salpicao g') enc['Salpicão G'] += i.qtd || 0;
        });
    });
    document.getElementById('enc-feijao-p').textContent = enc['Tropeiro P'];
    document.getElementById('enc-feijao-m').textContent = enc['Tropeiro M'];
    document.getElementById('enc-feijao-g').textContent = enc['Tropeiro G'];
    document.getElementById('enc-salp-p').textContent = enc['Salpicão P'];
    document.getElementById('enc-salp-m').textContent = enc['Salpicão M'];
    document.getElementById('enc-salp-g').textContent = enc['Salpicão G'];
}

// ============================================================
// RENDERIZAR LISTA DE PEDIDOS
// ============================================================

function renderOrdersList(orders) {
    document.getElementById('pending-orders-list').innerHTML =
        renderOrderItems(orders.filter(o => o.order_status !== 'finished'), true);
    document.getElementById('finished-orders-list').innerHTML =
        renderOrderItems(orders.filter(o => o.order_status === 'finished'), false);

    document.querySelectorAll('.edit-order-btn').forEach(btn =>
        btn.addEventListener('click', e => openEditOrderModal(e.currentTarget.dataset.id)));
    document.querySelectorAll('.quick-status-btn.finish').forEach(btn =>
        btn.addEventListener('click', async e => await toggleOrderStatus(e.currentTarget.dataset.id)));
    document.querySelectorAll('.delete-order-btn').forEach(btn =>
        btn.addEventListener('click', async e => await deleteOrder(e.currentTarget.dataset.id)));
}

function renderOrderItems(orders, showReasons) {
    if (!orders.length) return '<p style="color:var(--text-muted);font-size:0.82rem;padding:8px 0">Nenhum pedido.</p>';

    return orders.map(order => {
        // Separa itens normais dos "outros"
        const normalItems = order.items.filter(i => i.produto !== 'Outros');
        const outrosItem = order.items.find(i => i.produto === 'Outros');

        const itemsStr = normalItems.map(i =>
            i.peso ? `Costela ${i.peso}kg` : `${i.produto} x${i.qtd}`
        ).join(', ');

        const outrosLine = outrosItem
            ? `<div class="order-details-text" style="font-style:italic">+ ${outrosItem.descricao} (R$ ${parseFloat(outrosItem.valor).toFixed(2).replace('.', ',')})</div>`
            : '';

        const statusClass = order.order_status === 'finished' ? 'status-finished' : 'status-pending';
        const itemClass   = order.order_status === 'finished' ? 'order-finished' : 'order-pending';
        const tipoLabel   = order.order_type === 'pickup' ? 'Retirada' : order.order_type === 'delivery' ? 'Entrega' : order.order_type === 'fiado' ? 'Fiado' : 'Consumo local';

        const quickAction = order.order_status !== 'finished'
            ? `<button class="quick-status-btn finish" data-id="${order.id}">Finalizar</button>` : '';

        const addressLine = (order.order_type === 'delivery' && order.address)
            ? `<div class="order-address">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>${order.address}</span>
               </div>` : '';

        let reasonTags = '';
        if (showReasons) {
            const tags = [];
            if (order.order_type === 'fiado')
                tags.push('<span class="status-tag fiado-tag">Fiado</span>');
            else if (order.payment_status !== 'paid')
                tags.push('<span class="status-tag payment-pending">Pagamento pendente</span>');
            if (order.order_type === 'delivery' && order.delivery_status !== 'delivered')
                tags.push('<span class="status-tag delivery-pending">Entrega pendente</span>');
            if ((order.order_type === 'pickup' || order.order_type === 'in-store') && order.pickup_status !== 'ok')
                tags.push('<span class="status-tag pickup-pending">Retirada pendente</span>');
            if (tags.length) reasonTags = `<div class="order-status-tags">${tags.join('')}</div>`;
        }

        return `
            <div class="order-item ${itemClass}" data-order-id="${order.id}">
                <div class="order-info">
                    <strong>
                        <span class="order-status-indicator ${statusClass}"></span>
                        ${order.customer_name}
                    </strong>
                    <div class="order-details-text">${itemsStr}</div>
                    ${outrosLine}
                    <div class="order-details-text">${tipoLabel}</div>
                    ${addressLine}
                    ${reasonTags}
                </div>
                <div class="order-total">R$ ${order.order_total.toFixed(2).replace('.', ',')}</div>
                <div class="order-actions">
                    ${quickAction}
                    <button class="small-button edit-order-btn" data-id="${order.id}">Editar</button>
                    <button class="small-button danger delete-order-btn" data-id="${order.id}">Excluir</button>
                </div>
            </div>`;
    }).join('');
}

async function toggleOrderStatus(orderId) {
    try {
        const { data: order, error } = await supabaseClient.from('orders').select('*').eq('id', orderId).single();
        if (error) { alert('Erro ao carregar pedido.'); return; }
        let updates = { payment_status: 'paid' };
        if (order.order_type === 'delivery') updates.delivery_status = 'delivered';
        else if (order.order_type === 'pickup' || order.order_type === 'in-store') updates.pickup_status = 'ok';
        const { error: upErr } = await supabaseClient.from('orders').update(updates).eq('id', orderId);
        if (upErr) { alert('Erro ao atualizar status.'); return; }
        loadDashboard();
    } catch (err) { console.error(err); alert('Erro inesperado.'); }
}

async function deleteOrder(orderId) {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return;
    try {
        const { error } = await supabaseClient.from('orders').delete().eq('id', orderId);
        if (error) { alert('Erro ao excluir pedido: ' + error.message); return; }
        loadDashboard();
    } catch (err) { console.error(err); alert('Erro inesperado ao excluir pedido.'); }
}

// ============================================================
// FORMULÁRIO NOVO PEDIDO
// ============================================================

// Constrói o HTML dos produtos com botão "−"
function _buildProductsHTML(selectClass, weightClass, removeClass) {
    return products.map(prod => {
        if (prod === 'Costela') {
            return `<div class="product-row">
                <label>${prod} <span style="color:var(--text-muted)">R$${PRICES[prod].toFixed(2).replace('.', ',')}/kg</span></label>
                <div class="product-row-controls">
                    <input type="number" class="${weightClass}" data-product="${prod}" min="0" step="any" value="0" style="width:100%">
                    <button type="button" class="${removeClass}" data-product="${prod}" data-type="weight" title="Remover">−</button>
                </div>
            </div>`;
        }
        let opts = '<option value="" selected disabled>Selecione</option>';
        for (let i = 1; i <= 5; i++) opts += `<option value="${i}">${i}</option>`;
        return `<div class="product-row">
            <label>${prod} <span style="color:var(--text-muted)">R$${PRICES[prod].toFixed(2).replace('.', ',')}</span></label>
            <div class="product-row-controls">
                <select class="${selectClass}" data-product="${prod}" style="width:100%">${opts}</select>
                <button type="button" class="${removeClass}" data-product="${prod}" data-type="select" title="Remover">−</button>
            </div>
        </div>`;
    }).join('');
}

function renderProductsForm() {
    const container = document.getElementById('products-container');
    container.innerHTML = _buildProductsHTML('product-qty-select', 'product-weight', 'btn-remove-product');

    container.querySelectorAll('.product-qty-select, .product-weight').forEach(inp => {
        inp.addEventListener('input', calculateOrderTotal);
        inp.addEventListener('change', calculateOrderTotal);
    });

    // Botão "−": zera o campo correspondente
    container.querySelectorAll('.btn-remove-product').forEach(btn => {
        btn.addEventListener('click', () => {
            const prod = btn.dataset.product;
            if (btn.dataset.type === 'weight') {
                const inp = container.querySelector(`.product-weight[data-product="${prod}"]`);
                if (inp) { inp.value = 0; calculateOrderTotal(); }
            } else {
                const sel = container.querySelector(`.product-qty-select[data-product="${prod}"]`);
                if (sel) { sel.value = ''; calculateOrderTotal(); }
            }
        });
    });

}

function calculateOrderTotal() {
    let total = 0;
    document.querySelectorAll('.product-qty-select').forEach(s => total += (parseInt(s.value) || 0) * PRICES[s.dataset.product]);
    document.querySelectorAll('.product-weight').forEach(i => total += (parseFloat(i.value) || 0) * PRICES['Costela']);
    total += getMoneyValue(document.getElementById('delivery-fee'));
    getOutrosItems('outros-list').forEach(o => total += o.valor);
    document.getElementById('order-total').textContent = total.toFixed(2).replace('.', ',');
    return total;
}

function toggleOrderTypeFields() {
    const type = document.getElementById('order-type').value;
    document.getElementById('delivery-fields').style.display = type === 'delivery' ? 'block' : 'none';
    document.getElementById('delivery-status-block').style.display = type === 'delivery' ? 'block' : 'none';
    document.getElementById('pickup-status-block').style.display = (type === 'pickup' || type === 'in-store') ? 'block' : 'none';
    if (type === 'in-store') document.getElementById('pickup-status').value = 'ok';
    if (type === 'fiado') document.getElementById('payment-status').value = 'pending';
    calculateOrderTotal();
}

function openOrderModal() {
    document.getElementById('order-form').reset();
    document.querySelectorAll('.product-qty-select').forEach(s => s.value = '');
    document.querySelectorAll('.product-weight').forEach(i => i.value = 0);
    document.getElementById('delivery-fields').style.display = 'none';
    document.getElementById('delivery-status-block').style.display = 'none';
    document.getElementById('pickup-status-block').style.display = 'none';
    document.getElementById('order-total').textContent = '0,00';
    document.getElementById('order-type').value = 'pickup';
    clearOutros('outros-list');
    const dfEl = document.getElementById('delivery-fee'); dfEl.value = '0,00'; dfEl.dataset.rawValue = 0;
    toggleOrderTypeFields();
    openModal('modal-order');
}

async function saveOrder(e) {
    e.preventDefault();
    const customer = document.getElementById('customer-name').value.trim();
    if (!customer) return alert('Nome do cliente obrigatório');

    const items = [];
    document.querySelectorAll('.product-qty-select').forEach(s => {
        const qty = parseInt(s.value) || 0;
        if (qty > 0) items.push({ produto: s.dataset.product, qtd: qty });
    });
    const costelaPeso = parseFloat(document.querySelector('.product-weight[data-product="Costela"]').value) || 0;
    if (costelaPeso > 0) items.push({ produto: 'Costela', peso: costelaPeso, qtd: 1 });

    // Outros
    getOutrosItems('outros-list').forEach(o => items.push(o));

    if (items.length === 0) return alert('Adicione pelo menos um produto');

    const orderType = document.getElementById('order-type').value;
    const deliveryFee = orderType === 'delivery' ? getMoneyValue(document.getElementById('delivery-fee')) : 0;
    const address = orderType === 'delivery' ? document.getElementById('address').value : null;
    const paymentStatus = document.getElementById('payment-status').value;
    let deliveryStatus = null, pickupStatus = null;
    if (orderType === 'delivery') deliveryStatus = document.getElementById('delivery-status').value;
    else if (orderType === 'pickup') pickupStatus = document.getElementById('pickup-status').value;
    else if (orderType === 'in-store') pickupStatus = 'ok';
    // fiado: sem delivery/pickup status

    const total = calculateOrderTotal();

    try {
        const { error } = await supabaseClient.from('orders').insert([{
            day_id: currentDay.id, customer_name: customer, order_type: orderType,
            delivery_fee: deliveryFee, address, items, order_total: total,
            payment_status: paymentStatus, delivery_status: deliveryStatus,
            pickup_status: pickupStatus, order_status: 'pending'
        }]);
        if (error) { alert('Erro ao salvar pedido: ' + error.message); return; }
        closeModal('modal-order');
        loadDashboard();
    } catch (err) { console.error(err); alert('Erro ao salvar pedido.'); }
}

// ============================================================
// EDIÇÃO COMPLETA DE PEDIDO
// ============================================================

function renderEditProductsForm() {
    const container = document.getElementById('edit-products-container');
    if (!container) return;
    container.innerHTML = _buildProductsHTML('edit-product-qty-select', 'edit-product-weight', 'btn-remove-product-edit');

    container.querySelectorAll('.edit-product-qty-select, .edit-product-weight').forEach(inp => {
        inp.addEventListener('input', calculateEditOrderTotal);
        inp.addEventListener('change', calculateEditOrderTotal);
    });

    container.querySelectorAll('.btn-remove-product-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const prod = btn.dataset.product;
            if (btn.dataset.type === 'weight') {
                const inp = container.querySelector(`.edit-product-weight[data-product="${prod}"]`);
                if (inp) { inp.value = 0; calculateEditOrderTotal(); }
            } else {
                const sel = container.querySelector(`.edit-product-qty-select[data-product="${prod}"]`);
                if (sel) { sel.value = ''; calculateEditOrderTotal(); }
            }
        });
    });

}

function calculateEditOrderTotal() {
    let total = 0;
    document.querySelectorAll('.edit-product-qty-select').forEach(s => total += (parseInt(s.value) || 0) * PRICES[s.dataset.product]);
    document.querySelectorAll('.edit-product-weight').forEach(i => total += (parseFloat(i.value) || 0) * PRICES['Costela']);
    total += getMoneyValue(document.getElementById('edit-delivery-fee'));
    getOutrosItems('edit-outros-list').forEach(o => total += o.valor);
    document.getElementById('edit-order-total-display').textContent = total.toFixed(2).replace('.', ',');
    return total;
}

function toggleEditOrderTypeFields() {
    const type = document.getElementById('edit-order-type').value;
    document.getElementById('edit-delivery-fields').style.display = type === 'delivery' ? 'block' : 'none';
    document.getElementById('edit-delivery-status-block').style.display = type === 'delivery' ? 'block' : 'none';
    document.getElementById('edit-pickup-status-block').style.display = (type === 'pickup' || type === 'in-store') ? 'block' : 'none';
    if (type === 'in-store') document.getElementById('edit-pickup-status').value = 'ok';
    if (type === 'fiado') document.getElementById('edit-payment-status').value = 'pending';
    calculateEditOrderTotal();
}

async function openEditOrderModal(orderId) {
    try {
        const { data: order, error } = await supabaseClient.from('orders').select('*').eq('id', orderId).single();
        if (error || !order) { alert('Erro ao carregar pedido.'); return; }

        document.getElementById('edit-order-id').value = order.id;
        document.getElementById('edit-customer-name-input').value = order.customer_name;

        // Zera tudo
        document.querySelectorAll('.edit-product-qty-select').forEach(s => s.value = '');
        document.querySelectorAll('.edit-product-weight').forEach(i => i.value = 0);
        clearOutros('edit-outros-list');
        const edfEl = document.getElementById('edit-delivery-fee'); edfEl.value = '0,00'; edfEl.dataset.rawValue = 0;

        // Preenche com os itens do pedido
        order.items.forEach(item => {
            if (item.produto === 'Outros') {
                addOutroRow('edit-outros-list', calculateEditOrderTotal, item.descricao || '', item.valor || 0);
            } else if (item.produto === 'Costela') {
                const inp = document.querySelector('.edit-product-weight[data-product="Costela"]');
                if (inp) inp.value = item.peso || 0;
            } else {
                const sel = document.querySelector(`.edit-product-qty-select[data-product="${item.produto}"]`);
                if (sel) sel.value = item.qtd || '';
            }
        });

        document.getElementById('edit-order-type').value = order.order_type;
        toggleEditOrderTypeFields();

        const edf = document.getElementById('edit-delivery-fee'); edf.dataset.rawValue = order.delivery_fee || 0; edf.value = parseFloat(order.delivery_fee || 0).toFixed(2).replace('.', ',');
        document.getElementById('edit-address').value = order.address || '';
        document.getElementById('edit-payment-status').value = order.payment_status;

        if (order.order_type === 'delivery') {
            document.getElementById('edit-delivery-status').value = order.delivery_status || 'pending';
        } else if (order.order_type === 'pickup' || order.order_type === 'in-store') {
            document.getElementById('edit-pickup-status').value = order.pickup_status || 'pending';
        }

        calculateEditOrderTotal();
        openModal('modal-edit-order');
    } catch (err) { console.error(err); alert('Erro ao abrir edição.'); }
}

async function saveOrderEdit(e) {
    e.preventDefault();
    const orderId = document.getElementById('edit-order-id').value;
    const customer = document.getElementById('edit-customer-name-input').value.trim();
    if (!customer) return alert('Nome do cliente obrigatório');

    const items = [];
    document.querySelectorAll('.edit-product-qty-select').forEach(s => {
        const qty = parseInt(s.value) || 0;
        if (qty > 0) items.push({ produto: s.dataset.product, qtd: qty });
    });
    const costelaPeso = parseFloat(document.querySelector('.edit-product-weight[data-product="Costela"]').value) || 0;
    if (costelaPeso > 0) items.push({ produto: 'Costela', peso: costelaPeso, qtd: 1 });

    // Outros
    getOutrosItems('edit-outros-list').forEach(o => items.push(o));

    if (items.length === 0) return alert('Adicione pelo menos um produto');

    const orderType = document.getElementById('edit-order-type').value;
    const deliveryFee = orderType === 'delivery' ? getMoneyValue(document.getElementById('edit-delivery-fee')) : 0;
    const address = orderType === 'delivery' ? document.getElementById('edit-address').value : null;
    const paymentStatus = document.getElementById('edit-payment-status').value;
    let deliveryStatus = null, pickupStatus = null;
    if (orderType === 'delivery') deliveryStatus = document.getElementById('edit-delivery-status').value;
    else if (orderType === 'pickup') pickupStatus = document.getElementById('edit-pickup-status').value;
    else if (orderType === 'in-store') pickupStatus = 'ok';
    // fiado: sem delivery/pickup status

    const total = calculateEditOrderTotal();

    try {
        const { error } = await supabaseClient.from('orders').update({
            customer_name: customer, order_type: orderType, delivery_fee: deliveryFee,
            address, items, order_total: total, payment_status: paymentStatus,
            delivery_status: deliveryStatus, pickup_status: pickupStatus,
            order_status: 'pending'
        }).eq('id', orderId);
        if (error) { alert('Erro ao atualizar pedido: ' + error.message); return; }
        closeModal('modal-edit-order');
        loadDashboard();
    } catch (err) { console.error(err); alert('Erro ao salvar edição.'); }
}

// ============================================================
// HISTÓRICO
// ============================================================

async function loadPreviousDays() {
    try {
        const { data: days, error } = await supabaseClient.from('days').select('*').order('date', { ascending: false });
        if (error) { alert('Erro ao carregar dias: ' + error.message); return; }

        const container = document.getElementById('days-list');
        container.innerHTML = '';

        for (const day of days) {
            try {
                const { data: orders } = await supabaseClient.from('orders').select('*').eq('day_id', day.id);
                let sold = 0, money = 0;
                (orders || []).forEach(o => {
                    o.items.forEach(i => { if (i.produto === 'Frango') sold += i.qtd || 0; });
                    money += parseFloat(o.order_total);
                });
                const div = document.createElement('div');
                div.className = 'day-item';
                div.innerHTML = `
                    <div class="day-info">
                        <strong>${new Date(day.date).toLocaleDateString('pt-BR')}</strong>
                        <div class="day-stats">Pedidos: ${(orders||[]).length} · Frangos: ${sold} · Total: R$ ${money.toFixed(2).replace('.', ',')}</div>
                    </div>
                    <div class="day-actions">
                        <button class="small-button view-report-btn" data-id="${day.id}">Ver relatório</button>
                        <button class="small-button" onclick="window.editDay('${day.id}', ${day.total_chickens})">Editar</button>
                        <button class="small-button danger" onclick="window.deleteDay('${day.id}')">Excluir</button>
                    </div>`;
                container.appendChild(div);
            } catch (err) { console.error(err); }
        }

        document.querySelectorAll('.view-report-btn').forEach(btn =>
            btn.addEventListener('click', async e => await loadDayReport(e.target.dataset.id)));

        showView('previous');
    } catch (err) { console.error(err); alert('Erro ao carregar histórico.'); }
}

// ============================================================
// RELATÓRIO
// ============================================================

async function loadDayReport(dayId) {
    try {
        const { data: day, error } = await supabaseClient.from('days').select('*').eq('id', dayId).single();
        if (error || !day) { alert('Dia não encontrado.'); return; }
        window.__reportDayId = dayId;

        const { data: orders, error: ordErr } = await supabaseClient
            .from('orders').select('*').eq('day_id', dayId).order('created_at', { ascending: false });
        if (ordErr) { alert('Erro ao carregar pedidos.'); return; }

        let money = 0, sold = 0, collected = 0;

        // Contagem de unidades/kg por produto
        const counts = {};
        products.forEach(p => counts[p] = 0);

        // Para produtos vendidos em kg (Salpicão P/M/G e Tropeiro P/M/G também têm peso)
        // Aqui vamos medir em qtd (unidades) para os selects e kg para costela e salpicão/tropeiro se aplicável
        // O padrão atual é: Costela = peso em kg; demais = qtd em unidades
        // Para o relatório de kg de Salpicão e Tropeiro, calculamos: qtd * peso_unitario_estimado
        // Mas como não temos peso por unidade, vamos mostrar em UNIDADES para salp/trop e kg para costela
        // Conforme pedido: "tanto em kg que vendeu de salpicao, feijao tropero e costela"
        // Salpicão e Tropeiro são vendidos por tamanho (P/M/G), não por kg diretamente
        // Vamos mostrar a contagem de cada tamanho separada

        const kgCounts = {
            'Costela': 0,
            'Salpicão P': 0, 'Salpicão M': 0, 'Salpicão G': 0,
            'Tropeiro P': 0, 'Tropeiro M': 0, 'Tropeiro G': 0,
        };
        let kgSalpicaoTotal = 0;
        let kgFeijaoTotal = 0;

        let outrosTotal = 0;
        const outrosList = [];

        orders.forEach(o => {
            o.items.forEach(i => {
                if (i.produto === 'Frango') {
                    sold += i.qtd || 0;
                    counts['Frango'] = (counts['Frango'] || 0) + (i.qtd || 0);
                    if (o.pickup_status === 'ok' || o.delivery_status === 'delivered' || o.order_type === 'in-store')
                        collected += i.qtd || 0;
                } else if (i.produto === 'Costela') {
                    counts['Costela'] = (counts['Costela'] || 0) + (i.peso || 0);
                    kgCounts['Costela'] += i.peso || 0;
                } else if (i.produto === 'Outros') {
                    outrosTotal += parseFloat(i.valor) || 0;
                    if (i.descricao) outrosList.push({ descricao: i.descricao, valor: i.valor, cliente: o.customer_name });
                } else {
                    counts[i.produto] = (counts[i.produto] || 0) + (i.qtd || 0);
                    const pNorm = (i.produto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
                    const qtd = i.qtd || 0;
                    if (pNorm === 'salpicao p') kgSalpicaoTotal += qtd * 0.3;
                    else if (pNorm === 'salpicao m') kgSalpicaoTotal += qtd * 0.5;
                    else if (pNorm === 'salpicao g') kgSalpicaoTotal += qtd * 1.0;
                    else if (pNorm === 'tropeiro p') kgFeijaoTotal += qtd * 0.3;
                    else if (pNorm === 'tropeiro m') kgFeijaoTotal += qtd * 0.5;
                    else if (pNorm === 'tropeiro g') kgFeijaoTotal += qtd * 1.0;
                }
            });
            money += parseFloat(o.order_total);
        });

        document.getElementById('report-day-date').textContent = new Date(day.date).toLocaleDateString('pt-BR');
        document.getElementById('report-total-money').textContent = `R$ ${money.toFixed(2).replace('.', ',')}`;
        document.getElementById('report-total-orders').textContent = orders.length;
        document.getElementById('report-sold-chickens').textContent = sold;
        document.getElementById('report-collected-chickens').textContent = collected;
        document.getElementById('report-grand-total').textContent = `R$ ${money.toFixed(2).replace('.', ',')}`;

        // ── Resumo de produtos ──
        const wrapper = document.getElementById('report-product-summary-wrapper');
        wrapper.innerHTML = '';

        // Seção principal de contagem
        const summary = document.createElement('div');
        summary.className = 'product-summary';
        summary.innerHTML = '<h4>Quantidade vendida por produto</h4>';
        const ul = document.createElement('ul');

        for (const [prod, qty] of Object.entries(counts)) {
            if (qty > 0) {
                const li = document.createElement('li');
                if (prod === 'Costela') {
                    li.textContent = `Costela: ${qty.toFixed(3)} kg`;
                } else {
                    li.textContent = `${prod}: ${qty}`;
                }
                ul.appendChild(li);
            }
        }
        summary.appendChild(ul);
        wrapper.appendChild(summary);

        // ── Seção kg de Costela, Salpicão e Tropeiro ──
        const kgFeijao = kgFeijaoTotal;
        const kgSalpicao = kgSalpicaoTotal;
        const kgCostela = kgCounts['Costela'] || 0;

        const hasPesoData = kgFeijao > 0 || kgSalpicao > 0 || kgCostela > 0;
        if (hasPesoData) {
            const pesoSec = document.createElement('div');
            pesoSec.className = 'product-summary';
            pesoSec.style.marginTop = '10px';
            pesoSec.innerHTML = '<h4>Vendas por peso</h4>';
            const pesoUl = document.createElement('ul');

            if (kgFeijao > 0) {
                const li = document.createElement('li');
                li.textContent = `Feijão: ${kgFeijao.toFixed(2)}kg`;
                pesoUl.appendChild(li);
            }
            if (kgSalpicao > 0) {
                const li = document.createElement('li');
                li.textContent = `Salpicão: ${kgSalpicao.toFixed(2)}kg`;
                pesoUl.appendChild(li);
            }
            if (kgCostela > 0) {
                const li = document.createElement('li');
                li.textContent = `Costela: ${kgCostela.toFixed(2)}kg`;
                pesoUl.appendChild(li);
            }

            pesoSec.appendChild(pesoUl);
            wrapper.appendChild(pesoSec);
        }

        // ── Seção Outros ──
        if (outrosList.length > 0) {
            const outrosSec = document.createElement('div');
            outrosSec.className = 'product-summary';
            outrosSec.style.marginTop = '10px';
            outrosSec.innerHTML = `<h4>Outros (R$ ${outrosTotal.toFixed(2).replace('.', ',')} no total)</h4>`;
            const outrosUl = document.createElement('ul');
            outrosList.forEach(o => {
                const li = document.createElement('li');
                li.textContent = `${o.cliente}: ${o.descricao} | R$ ${parseFloat(o.valor).toFixed(2).replace('.', ',')}`;
                outrosUl.appendChild(li);
            });
            outrosSec.appendChild(outrosUl);
            wrapper.appendChild(outrosSec);
        }

        // ── Tabela de pedidos ──
        document.getElementById('report-orders-body').innerHTML = orders.map(o => {
            const normalItems = o.items.filter(i => i.produto !== 'Outros');
            const outrosItem = o.items.find(i => i.produto === 'Outros');
            const itemsStr = normalItems.map(i => i.peso ? `Costela ${i.peso}kg` : `${i.produto} x${i.qtd}`).join('<br>');
            const outrosStr = outrosItem ? `<br><em>+ ${outrosItem.descricao}</em>` : '';
            const tipo = o.order_type === 'pickup' ? 'Retirada' : o.order_type === 'delivery' ? 'Entrega' : o.order_type === 'fiado' ? 'Fiado' : 'Local';
            const _d = new Date(new Date(o.created_at).getTime() - 3 * 60 * 60 * 1000);
            const hora = _d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            return `<tr>
                <td>${o.customer_name}</td>
                <td>${itemsStr}${outrosStr}</td>
                <td>${tipo}</td>
                <td>R$ ${o.order_total.toFixed(2).replace('.', ',')}</td>
                <td>${o.payment_status === 'paid' ? 'Pago' : 'Pendente'}</td>
                <td>${o.order_status === 'finished' ? 'Finalizado' : 'Pendente'}</td>
                <td>${hora}</td>
            </tr>`;
        }).join('');

        showView('report');
    } catch (err) { console.error(err); alert('Erro ao gerar relatório.'); }
}

// ============================================================
// EDITAR / EXCLUIR DIA
// ============================================================

window.editDay = (id, currentTotal) => {
    document.getElementById('edit-total-chickens').value = currentTotal;
    document.getElementById('confirm-edit').dataset.dayId = id;
    openModal('modal-edit-day');
};

window.deleteDay = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este dia e todos os seus pedidos?')) return;
    try {
        const { error } = await supabaseClient.from('days').delete().eq('id', id);
        if (error) { alert('Erro ao excluir: ' + error.message); return; }
        loadPreviousDays();
        if (currentDay && currentDay.id === id) currentDay = null;
        if (views.dashboard.classList.contains('active')) showView('initial');
        updateHomeButtons();
    } catch (err) { console.error(err); alert('Erro ao excluir dia.'); }
};

async function saveDayEdit() {
    const id = document.getElementById('confirm-edit').dataset.dayId;
    const newTotal = parseInt(document.getElementById('edit-total-chickens').value);
    if (!newTotal || newTotal <= 0) return alert('Valor inválido');
    try {
        const { error } = await supabaseClient.from('days').update({ total_chickens: newTotal }).eq('id', id);
        if (error) { alert('Erro ao atualizar: ' + error.message); return; }
        closeModal('modal-edit-day');
        loadPreviousDays();
        if (currentDay && currentDay.id == id) {
            currentDay.total_chickens = newTotal;
            if (views.dashboard.classList.contains('active')) loadDashboard();
        }
    } catch (err) { console.error(err); alert('Erro ao salvar edição.'); }
}