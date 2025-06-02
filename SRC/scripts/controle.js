// Configurações e Estado Global (Minimizado)
// -----------------------------------------------------------------------------
const API_BASE_URL = "https://apex.oracle.com/pls/apex/projeto_7/api/controle/";
const DEFAULT_LUMINARIA_ID = 1;
const DEFAULT_EFFECT_ID = 1;

// Estado dos controles de cor e brilho
let controlValues = {
    brigthness: 0, // AJUSTADO para 'brigthness' para corresponder ao seu HTML/ID original
    red: 0,
    green: 0,
    blue: 0
};

// Estado dos comandos das lâmpadas (ex: "000", "101")
let lampCommandString = "000";
const lampStates = [0, 0, 0];

// Elementos da UI (Navbar e Painéis)
// -----------------------------------------------------------------------------
// AJUSTADO para usar 'intensidadeNavItem' consistentemente
const intensidadeNavItem = document.getElementById("intensidade");
const coresTrigger = document.getElementById("cores");
const iaTrigger = document.getElementById("iaAgent");

// AJUSTADO para usar 'brigthness' como ID do painel, para corresponder ao seu HTML/ID original
const brightnessPanel = document.getElementById("brigthness");
const coresPanelsCollection = document.getElementsByClassName("controleCoresCores");
const iaPanel = document.getElementById("ia");

// Funções Utilitárias
// -----------------------------------------------------------------------------

// setControleAPI (sem alterações diretas aqui, mas usará controlValues.brigthness implicitamente)
async function setControleAPI(comando, efeito, idLuminaria = DEFAULT_LUMINARIA_ID) {
    console.log("Enviando para API:", {
        comando,
        efeito,
        idLuminaria,
        brilho: controlValues.brigthness, // Acessando a propriedade correta
        vermelho: controlValues.red,
        verde: controlValues.green,
        azul: controlValues.blue
    });

    const params = new URLSearchParams({
        id_luminaria: idLuminaria,
        comando: comando,
        id_efeito: efeito,
        brilho: controlValues.brigthness, // Usando a propriedade correta
        red: controlValues.red,
        green: controlValues.green,
        blue: controlValues.blue,
        hora_ligar: '',
        hora_desligar: ''
    });

    const url = `${API_BASE_URL}?${params.toString()}`;

    // try {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Accept": "application/json" },
    });
    if (!response.ok) {
        console.error("Erro na resposta da API:", response.status, response.statusText);
        const errorData = await response.text();
        console.error("Detalhes do erro:", errorData);
        return;
    }

}

function esconderTodosOsPaineisPrincipais() {
    if (brightnessPanel) brightnessPanel.classList.add("oculto");
    if (iaPanel) iaPanel.classList.add("oculto");

    if (coresPanelsCollection) {
        for (let panel of coresPanelsCollection) {
            if (panel) panel.classList.add("oculto");
        }
    }
}

// atualizarValorControle (esta função não precisa mudar, pois 'idControle' virá do HTML como "brigthness")
function atualizarValorControle(posY, alturaTotal, elementoPorcentagem, idControle) {
    let valorCalculado;

    if (alturaTotal <= 0) {
        // Se a altura útil para o arraste do controle é zero ou negativa
        // (ex: elemento não visível, erro de cálculo de CSS, ou barraVertical e seletor têm a mesma altura).
        // Dado que posY é fixado em 0 nesses casos (pela lógica de movimentarSeletor),
        // interpretamos que o seletor está "preso" no topo.
        // O topo corresponde a 100% do valor (255).
        valorCalculado = 255;
        console.warn(`Altura útil do controle '${idControle}' é ${alturaTotal}px. Isso pode indicar um problema de CSS ou layout. Definindo valor como 100% (255) por padrão.`);
    } else {
        // Cálculo normal
        valorCalculado = Math.round(((alturaTotal - posY) / alturaTotal) * 255);
    }

    // Um fallback final para garantir que valorCalculado nunca seja NaN.
    // Isso não deveria ser necessário se a lógica acima estiver correta, mas é uma segurança extra.
    if (isNaN(valorCalculado)) {
        console.error(`Cálculo de valor resultou em NaN para o controle '${idControle}' (posY: ${posY}, alturaTotal: ${alturaTotal}). Isso é inesperado. Definindo para 0 como fallback.`);
        valorCalculado = 0; // Ou 255, dependendo do fallback mais seguro desejado.
    }

    // Atualiza a exibição da porcentagem
    elementoPorcentagem.textContent = `${Math.round((valorCalculado / 255) * 100)}%`;

    // Atualiza o valor no objeto de estado
    if (controlValues.hasOwnProperty(idControle)) {
        controlValues[idControle] = valorCalculado;
    } else {
        // Este warning não deve ocorrer se os IDs HTML estiverem corretos (ex: "brigthness", "red", etc.)
        console.warn(`ID de controle desconhecido ('${idControle}') ao tentar definir o valor calculado.`);
    }
}


// Lógica dos Seletores de Cor/Brilho (Sliders)
// (Nenhuma mudança necessária aqui, pois 'controlIdDrag' e 'controlId' virão dos IDs do HTML)
// -----------------------------------------------------------------------------
let currentDraggedSelector = null;
let posYInicialDrag, offsetInicialDrag;
let alturaBarraDrag, porcentagemElementDrag, controlIdDrag; // controlIdDrag será "brigthness"

function iniciarArrastoSeletor(event, seletor) {
    event.preventDefault();
    currentDraggedSelector = seletor;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    posYInicialDrag = clientY;
    offsetInicialDrag = currentDraggedSelector.offsetTop;
    currentDraggedSelector.classList.add('arrastando');

    const barraVertical = seletor.parentNode;
    const controleContainer = barraVertical.parentNode; // Este deve ter id="brigthness"
    alturaBarraDrag = barraVertical.offsetHeight - seletor.offsetHeight;
    porcentagemElementDrag = controleContainer.querySelector('.porcentagem');
    controlIdDrag = controleContainer.id; // Será "brigthness"
}

function movimentarSeletor(event) {
    if (!currentDraggedSelector) return;
    event.preventDefault();

    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const deltaY = clientY - posYInicialDrag;
    let novaPosY = offsetInicialDrag + deltaY;

    novaPosY = Math.max(0, Math.min(novaPosY, alturaBarraDrag));
    currentDraggedSelector.style.top = `${novaPosY}px`;
    atualizarValorControle(novaPosY, alturaBarraDrag, porcentagemElementDrag, controlIdDrag);
}

function finalizarArrastoSeletor() {
    if (currentDraggedSelector) {
        currentDraggedSelector.classList.remove('arrastando');
        setControleAPI(lampCommandString, DEFAULT_EFFECT_ID);
    }
    currentDraggedSelector = null;
}

window.addEventListener('mousemove', movimentarSeletor);
window.addEventListener('mouseup', finalizarArrastoSeletor);
window.addEventListener('touchmove', movimentarSeletor, { passive: false });
window.addEventListener('touchend', finalizarArrastoSeletor);


// Inicialização quando o DOM estiver pronto
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Configuração dos Seletores (Sliders)
    const seletores = document.querySelectorAll('.seletor');
    seletores.forEach(seletor => {
        const barraVertical = seletor.parentNode;
        // O controleContainer é o elemento que deve ter o ID (ex: "brigthness", "red")
        const controleContainer = barraVertical.parentNode;
        const porcentagemElement = controleContainer.querySelector('.porcentagem');
        const alturaBarra = barraVertical.offsetHeight - seletor.offsetHeight;
        // controlId virá do ID do elemento HTML, que deve ser "brigthness" para o brilho
        const controlId = controleContainer.id;

        seletor.style.top = '0px';
        // A chamada abaixo passará "brigthness" como controlId se o HTML estiver correto
        atualizarValorControle(0, alturaBarra, porcentagemElement, controlId);

        seletor.addEventListener('mousedown', (e) => iniciarArrastoSeletor(e, seletor));
        seletor.addEventListener('touchstart', (e) => iniciarArrastoSeletor(e, seletor), { passive: false });
    });

    // Configuração das Lâmpadas (sem alterações)
    const lampElements = [
        document.getElementById("l1"),
        document.getElementById("l2"),
        document.getElementById("l3")
    ];

    lampElements.forEach((lampEl, index) => {
        if (lampEl) {
            lampEl.addEventListener("click", () => {
                lampEl.classList.toggle('ativa');
                lampStates[index] = lampStates[index] === 0 ? 1 : 0;
                lampCommandString = lampStates.join('');
                setControleAPI(lampCommandString, DEFAULT_EFFECT_ID);
            });
        } else {
            console.warn(`Elemento da lâmpada l${index + 1} não encontrado.`);
        }
    });

    // Configuração dos Toggles da Navbar
    // 1. Intensidade (Brilho)
    // AJUSTADO para usar 'intensidadeNavItem' e 'brightnessPanel' (que agora aponta para id="brigthness")
    if (intensidadeNavItem && brightnessPanel) {
        intensidadeNavItem.addEventListener("click", () => {
            document.getElementsByClassName("luminaria")[0].classList.remove("oculto");
            const painelEstavaOculto = brightnessPanel.classList.contains("oculto");
            if (painelEstavaOculto) {
                esconderTodosOsPaineisPrincipais();
                brightnessPanel.classList.remove("oculto");
            } else {
                brightnessPanel.classList.add("oculto");
            }
        });
    } else {
        if (!intensidadeNavItem) console.warn("Elemento com ID 'intensidade' (para intensidadeNavItem) não encontrado.");
        if (!brightnessPanel) console.warn("Elemento com ID 'brigthness' (para brightnessPanel) não encontrado.");
    }

    // 2. Cores (sem alterações)
    if (coresTrigger && coresPanelsCollection.length > 0) {
        coresTrigger.addEventListener("click", () => {
            document.getElementsByClassName("luminaria")[0].classList.remove("oculto");
            let algumPainelDeCorEstavaOculto = false;
            for (let panel of coresPanelsCollection) {
                if (panel && panel.classList.contains("oculto")) {
                    algumPainelDeCorEstavaOculto = true;
                    break;
                }
            }

            if (algumPainelDeCorEstavaOculto) {
                esconderTodosOsPaineisPrincipais();
                for (let panel of coresPanelsCollection) {
                    if (panel) panel.classList.remove("oculto");
                }
            } else {
                for (let panel of coresPanelsCollection) {
                    if (panel) panel.classList.add("oculto");
                }
            }
        });
    } else {
        console.warn("Item 'cores' ou painéis 'controleCoresCores' não encontrados/vazios.");
    }

    // 3. IA (sem alterações)
    if (iaTrigger && iaPanel) {
        iaTrigger.addEventListener("click", () => {

            document.getElementsByClassName("luminaria")[0].classList.add("oculto");

            const painelEstavaOculto = iaPanel.classList.contains("oculto");
            if (painelEstavaOculto) {
                esconderTodosOsPaineisPrincipais();
                iaPanel.classList.remove("oculto");
            } else {
                iaPanel.classList.add("oculto");
            }
        });
    } else {
        console.warn("Item 'iaAgent' ou painel 'ia' não encontrado.");
    }

    esconderTodosOsPaineisPrincipais();
    
});

const startButton = document.getElementById('aiAgent_startButton');
const statusDiv = document.getElementById('aiAgent_status');
const transcriptDiv = document.getElementById('aiAgent_transcript');

const n8nWebhookUrl = 'https://6ndzjs07-5678.brs.devtunnels.ms/webhook/3ce0be9a-e858-4e41-a40a-9483d86d8004';

if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    statusDiv.textContent = "Seu navegador não suporta a API de Reconhecimento de Voz. Tente o Chrome ou Edge.";
    startButton.disabled = true;
} else {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    startButton.addEventListener('click', () => {
        transcriptDiv.textContent = '';
        statusDiv.textContent = 'Ouvindo... 🎤';
        startButton.classList.add('aiAgent_ativa');
        recognition.start();
    });

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        transcriptDiv.textContent = 'Você disse: ' + speechResult;
        statusDiv.textContent = 'Enviando comando...';
        sendToN8N(speechResult);
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onerror = (event) => {
        startButton.classList.remove('aiAgent_ativa');
        if (event.error === 'no-speech') {
            statusDiv.textContent = 'Nenhuma fala detectada. Tente novamente.';
        } else if (event.error === 'audio-capture') {
            statusDiv.textContent = 'Erro na captura de áudio. Verifique seu microfone.';
        } else if (event.error === 'not-allowed') {
            statusDiv.textContent = 'Permissão para usar o microfone negada.';
        } else {
            statusDiv.textContent = 'Erro no reconhecimento de voz: ' + event.error;
        }
    };

    async function sendToN8N(commandText) {
        try {
            const response = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: commandText }),
            });

            if (response.ok) {
                statusDiv.textContent = 'Comando enviado com sucesso!';
            } else {
                statusDiv.textContent = `Erro ao enviar para o N8N: ${response.status} ${response.statusText}`;
            }
        } catch (error) {
            statusDiv.textContent = 'Erro de rede ao tentar enviar para o N8N.';
            console.error('Erro na requisição fetch:', error);
        } finally {
            startButton.classList.remove('aiAgent_ativa');
        }
    }
}
