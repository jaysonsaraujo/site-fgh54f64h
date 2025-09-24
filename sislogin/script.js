// Configuração de usuários de exemplo (em produção, isso seria no backend)
const users = [
    { email: 'admin@email.com', password: 'admin123' },
    { email: 'usuario@email.com', password: 'senha123' }
];

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const messageDiv = document.getElementById('message');

// Função para validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para mostrar erro
function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
}

// Função para limpar erro
function clearError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
}

// Função para mostrar mensagem
function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    
    setTimeout(() => {
        messageDiv.className = 'message';
        messageDiv.textContent = '';
    }, 3000);
}

// Validação em tempo real
emailInput.addEventListener('blur', () => {
    if (!validateEmail(emailInput.value)) {
        showError(emailInput, emailError, 'Digite um email válido');
    } else {
        clearError(emailInput, emailError);
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length > 0 && passwordInput.value.length < 6) {
        showError(passwordInput, passwordError, 'A senha deve ter pelo menos 6 caracteres');
    } else {
        clearError(passwordInput, passwordError);
    }
});

// Manipular envio do formulário
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Limpar mensagens anteriores
    clearError(emailInput, emailError);
    clearError(passwordInput, passwordError);
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validações
    let hasError = false;
    
    if (!email) {
        showError(emailInput, emailError, 'O email é obrigatório');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError(emailInput, emailError, 'Digite um email válido');
        hasError = true;
    }
    
    if (!password) {
        showError(passwordInput, passwordError, 'A senha é obrigatória');
        hasError = true;
    } else if (password.length < 6) {
        showError(passwordInput, passwordError, 'A senha deve ter pelo menos 6 caracteres');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Desabilitar botão durante o login
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner"></span>';
    
    // Simular delay de rede
    setTimeout(() => {
        // Verificar credenciais
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            showMessage('Login realizado com sucesso! Redirecionando...', 'success');
            
            // Salvar no localStorage (exemplo)
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isLoggedIn', 'true');
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                // window.location.href = '/dashboard.html';
                alert('Login bem-sucedido! (Redirecionamento simulado)');
                loginForm.reset();
            }, 2000);
        } else {
            showMessage('Email ou senha incorretos', 'error');
            passwordInput.value = '';
            passwordInput.focus();
        }
        
        // Restaurar botão
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }, 1500);
});

// Manipular links de "Esqueceu a senha" e "Cadastre-se"
document.querySelector('.forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Funcionalidade de recuperação de senha em desenvolvimento');
});

document.querySelector('.signup-link a').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Funcionalidade de cadastro em desenvolvimento');
});

// Verificar se já está logado ao carregar a página
window.addEventListener('load', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // Pode redirecionar automaticamente ou mostrar mensagem
        console.log('Usuário já está logado');
    }
});
