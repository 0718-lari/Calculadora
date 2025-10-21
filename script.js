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
            // Tenta abrir o app do ChatGPT no celular (deep link)
            // Se o app não estiver instalado, pode não fazer nada ou redirecionar para a loja
            window.open('chatgpt://', '_blank');
            break;
        case 'chatgpt':
            angleMode = 'deg';
            break;
    }
    
    updateDisplay();
    updateModeButton();
}