let display = document.getElementById('display');
let currentInput = '';
let ansValue = 0;

// Constante para converter Graus para Radianos (π / 180)
const RADIAN_FACTOR = Math.PI / 180;

function appendToDisplay(value) {
    // [*** MANTENHA O RESTANTE DA FUNÇÃO appendToDisplay() AQUI ***]
    // ... Seu código da função appendToDisplay() anterior ...
    // Certifique-se de que a lógica de append continua a mesma
    
    if (value.includes('(') && !['(', ')'].includes(value)) {
        currentInput += value;
    } 
    // ... [outras condições como x², x³, etc.] ...
    else {
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
        
        // -------------------------------------------------------------
        // PASSO 1: CONVERSÃO DE SINTAXE E INSERÇÃO DO FATOR RADIANO
        // -------------------------------------------------------------
        
        // Define um padrão de busca para funções trigonométricas seguidas de um número ou expressão entre parênteses.
        // O padrão (Sin|Cos|Tan)\s*\(([^)]+)\) captura a função e o que está dentro do parênteses.
        
        const trigRegex = /(Sin|Cos|Tan|Sin⁻¹|Cos⁻¹|Tan⁻¹)\s*\(([^)]+)\)/g;

        let processedExpression = expression.replace(trigRegex, (match, func, value) => {
            let mathFunc;
            let converter = `* ${RADIAN_FACTOR}`; // Fator de conversão para Graus -> Radianos
            
            switch (func) {
                case 'Sin': mathFunc = 'Math.sin'; break;
                case 'Cos': mathFunc = 'Math.cos'; break;
                case 'Tan': mathFunc = 'Math.tan'; break;
                
                // Funções Inversas (Arco): Recebem radianos e retornam radianos, 
                // então o resultado deve ser multiplicado por (180/π) para converter para Graus.
                case 'Sin⁻¹': mathFunc = 'Math.asin'; converter = `* (1 / ${RADIAN_FACTOR})`; break;
                case 'Cos⁻¹': mathFunc = 'Math.acos'; converter = `* (1 / ${RADIAN_FACTOR})`; break;
                case 'Tan⁻¹': mathFunc = 'Math.atan'; converter = `* (1 / ${RADIAN_FACTOR})`; break;
                default: return match; // Caso não encontre, retorna a string original
            }

            // Para funções normais (Sin, Cos, Tan): 
            // Math.sin(valor * (π/180))
            if (func === 'Sin' || func === 'Cos' || func === 'Tan') {
                 return `${mathFunc}((${value}) ${converter})`;
            }
            // Para funções inversas (Sin⁻¹, Cos⁻¹, Tan⁻¹):
            // Math.asin(valor) * (180/π)
            return `${mathFunc}(${value}) ${converter}`;
        });
        
        // -------------------------------------------------------------
        // PASSO 2: CONVERSÃO DE OUTROS SÍMBOLOS E EVAL
        // -------------------------------------------------------------
        processedExpression = processedExpression
            .replace(/Log\(/g, 'Math.log10(')    
            .replace(/√/g, 'Math.sqrt(')        
            .replace(/³√/g, '**(1/3)')          
            .replace(/π/g, 'Math.PI')           
            .replace(/%/g, '/100')             
            .replace(/\^/g, '**');

        // Avalia a expressão
        let result = eval(processedExpression);
        
        // -------------------------------------------------------------
        // PASSO 3: FORMATAÇÃO DO RESULTADO (toFixed(2))
        // -------------------------------------------------------------
        
        // Converte o resultado para string com duas casas decimais
        let finalResult = result.toFixed(2);
        
        display.value = finalResult;
        currentInput = finalResult.toString();
        ansValue = finalResult; 
        
    } catch (error) {
        display.value = 'Erro';
        currentInput = '';
        console.error('Erro de cálculo:', error);
    }
}

function toggleSign() {
    // [*** MANTENHA O RESTANTE DA FUNÇÃO toggleSign() AQUI ***]
    // ... Seu código da função toggleSign() anterior ...
    
    try {
        let expression = currentInput;
        let result = eval(`-1 * (${expression})`);
        currentInput = result.toString();
        display.value = currentInput;
    } catch {
        currentInput += '-';
        display.value = currentInput;
    }
}