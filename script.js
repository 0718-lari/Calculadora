let display = '0';
let previousValue = null;
let operation = null;
let waitingForOperand = false;
let isOn = true;
let angleMode = 'deg'; // 'deg', 'rad', 'off', ou 'chatgpt'
let parenthesesCount = 0;

function updateDisplay() {
    document.getElementById('displayMain').textContent = display;

    // Atualiza o indicador do modo angular
    const displayMode = document.getElementById('displayMode');
    if (angleMode === 'off') {
        displayMode.textContent = '';
    } else if (angleMode === 'chatgpt') {
        displayMode.textContent = 'GPT';
    } else {
        displayMode.textContent = angleMode.toUpperCase();
    }
}

function updateModeButton() {
    const modeBtn = document.getElementById('angleModeBtn');
    modeBtn.textContent = 'MODE';
}

function inputNumber(num) {
    if (!isOn) return;

    if (waitingForOperand) {
        display = num;
        waitingForOperand = false;
    } else {
        display = display === '0' ? num : display + num;
    }
    updateDisplay();
}

function inputDecimal() {
    if (!isOn) return;

    if (waitingForOperand) {
        display = '0.';
        waitingForOperand = false;
    } else if (display.indexOf('.') === -1) {
        display = display + '.';
    }
    updateDisplay();
}

function inputPi() {
    if (!isOn) return;
    display = Math.PI.toString();
    waitingForOperand = true;
    updateDisplay();
}

function inputParenthesis(paren) {
    if (!isOn) return;

    if (paren === '(') {
        parenthesesCount++;
    } else if (paren === ')' && parenthesesCount > 0) {
        parenthesesCount--;
    }

    if (waitingForOperand || display === '0') {
        display = paren;
        waitingForOperand = false;
    } else {
        display = display + paren;
    }
    updateDisplay();
}

function clearAll() {
    if (!isOn) return;
    display = '0';
    previousValue = null;
    operation = null;
    waitingForOperand = false;
    parenthesesCount = 0;
    updateDisplay();
}

function backspace() {
    if (!isOn) return;

    if (display.length > 1) {
        display = display.slice(0, -1);
    } else {
        display = '0';
    }
    updateDisplay();
}

function turnOff() {
    isOn = false;
    document.getElementById('display').classList.add('display-off');
    document.getElementById('buttons').classList.add('off-state');
    document.getElementById('onButton').style.display = 'block';
    document.getElementById('displayMain').textContent = '';
}

function turnOn() {
    isOn = true;
    display = '0';
    previousValue = null;
    operation = null;
    waitingForOperand = false;
    parenthesesCount = 0;
    angleMode = 'deg'; // Reset para DEG quando liga

    document.getElementById('display').classList.remove('display-off');
    document.getElementById('buttons').classList.remove('off-state');
    document.getElementById('onButton').style.display = 'none';
    updateDisplay();
    updateModeButton();
}

function toggleAngleMode() {
    if (!isOn) return;

    // Cicla entre: deg → rad → off → chatgpt → deg
    switch (angleMode) {
        case 'deg':
            angleMode = 'rad';
            break;
        case 'rad':
            angleMode = 'off';
            break;
        case 'off':
            angleMode = 'chatgpt';
            // Tenta abrir o ChatGPT (funciona melhor em dispositivos móveis)
            try {
                // Primeiro tenta o deep link do app
                window.open('chatgpt://', '_blank');
                // Fallback para web após um pequeno delay
                setTimeout(() => {
                    window.open('https://chat.openai.com', '_blank');
                }, 1000);
            } catch (error) {
                // Se falhar, abre direto no navegador
                window.open('https://chat.openai.com', '_blank');
            }
            break;
        case 'chatgpt':
            angleMode = 'deg';
            break;
    }

    updateDisplay();
    updateModeButton();
}

function setOperation(nextOperation) {
    if (!isOn) return;

    const inputValue = parseFloat(display);

    if (previousValue === null) {
        previousValue = inputValue;
    } else if (operation) {
        const currentValue = previousValue || 0;
        const result = performCalculation(currentValue, inputValue, operation);

        if (result === null) {
            display = 'Erro';
            previousValue = null;
            operation = null;
            waitingForOperand = true;
            updateDisplay();
            return;
        }

        display = String(result);
        previousValue = result;
    }

    waitingForOperand = true;
    operation = nextOperation;
    updateDisplay();
}

function scientificFunction(func) {
    if (!isOn) return;

    const inputValue = parseFloat(display);
    let result;

    try {
        switch (func) {
            case 'sin':
                if (angleMode === 'deg') {
                    result = Math.sin(inputValue * Math.PI / 180);
                } else {
                    result = Math.sin(inputValue);
                }
                break;
            case 'cos':
                if (angleMode === 'deg') {
                    result = Math.cos(inputValue * Math.PI / 180);
                } else {
                    result = Math.cos(inputValue);
                }
                break;
            case 'tan':
                if (angleMode === 'deg') {
                    result = Math.tan(inputValue * Math.PI / 180);
                } else {
                    result = Math.tan(inputValue);
                }
                break;
            case 'asin':
                if (angleMode === 'deg') {
                    result = Math.asin(inputValue) * 180 / Math.PI;
                } else {
                    result = Math.asin(inputValue);
                }
                break;
            case 'acos':
                if (angleMode === 'deg') {
                    result = Math.acos(inputValue) * 180 / Math.PI;
                } else {
                    result = Math.acos(inputValue);
                }
                break;
            case 'atan':
                if (angleMode === 'deg') {
                    result = Math.atan(inputValue) * 180 / Math.PI;
                } else {
                    result = Math.atan(inputValue);
                }
                break;
            case 'log':
                result = Math.log10(inputValue);
                break;
            case 'ln':
                result = Math.log(inputValue);
                break;
            case 'sqrt':
                result = Math.sqrt(inputValue);
                break;
            case 'square':
                result = inputValue * inputValue;
                break;
            case 'cube':
                result = inputValue * inputValue * inputValue;
                break;
            case 'reciprocal':
                result = 1 / inputValue;
                break;
            case 'pow10':
                result = Math.pow(10, inputValue);
                break;
            case 'exp':
                result = Math.exp(inputValue);
                break;
            case 'negate':
                result = -inputValue;
                break;
            default:
                return;
        }

        if (isNaN(result) || !isFinite(result)) {
            display = 'Erro';
        } else {
            display = String(result);
        }
        waitingForOperand = true;
        updateDisplay();
    } catch (error) {
        display = 'Erro';
        waitingForOperand = true;
        updateDisplay();
    }
}

function performCalculation(firstValue, secondValue, operation) {
    switch (operation) {
        case 'add':
            return firstValue + secondValue;
        case 'subtract':
            return firstValue - secondValue;
        case 'multiply':
            return firstValue * secondValue;
        case 'divide':
            if (secondValue === 0) {
                return null;
            }
            return firstValue / secondValue;
        case 'power':
            return Math.pow(firstValue, secondValue);
        default:
            return secondValue;
    }
}

function calculate() {
    if (!isOn) return;

    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
        const result = performCalculation(previousValue, inputValue, operation);

        if (result === null) {
            display = 'Erro';
            previousValue = null;
            operation = null;
            waitingForOperand = true;
            updateDisplay();
            return;
        }

        display = String(result);
        previousValue = null;
        operation = null;
        waitingForOperand = true;
        updateDisplay();
    }
}

// Suporte para teclado
document.addEventListener('keydown', function (event) {
    if (!isOn) return;

    const key = event.key;

    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '+') {
        setOperation('add');
    } else if (key === '-') {
        setOperation('subtract');
    } else if (key === '*') {
        setOperation('multiply');
    } else if (key === '/') {
        event.preventDefault();
        setOperation('divide');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearAll();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === '(') {
        inputParenthesis('(');
    } else if (key === ')') {
        inputParenthesis(')');
    } else if (key === 'm' || key === 'M') {
        toggleAngleMode();
    }
});

// Inicializar display
updateDisplay();
updateModeButton();