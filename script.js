let display = document.getElementById('display');
let currentInput = '';
let ansValue = 0; // Para armazenar o resultado anterior (botão Ans)

function appendToDisplay(value) {
    if (value.includes('(') && !['(', ')'].includes(value)) {
        // Para funções como Sin(, Log(, etc., insere o nome da função
        currentInput += value;
    } 
    else if (value === 'x²') {
        currentInput += '**2';
    } 
    else if (value === 'x³') {
        currentInput += '**3';
    } 
    else if (value === 'x⁻¹') {
        currentInput += '**(-1)';
    }
    else if (value === 'x¹⁰') {
        currentInput += '*10**';
    } 
    else if (value === 'Exp') {
        currentInput += 'Math.E';
    }
    else if (value === 'Ans') {
        // Insere o último resultado calculado
        currentInput += ansValue;
    }
    else if (value === 'x¹' || value === '') {
        // x¹ e setas direcionais vazias não fazem nada
        currentInput += '';
    }
    else {
        // Números, operadores, parênteses, PI, %, e símbolos de raiz
        currentInput += value;
    }
    
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '';
    display.value = '';
}

function backspace() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}

function calculate() {
    try {
        let expression = currentInput;
        
        // --- Substituição de notações amigáveis por funções JavaScript ---
        expression = expression
            .replace(/Sin⁻¹\(/g, 'Math.asin(') 
            .replace(/Cos⁻¹\(/g, 'Math.acos(') 
            .replace(/Tan⁻¹\(/g, 'Math.atan(') 
            .replace(/Sin\(/g, 'Math.sin(')    
            .replace(/Cos\(/g, 'Math.cos(')     
            .replace(/Tan\(/g, 'Math.tan(')     
            .replace(/Log\(/g, 'Math.log10(')    
            .replace(/√/g, 'Math.sqrt(')        
            .replace(/³√/g, '**(1/3)')          // Raiz cúbica como potência de 1/3
            .replace(/π/g, 'Math.PI')           
            .replace(/%/g, '/100')             
            .replace(/\^/g, '**');              // Trata o símbolo ^ como operador de potência

        // Avalia a expressão
        let result = eval(expression);
        
        // Exibe o resultado e atualiza as variáveis
        // Arredonda para evitar erros de ponto flutuante do JS
        let finalResult = Math.round(result * 10000000000) / 10000000000;
        display.value = finalResult;
        currentInput = finalResult.toString();
        ansValue = finalResult; // Salva o resultado para o botão Ans
    } catch (error) {
        display.value = 'Erro';
        currentInput = '';
        console.error('Erro de cálculo:', error);
    }
}

function toggleSign() {
    // Tenta envolver a expressão atual em (-1 * ...) para inverter o sinal
    try {
        let expression = currentInput;
        let result = eval(`-1 * (${expression})`);
        currentInput = result.toString();
        display.value = currentInput;
    } catch {
        // Se a expressão for inválida, apenas insere o sinal de menos
        currentInput += '-';
        display.value = currentInput;
    }
}