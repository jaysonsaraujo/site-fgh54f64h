/**
 * Arquivo de Configuração - Baserow API
 * Configure aqui suas credenciais do Baserow
 */

const BASEROW_CONFIG = {
    // Ative a integração mudando para true e adicionando suas credenciais
    ENABLED: false, // Mude para true quando configurar o Baserow
    
    // URL da API do Baserow
    API_URL: 'https://api.baserow.io',
    
    // Suas credenciais (obtenha no painel do Baserow)
    DATABASE_ID: 'YOUR_DATABASE_ID', // Substitua pelo seu Database ID
    TABLE_ID: 'YOUR_TABLE_ID',       // Substitua pelo seu Table ID
    TOKEN: 'YOUR_API_TOKEN',          // Substitua pelo seu API Token
    
    // Configurações adicionais
    ITEMS_PER_PAGE: 200,
    USE_USER_FIELD_NAMES: true
};

// ========================================
// FUNÇÕES DE INTEGRAÇÃO COM BASEROW
// ========================================

/**
 * Buscar todos os registros do Baserow
 */
async function fetchFromBaserow() {
    if (!BASEROW_CONFIG.ENABLED) {
        console.log('Baserow desabilitado. Usando modo demo.');
        return { results: [] };
    }
    
    const url = `${BASEROW_CONFIG.API_URL}/api/database/rows/table/${BASEROW_CONFIG.TABLE_ID}/`;
    const params = new URLSearchParams({
        user_field_names: BASEROW_CONFIG.USE_USER_FIELD_NAMES,
        size: BASEROW_CONFIG.ITEMS_PER_PAGE
    });
    
    try {
        const response = await fetch(`${url}?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dados carregados do Baserow:', data);
        return data;
        
    } catch (error) {
        console.error('Erro ao buscar dados do Baserow:', error);
        throw error;
    }
}

/**
 * Criar novo registro no Baserow
 */
async function saveToBaserow(data) {
    if (!BASEROW_CONFIG.ENABLED) {
        console.log('Baserow desabilitado. Salvando localmente.');
        return simulateSave(data);
    }
    
    const url = `${BASEROW_CONFIG.API_URL}/api/database/rows/table/${BASEROW_CONFIG.TABLE_ID}/`;
    const params = new URLSearchParams({
        user_field_names: BASEROW_CONFIG.USE_USER_FIELD_NAMES
    });
    
    try {
        const response = await fetch(`${url}?${params}`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro do Baserow:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Registro criado no Baserow:', result);
        return result;
        
    } catch (error) {
        console.error('Erro ao salvar no Baserow:', error);
        throw error;
    }
}

/**
 * Atualizar registro existente no Baserow
 */
async function updateInBaserow(rowId, data) {
    if (!BASEROW_CONFIG.ENABLED) {
        console.log('Baserow desabilitado. Atualizando localmente.');
        return simulateSave(data);
    }
    
    const url = `${BASEROW_CONFIG.API_URL}/api/database/rows/table/${BASEROW_CONFIG.TABLE_ID}/${rowId}/`;
    const params = new URLSearchParams({
        user_field_names: BASEROW_CONFIG.USE_USER_FIELD_NAMES
    });
    
    try {
        const response = await fetch(`${url}?${params}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Registro atualizado no Baserow:', result);
        return result;
        
    } catch (error) {
        console.error('Erro ao atualizar no Baserow:', error);
        throw error;
    }
}

/**
 * Deletar registro do Baserow
 */
async function deleteFromBaserow(rowId) {
    if (!BASEROW_CONFIG.ENABLED) {
        console.log('Baserow desabilitado. Deletando localmente.');
        return true;
    }
    
    const url = `${BASEROW_CONFIG.API_URL}/api/database/rows/table/${BASEROW_CONFIG.TABLE_ID}/${rowId}/`;
    
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('Registro deletado do Baserow');
        return true;
        
    } catch (error) {
        console.error('Erro ao deletar do Baserow:', error);
        throw error;
    }
}

/**
 * Buscar registro específico por ID
 */
async function fetchRecordById(rowId) {
    if (!BASEROW_CONFIG.ENABLED) {
        return null;
    }
    
    const url = `${BASEROW_CONFIG.API_URL}/api/database/rows/table/${BASEROW_CONFIG.TABLE_ID}/${rowId}/`;
    const params = new URLSearchParams({
        user_field_names: BASEROW_CONFIG.USE_USER_FIELD_NAMES
    });
    
    try {
        const response = await fetch(`${url}?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Erro ao buscar registro:', error);
        throw error;
    }
}

/**
 * Simulação de salvamento para modo demo
 */
function simulateSave(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Dados salvos (simulação):', data);
            resolve({
                id: Math.random().toString(36).substr(2, 9),
                ...data
            });
        }, 1000);
    });
}

/**
 * Verificar conexão com Baserow
 */
async function testBaserowConnection() {
    if (!BASEROW_CONFIG.ENABLED) {
        console.log('Baserow está desabilitado');
        return false;
    }
    
    try {
        const response = await fetch(
            `${BASEROW_CONFIG.API_URL}/api/database/rows/table/${BASEROW_CONFIG.TABLE_ID}/`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${BASEROW_CONFIG.TOKEN}`
                }
            }
        );
        
        if (response.ok) {
            console.log('✅ Conexão com Baserow estabelecida com sucesso!');
            return true;
        } else {
            console.error('❌ Erro na conexão com Baserow:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao conectar com Baserow:', error);
        return false;
    }
}

// Testar conexão ao carregar
if (BASEROW_CONFIG.ENABLED) {
    testBaserowConnection();
}
