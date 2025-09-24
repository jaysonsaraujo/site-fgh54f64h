/**
 * Sistema de Agendamento de Casamentos
 * Script Principal
 */

// ========================================
// VARIÁVEIS GLOBAIS
// ========================================
let reservedDates = {};
let locaisDisponiveis = [];
let padresDisponiveis = [];
let currentEditingId = null;

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
});

async function initializeSystem() {
    try {
        // Carregar configurações
        await loadInitialData();
        
        // Inicializar calendário
        initializeCalendar();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Carregar dados do Baserow
        await loadReservedDates();
        
        console.log('Sistema inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar sistema:', error);
        showError('Erro ao carregar o sistema. Por favor, recarregue a página.');
    }
}

// ========================================
// CALENDÁRIO
// ========================================
function initializeCalendar() {
    const year = document.getElementById('yearSelect').value;
    const container = document.getElementById('calendarContainer');
    container.innerHTML = '';

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 
        'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    months.forEach((month, index) => {
        const monthCalendar = createMonthCalendar(year, index, month);
        container.appendChild(monthCalendar);
    });

    updateReservedDatesDisplay();
}

function createMonthCalendar(year, monthIndex, monthName) {
    const monthDiv = document.createElement('div');
    monthDiv.className = 'month-calendar';

    // Header do mês
    const header = document.createElement('div');
    header.className = 'month-header';
    header.textContent = `${monthName} ${year}`;
    monthDiv.appendChild(header);

    // Dias da semana
    const weekdays = document.createElement('div');
    weekdays.className = 'weekdays';
    ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
        const weekday = document.createElement('div');
        weekday.className = 'weekday';
        weekday.textContent = day;
        weekdays.appendChild(weekday);
    });
    monthDiv.appendChild(weekdays);

    // Container dos dias
    const daysContainer = document.createElement('div');
    daysContainer.className = 'days';

    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Dias vazios antes do primeiro dia do mês
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        daysContainer.appendChild(emptyDay);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = day;
        
        const dateKey = formatDateKey(year, monthIndex + 1, day);
        dayDiv.dataset.date = dateKey;
        
        if (reservedDates[dateKey]) {
            dayDiv.classList.add('reserved');
            const reservation = reservedDates[dateKey];
            dayDiv.title = `Reservado: ${reservation.NOME_NOIVA} & ${reservation.NOME_NOIVO}`;
        } else {
            dayDiv.title = 'Clique para agendar';
        }
        
        dayDiv.addEventListener('click', () => openModal(dateKey));
        daysContainer.appendChild(dayDiv);
    }

    monthDiv.appendChild(daysContainer);
    return monthDiv;
}

// ========================================
// MODAL
// ========================================
function openModal(date) {
    const modal = document.getElementById('cadastroModal');
    modal.classList.add('active');
    
    // Verificar se é edição ou novo cadastro
    if (reservedDates[date]) {
        loadFormData(reservedDates[date]);
        currentEditingId = reservedDates[date].ID_CADASTRO;
    } else {
        resetForm();
        currentEditingId = null;
        
        // Gerar ID único
        const uniqueId = generateUniqueId();
        document.getElementById('cadastroId').value = uniqueId;
        
        // Definir data do agendamento (hoje)
        const today = formatDate(new Date());
        document.getElementById('dataAgendamento').value = today;
        
        // Definir data selecionada
        document.getElementById('dataCasamento').value = date;
    }
    
    // Atualizar título com a data
    const [year, month, day] = date.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    document.getElementById('selectedDate').textContent = `Data selecionada: ${formattedDate}`;
    
    // Atualizar listas
    updateDataLists();
}

function closeModal() {
    const modal = document.getElementById('cadastroModal');
    modal.classList.remove('active');
    resetForm();
    hideMessages();
    currentEditingId = null;
}

// ========================================
// FORMULÁRIO
// ========================================
function resetForm() {
    document.getElementById('cadastroForm').reset();
    hideMessages();
}

function loadFormData(data) {
    document.getElementById('cadastroId').value = data.ID_CADASTRO || '';
    document.getElementById('dataAgendamento').value = data.DATA_AGENDAMENTO || '';
    document.getElementById('nomeNoiva').value = data.NOME_NOIVA || '';
    document.getElementById('whatsappNoiva').value = data.WHATSAPP_NOIVA || '';
    document.getElementById('nomeNoivo').value = data.NOME_NOIVO || '';
    document.getElementById('whatsappNoivo').value = data.WHATSAPP_NOIVO || '';
    document.getElementById('dataCasamento').value = data.DATA_CASAMENTO || '';
    document.getElementById('horarioCasamento').value = data.HORARIO_CASAMENTO || '';
    document.getElementById('localCasamento').value = data.LOCAL_CASAMENTO || '';
    document.getElementById('nomePadre').value = data.NOME_CELEBRANTE || '';
    document.getElementById('dataEntrevista').value = data.DATA_ENTREVISTA || '';
    document.getElementById('proclame1').value = data.PROCLAME_1 || '';
    document.getElementById('proclame2').value = data.PROCLAME_2 || '';
    document.getElementById('proclame3').value = data.PROCLAME_3 || '';
    document.getElementById('proclame4').value = data.PROCLAME_4 || '';
    document.getElementById('observacoes').value = data.OBSERVACOES || '';
    document.getElementById('mensagemSistema').value = data.MENSAGEM_SISTEMA || '';
    
    // Radio buttons
    if (data.TRANSFERENCIA) {
        const transferRadio = document.querySelector(`input[name="transferencia"][value="${data.TRANSFERENCIA}"]`);
        if (transferRadio) transferRadio.checked = true;
    }
    
    if (data.EFEITO_CIVIL) {
        const efeitoRadio = document.querySelector(`input[name="efeitoCivil"][value="${data.EFEITO_CIVIL}"]`);
        if (efeitoRadio) efeitoRadio.checked = true;
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!validateForm()) {
        return;
    }

    // Mostrar indicador de carregamento
    showLoading();

    // Coletar dados do formulário
    const formData = collectFormData();

    try {
        let result;
        
        if (currentEditingId) {
            // Atualizar registro existente
            result = await updateInBaserow(currentEditingId, formData);
        } else {
            // Criar novo registro
            result = await saveToBaserow(formData);
        }
        
        // Atualizar cache local
        reservedDates[formData.DATA_CASAMENTO] = formData;
        
        showSuccess(currentEditingId ? 'Cadastro atualizado com sucesso!' : 'Cadastro realizado com sucesso!');
        
        // Atualizar calendário
        updateReservedDatesDisplay();
        
        // Fechar modal após 2 segundos
        setTimeout(() => {
            closeModal();
            initializeCalendar();
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao salvar:', error);
        showError('Erro ao salvar. Verifique sua conexão e tente novamente.');
    }
}

function collectFormData() {
    return {
        ID_CADASTRO: document.getElementById('cadastroId').value,
        DATA_AGENDAMENTO: document.getElementById('dataAgendamento').value,
        NOME_NOIVA: document.getElementById('nomeNoiva').value.toUpperCase(),
        WHATSAPP_NOIVA: document.getElementById('whatsappNoiva').value,
        NOME_NOIVO: document.getElementById('nomeNoivo').value.toUpperCase(),
        WHATSAPP_NOIVO: document.getElementById('whatsappNoivo').value,
        DATA_CASAMENTO: document.getElementById('dataCasamento').value,
        HORARIO_CASAMENTO: document.getElementById('horarioCasamento').value,
        LOCAL_CASAMENTO: document.getElementById('localCasamento').value.toUpperCase(),
        NOME_CELEBRANTE: document.getElementById('nomePadre').value.toUpperCase(),
        TRANSFERENCIA: document.querySelector('input[name="transferencia"]:checked').value,
        EFEITO_CIVIL: document.querySelector('input[name="efeitoCivil"]:checked').value,
        DATA_ENTREVISTA: document.getElementById('dataEntrevista').value,
        PROCLAME_1: document.getElementById('proclame1').value,
        PROCLAME_2: document.getElementById('proclame2').value,
        PROCLAME_3: document.getElementById('proclame3').value,
        PROCLAME_4: document.getElementById('proclame4').value,
        OBSERVACOES: document.getElementById('observacoes').value.toUpperCase(),
        MENSAGEM_SISTEMA: document.getElementById('mensagemSistema').value.toUpperCase(),
        STATUS: 'AGENDADO'
    };
}

function validateForm() {
    const requiredFields = [
        { id: 'nomeNoiva', name: 'Nome da Noiva' },
        { id: 'whatsappNoiva', name: 'WhatsApp da Noiva' },
        { id: 'nomeNoivo', name: 'Nome do Noivo' },
        { id: 'whatsappNoivo', name: 'WhatsApp do Noivo' },
        { id: 'dataCasamento', name: 'Data do Casamento' },
        { id: 'horarioCasamento', name: 'Horário do Casamento' },
        { id: 'localCasamento', name: 'Local do Casamento' },
        { id: 'nomePadre', name: 'Nome do Celebrante' },
        { id: 'dataEntrevista', name: 'Data da Entrevista' }
    ];
    
    for (let field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            alert(`Por favor, preencha o campo: ${field.name}`);
            element.focus();
            return false;
        }
    }
    
    // Validar formato do telefone
    const phoneRegex = /^KATEX_INLINE_OPEN\d{2}KATEX_INLINE_CLOSE \d{5}-\d{4}$/;
    const whatsappNoiva = document.getElementById('whatsappNoiva').value;
    const whatsappNoivo = document.getElementById('whatsappNoivo').value;
    
    if (!phoneRegex.test(whatsappNoiva)) {
        alert('WhatsApp da Noiva em formato inválido. Use: (00) 00000-0000');
        document.getElementById('whatsappNoiva').focus();
        return false;
    }
    
    if (!phoneRegex.test(whatsappNoivo)) {
        alert('WhatsApp do Noivo em formato inválido. Use: (00) 00000-0000');
        document.getElementById('whatsappNoivo').focus();
        return false;
    }
    
    return true;
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    // Mudança de ano
    document.getElementById('yearSelect').addEventListener('change', initializeCalendar);

    // Formulário de cadastro
    document.getElementById('cadastroForm').addEventListener('submit', handleSubmit);

    // Duplo clique para adicionar novo local
    document.getElementById('localCasamento').addEventListener('dblclick', function() {
        addNewItem('local', this);
    });

    // Duplo clique para adicionar novo padre/diácono
    document.getElementById('nomePadre').addEventListener('dblclick', function() {
        addNewItem('padre', this);
    });

    // Converter inputs para maiúsculas
    const textInputs = document.querySelectorAll('input[type="text"]:not([readonly]), textarea');
    textInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    });

    // Máscara para telefone
    document.getElementById('whatsappNoiva').addEventListener('input', formatPhone);
    document.getElementById('whatsappNoivo').addEventListener('input', formatPhone);

    // Fechar modal ao clicar fora
    document.getElementById('cadastroModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Copiar data do casamento para o proclame 4
    document.getElementById('dataCasamento').addEventListener('change', function() {
        document.getElementById('proclame4').value = this.value;
    });
}

function addNewItem(type, inputElement) {
    const message = type === 'local' 
        ? 'Digite o nome do novo local:' 
        : 'Digite o nome do novo Padre/Diácono:';
    
    const newItem = prompt(message);
    
    if (newItem && newItem.trim()) {
        const itemUpper = newItem.toUpperCase().trim();
        const list = type === 'local' ? locaisDisponiveis : padresDisponiveis;
        
        if (!list.includes(itemUpper)) {
            list.push(itemUpper);
            updateDataLists();
            inputElement.value = itemUpper;
            
            // Salvar no localStorage
            saveToLocalStorage(type === 'local' ? 'locais' : 'padres', list);
        } else {
            alert('Este item já existe na lista!');
        }
    }
}

// ========================================
// UTILITÁRIOS
// ========================================
function generateUniqueId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    return `CAS${year}${month}${timestamp}${random}`;
}

function formatDateKey(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = value;
}

function updateDataLists() {
    // Atualizar lista de locais
    const locaisList = document.getElementById('locaisList');
    locaisList.innerHTML = '';
    locaisDisponiveis.forEach(local => {
        const option = document.createElement('option');
        option.value = local;
        locaisList.appendChild(option);
    });

    // Atualizar lista de padres
    const padresList = document.getElementById('padresList');
    padresList.innerHTML = '';
    padresDisponiveis.forEach(padre => {
        const option = document.createElement('option');
        option.value = padre;
        padresList.appendChild(option);
    });
}

function updateReservedDatesDisplay() {
    document.querySelectorAll('.day[data-date]').forEach(day => {
        const date = day.dataset.date;
        if (reservedDates[date]) {
            day.classList.add('reserved');
            const reservation = reservedDates[date];
            day.title = `Reservado: ${reservation.NOME_NOIVA} & ${reservation.NOME_NOIVO}`;
        } else {
            day.classList.remove('reserved');
            day.title = 'Clique para agendar';
        }
    });
}

// ========================================
// INDICADORES DE STATUS
// ========================================
function showLoading() {
    document.getElementById('loadingIndicator').classList.add('active');
    hideMessages();
}

function hideLoading() {
    document.getElementById('loadingIndicator').classList.remove('active');
}

function showSuccess(message = 'Operação realizada com sucesso!') {
    hideLoading();
    const successElement = document.getElementById('successMessage');
    successElement.textContent = `✅ ${message}`;
    successElement.classList.add('active');
}

function showError(message = 'Erro ao processar operação.') {
    hideLoading();
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = `❌ ${message}`;
    errorElement.classList.add('active');
}

function hideMessages() {
    document.getElementById('successMessage').classList.remove('active');
    document.getElementById('errorMessage').classList.remove('active');
}

// ========================================
// LOCAL STORAGE
// ========================================
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Erro ao carregar do localStorage:', e);
        return null;
    }
}

// ========================================
// INICIALIZAÇÃO DE DADOS
// ========================================
async function loadInitialData() {
    // Carregar locais do localStorage ou usar padrão
    locaisDisponiveis = loadFromLocalStorage('locais') || [
        'IGREJA MATRIZ',
        'CAPELA SANTO ANTONIO',
        'CAPELA NOSSA SENHORA',
        'CAPELA SAO JOSE',
        'SALAO PAROQUIAL'
    ];
    
    // Carregar padres do localStorage ou usar padrão
    padresDisponiveis = loadFromLocalStorage('padres') || [
        'PE. JOAO SILVA',
        'PE. MARCOS SANTOS',
        'PE. ANTONIO COSTA',
        'DC. PEDRO OLIVEIRA',
        'DC. PAULO MENDES'
    ];
}

// ========================================
// INTEGRAÇÃO COM BASEROW
// ========================================
async function loadReservedDates() {
    try {
        if (BASEROW_CONFIG.ENABLED) {
            const data = await fetchFromBaserow();
            reservedDates = {};
            
            data.results.forEach(row => {
                if (row.DATA_CASAMENTO) {
                    reservedDates[row.DATA_CASAMENTO] = row;
                }
            });
            
            updateReservedDatesDisplay();
        } else {
            // Modo demo - carregar dados de exemplo
            loadDemoData();
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showError('Erro ao carregar agendamentos. Usando modo offline.');
        loadDemoData();
    }
}

function loadDemoData() {
    // Dados de demonstração
    reservedDates = {
        '2025-02-15': {
            ID_CADASTRO: 'CAS202412001',
            NOME_NOIVA: 'MARIA SILVA',
            NOME_NOIVO: 'JOAO SANTOS',
            HORARIO_CASAMENTO: '19:00'
        },
        '2025-03-22': {
            ID_CADASTRO: 'CAS202412002',
            NOME_NOIVA: 'ANA COSTA',
            NOME_NOIVO: 'PEDRO OLIVEIRA',
            HORARIO_CASAMENTO: '17:00'
        }
    };
    updateReservedDatesDisplay();
}

// Exportar função para uso global
window.closeModal = closeModal;
