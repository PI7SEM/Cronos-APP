async function verifyCredentials(url, params) {

    console.log("entrou login")
    const response = await fetch(`${url}usuario/?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })

    var data = await response;
    console.log(data);

    if (data.status == "404") {
        alert("Usuário não encontrado!")
    }

    if (data.status == "200"){
        window.location.href = "../html/controle.html";
    }
}

document.getElementById("enviar").addEventListener("click", () => {
    let email = document.getElementById("Usuario").value.toString();
    let password = document.getElementById("senha").value.toString();
    let url = 'https://apex.oracle.com/pls/apex/projeto_7/api/';
    let params = new URLSearchParams({
        email: email,
        senha: password
    });
    console.log(email);
    console.log(password);
    console.log(params);
    verifyCredentials(url, params)



});
