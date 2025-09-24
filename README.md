# Sistema de Agendamento de Casamentos 💒

Sistema completo para gerenciamento de agendamentos de casamentos paroquiais com integração ao Baserow.

## 📋 Funcionalidades

- ✅ Calendário visual elegante com todos os meses do ano
- ✅ Indicação visual de datas reservadas
- ✅ Formulário completo de cadastro
- ✅ Integração com banco de dados Baserow
- ✅ Validação de campos obrigatórios
- ✅ Conversão automática para maiúsculas
- ✅ Máscara de telefone
- ✅ Sistema de proclames
- ✅ Controle de transferências entre paróquias/dioceses
- ✅ Modo offline/demo

## 🚀 Instalação

### 1. Estrutura de Arquivos

sistema-agendamento-casamentos/
│
├── index.html
├── css/
│ └── styles.css
├── js/
│ ├── script.js
│ └── config.js
├── data/
│ └── database.json
└── README.md


### 2. Configuração do Baserow

#### 2.1 Criar Tabela no Baserow

1. Acesse seu Baserow
2. Crie um novo Database
3. Importe o arquivo `data/database.json`
4. O Baserow criará automaticamente todos os campos

#### 2.2 Obter Credenciais

1. No Baserow, vá em Settings > API tokens
2. Crie um novo token
3. Copie o Database ID e Table ID

#### 2.3 Configurar o Sistema

Edite o arquivo `js/config.js`:

```javascript
const BASEROW_CONFIG = {
    ENABLED: true, // Mude para true
    API_URL: 'https://api.baserow.io',
    DATABASE_ID: 'SEU_DATABASE_ID',
    TABLE_ID: 'SEU_TABLE_ID',
    TOKEN: 'SEU_API_TOKEN'
};

💻 Uso
Modo Demo (Sem Baserow)
Abra o arquivo index.html no navegador
O sistema funcionará com dados locais
Modo Produção (Com Baserow)
Configure as credenciais no config.js
Hospede os arquivos em um servidor web
Acesse através do navegador
🔧 Personalização
Adicionar Novos Locais/Celebrantes
Dê duplo clique no campo correspondente
Digite o novo item
Será salvo automaticamente
Alterar Cores
Edite as variáveis CSS em css/styles.css:

CSS
:root {
    --primary-color: #764ba2;
    --secondary-color: #667eea;
    /* ... outras cores ... */
}

📱 Responsividade
O sistema é totalmente responsivo e funciona em:

Desktop
Tablets
Smartphones
🔐 Segurança
Mantenha seu API Token seguro
Não exponha credenciais no código público
Use HTTPS em produção
📊 Estrutura dos Dados
Campos da Tabela
Campo	Tipo	Obrigatório
ID_CADASTRO	Texto	Sim
DATA_AGENDAMENTO	Data	Sim
NOME_NOIVA	Texto	Sim
WHATSAPP_NOIVA	Texto	Sim
NOME_NOIVO	Texto	Sim
WHATSAPP_NOIVO	Texto	Sim
DATA_CASAMENTO	Data	Sim
HORARIO_CASAMENTO	Texto	Sim
LOCAL_CASAMENTO	Texto	Sim
NOME_CELEBRANTE	Texto	Sim
TRANSFERENCIA	Seleção	Sim
EFEITO_CIVIL	Seleção	Sim
DATA_ENTREVISTA	Data	Sim
PROCLAME_1	Data	Não
PROCLAME_2	Data	Não
PROCLAME_3	Data	Não
PROCLAME_4	Data	Não
OBSERVACOES	Texto Longo	Não
MENSAGEM_SISTEMA	Texto Longo	Não
STATUS	Seleção	Não
🐛 Solução de Problemas
Erro de Conexão com Baserow
Verifique as credenciais no config.js
Confirme que o token tem permissões corretas
Verifique o console do navegador para erros
Dados não Aparecem
Limpe o cache do navegador
Verifique a conexão com internet
Confirme que o Baserow está acessível
📞 Suporte
Para dúvidas ou problemas, abra uma issue no repositório.

📄 Licença
Este projeto está sob licença MIT.

Desenvolvido com ❤️ para facilitar o gerenciamento de casamentos paroquiais.


---

## 🎯 **Instruções de Uso**

1. **Crie a estrutura de pastas** conforme indicado
2. **Salve cada arquivo** em sua respectiva pasta
3. **Configure o Baserow**:
   - Importe o `database.json`
   - Obtenha as credenciais
   - Atualize o `config.js`
4. **Teste localmente** abrindo o `index.html`
5. **Publique em um servidor** para uso em produção

O sistema está completo e pronto para uso! 🚀


