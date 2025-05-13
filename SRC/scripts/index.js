document.addEventListener("DOMContentLoaded", () => {
    const opacidadeDiv = document.getElementById("opacidade");

    const elementTitulo = document.getElementById("containerLogo");
    const elementLogo = document.getElementById("containerTitulo");
    let opacidade = 0.2; // Inicia com opacidade 0

    const aumentarOpacidade = () => {
        if (opacidade < 0.95) {
            opacidade += 0.01; // Incrementa a opacidade em 0.01 para um efeito mais gradual
            opacidadeDiv.style.backgroundColor = `rgba(0, 0, 0, ${opacidade.toFixed(2)})`;

            elementTitulo.style.zIndex = 0;
            elementLogo.style.zIndex = 0;
            requestAnimationFrame(aumentarOpacidade); // Chama novamente para continuar o efeito
        } else {
            window.location.href = "../SRC/html/login.html"; // Redireciona para login.html
        }
    };

    setTimeout(() => {
        aumentarOpacidade(); // Inicia o aumento de opacidade após 3 segundos
    }, 3000); // Aguarda 3 segundos (3000ms)
});
