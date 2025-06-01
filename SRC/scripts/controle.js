// Variáveis globais para brilho e cores
var brightness;
var red;
var green;
var blue;

function toggle(num) {
  const lamp = document.getElementById('l' + num);
  lamp.classList.toggle('ativa');
}

// Função para enviar comandos para a API
function setControle(comando, efeito) {
  // As variáveis brightness, red, green, blue aqui serão as globais atualizadas pelos seletores

  console.log(red, green, blue, brightness); // Log para verificar os valores
  const params = {
    id_luminaria: 1, // Hardcoded, como no original
    comando: comando,
    id_efeito: efeito,
    brilho: brightness,
    vermelho: red,
    verde: green,
    azul: blue
  };

  const url = `https://apex.oracle.com/pls/apex/projeto_7/api/controle/?id_luminaria=${params.id_luminaria}&comando=${params.comando}&id_efeito=${params.id_efeito}&brilho=${params.brilho}&red=${params.vermelho}&green=${params.verde}&blue=${params.azul}&hora_ligar=&hora_desligar=`;
  
  fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json"
      }
    })
    .then(response => console.log("Resposta da API:", response))
    .catch(error => console.error("Erro ao chamar a API:", error)); // Adicionado para tratar erros
}

var arrComando = [0, 0, 0];

var lum1 = document.getElementById("l1");
var lum2 = document.getElementById("l2");
var lum3 = document.getElementById("l3");

if (lum1) {
  lum1.addEventListener("click", function () {
    if (arrComando[0] == 0) {
      arrComando[0] = 1;
    } else {
      arrComando[0] = 0;
    }
    var stringControle = `${arrComando[0]}${arrComando[1]}${arrComando[2]}`;
    // console.log("Comando Lâmpadas:", stringControle);
    setControle(stringControle, 1); // Efeito 1 hardcoded
  });
}

if (lum2) {
  lum2.addEventListener("click", function () {
    if (arrComando[1] == 0) {
      arrComando[1] = 1;
    } else {
      arrComando[1] = 0;
    }
    var stringControle = `${arrComando[0]}${arrComando[1]}${arrComando[2]}`;
    // console.log("Comando Lâmpadas:", stringControle);
    setControle(stringControle, 1);
  });
}

if (lum3) {
  lum3.addEventListener("click", function () {
    if (arrComando[2] == 0) {
      arrComando[2] = 1;
    } else {
      arrComando[2] = 0;
    }
    var stringControle = `${arrComando[0]}${arrComando[1]}${arrComando[2]}`;
    // console.log("Comando Lâmpadas:", stringControle);
    setControle(stringControle, 1);
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const seletores = document.querySelectorAll('.seletor');

    seletores.forEach(seletor => {
        let arrastando = false;
        let posYInicial;
        let offsetInicial;
        const barraVertical = seletor.parentNode;
        const controleContainer = barraVertical.parentNode; // Div que tem o ID (ex: "red", "blue")
        const porcentagemElement = controleContainer.querySelector('.porcentagem');
        const alturaBarra = barraVertical.offsetHeight - seletor.offsetHeight;
        const controlId = controleContainer.id; // ID do controle ("brigthness", "red", "green", "blue")

        // Eventos de mouse
        seletor.addEventListener('mousedown', (e) => {
            iniciarArrasto(e.clientY, seletor);
        });

        window.addEventListener('mousemove', (e) => {
            // Passamos o seletor específico para a função de movimento
            if (arrastando && seletor.classList.contains('arrastando')) {
                movimentarSeletorAtual(e.clientY, seletor, alturaBarra, porcentagemElement, controlId);
            }
        });

        window.addEventListener('mouseup', () => {
            // Finalizamos o arrasto para o seletor específico
            if (seletor.classList.contains('arrastando')) {
                finalizarArrasto(seletor);
            }
        });

        // Eventos de toque
        seletor.addEventListener('touchstart', (e) => {
            e.preventDefault();
            iniciarArrasto(e.touches[0].clientY, seletor);
        });

        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (arrastando && seletor.classList.contains('arrastando')) {
                movimentarSeletorAtual(e.touches[0].clientY, seletor, alturaBarra, porcentagemElement, controlId);
            }
        });

        window.addEventListener('touchend', () => {
            if (seletor.classList.contains('arrastando')) {
                finalizarArrasto(seletor);
            }
        });

        function iniciarArrasto(posY, elSeletor) {
            arrastando = true; // Flag global de arraste, pode ser melhorada para ser por seletor
            posYInicial = posY;
            offsetInicial = elSeletor.offsetTop;
            elSeletor.classList.add('arrastando');
        }
        
        // Função movida para fora para ser acessível e específica
        function movimentarSeletorAtual(posY, elSeletor, alturaDaBarra, elPorcentagem, idDoControle) {
            // if (!arrastando || !elSeletor.classList.contains('arrastando')) return; // Verificação redundante se chamada corretamente
            const deltaY = posY - posYInicial;
            let novaPosY = offsetInicial + deltaY;
            novaPosY = Math.max(0, Math.min(novaPosY, alturaDaBarra));
            elSeletor.style.top = `${novaPosY}px`;
            atualizarValorControle(novaPosY, alturaDaBarra, elPorcentagem, idDoControle);
        }

        function finalizarArrasto(elSeletor) {
            arrastando = false; // Resetar a flag global
            elSeletor.classList.remove('arrastando');
            // Opcional: Chamar setControle aqui se quiser enviar o valor final para a API ao soltar
            // setControle(`${arrComando[0]}${arrComando[1]}${arrComando[2]}`, 1);
        }

        // Inicializa o valor do seletor com base na posição inicial (assumindo 100% no topo)
        // Posição Y = 0 significa que o seletor está no topo da barra.
        atualizarValorControle(0, alturaBarra, porcentagemElement, controlId);
    });

    // Função genérica para atualizar o valor do controle (brilho ou cor)
    function atualizarValorControle(posicaoY, alturaTotal, elementoPorcentagem, idControle) {
        // A fórmula inverte o valor: topo da barra (posicaoY pequena) = valor alto (255)
        const valorCalculado = Math.round(((alturaTotal - posicaoY) / alturaTotal) * 255);
        elementoPorcentagem.textContent = `${Math.round((valorCalculado / 255) * 100)}%`;

        // console.log(`Controle: ${idControle}, Valor: ${valorCalculado}`);

        // Atualiza a variável global correspondente
        if (idControle === 'brigthness') { // Note o ID no HTML é "brigthness"
            brightness = valorCalculado;
        } else if (idControle === 'red') {
            red = valorCalculado;
        } else if (idControle === 'green') {
            green = valorCalculado;
        } else if (idControle === 'blue') {
            blue = valorCalculado;
        }
        // Opcional: Chamar setControle aqui se quiser enviar o valor para a API a cada movimento
        // setControle(`${arrComando[0]}${arrComando[1]}${arrComando[2]}`, 1);
    }
});

// Lógica para o botão "Intensidade" na navbar
const intensidadeNavItem = document.getElementById("intensidade");
if (intensidadeNavItem) {
    intensidadeNavItem.addEventListener("click", () => {
        const brightnessControl = document.getElementById("brigthness");
        if (brightnessControl) {
            brightnessControl.classList.toggle("oculto");
        }
    });
}