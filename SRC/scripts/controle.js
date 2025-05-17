function toggle(num) {
  const lamp = document.getElementById('l' + num);
  lamp.classList.toggle('ativa');
}


function setControle(comando, efeito) {
  const params = {
    id_luminaria: 1,
    comando: comando,
    id_efeito: efeito,
  };

  const url = `https://apex.oracle.com/pls/apex/projeto_7/api/controle/?id_luminaria=${params.id_luminaria}&comando=${params.comando}&id_efeito=${params.id_efeito}&hora_ligar&hora_desligar=`;

 fetch(url, {
  method: "POST",
  headers: {
    "Accept": "application/json"
  }
})
  .then(response => console.log("Resposta da API:", response))

}

var arrComando = [0,0,0];


var lum1 = document.getElementById("l1");
var lum2 = document.getElementById("l2");
var lum3 = document.getElementById("l3");

lum1.addEventListener("click", function () {
  if (arrComando[0] == 0) {
    arrComando[0] = 1;
  } else{
    arrComando[0] = 0;
  }

  var stringControle = `${arrComando[0]}${arrComando[1]}${arrComando[2]}`
  console.log(stringControle);
  setControle(stringControle, 1)

});

lum2.addEventListener("click", function () {
  if (arrComando[1] == 0) {
    arrComando[1] = 1;
  } else{
    arrComando[1] = 0;
  }
  
  var stringControle = `${arrComando[0]}${arrComando[1]}${arrComando[2]}`
  setControle(stringControle, 1)
  console.log(stringControle);

}
);

lum3.addEventListener("click", function () {
  
  if (arrComando[2] == 0) {
    arrComando[2] = 1;
  } else{
    arrComando[2] = 0;
  }

  var stringControle = `${arrComando[0]}${arrComando[1]}${arrComando[2]}`
  setControle(stringControle, 1)
  console.log(stringControle);
})
