import usuarios from '../usuario.js'


function exibePessoa() {
  let pessoa =  document.getElementById("pessoa")
   usuarios.forEach(element => {
     let opt = document.createElement("option")
     opt.innerText = element.nome
 
     pessoa.appendChild(opt)
   });
 }
 exibePessoa()

// Função para adicionar uma transação
document.getElementById("adicionar").addEventListener("click", () =>{

  const descricao = document.getElementById('descricao').value;
  const valor = parseFloat(document.getElementById('valor').value);

  if (!descricao || isNaN(valor)) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  const categoria = document.getElementById('categoria').value;
  const tipo = document.getElementById('tipo').value;

  let pessoa =  document.getElementById("pessoa").value

  const hoje = new Date(); 
  const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');  
  const anoHoje = hoje.getFullYear() 

  let check = document.getElementById("checkData")
  let vencimento;

  if(check.checked === true) {

    let vencimentoData = document.getElementById("data").value
    let [ano, mes, dia] = vencimentoData.split('-').map(Number);
      
   
    if(!dia, !mes, ano < anoHoje){
      return alert("Favor inserir as informações do campo Vencimento corretamente!")
    }else {
      if(mes < 10){ mes = `0${mes}` }
      if(dia < 10){ dia = `0${dia}` }

      // console.log(mes, dia)
     vencimento = `${dia}/${mes}/${ano}`;
    }
  }else {
    vencimento = "Sem Vencimento"
  }
  // console.log(vencimento)

  

  
  const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

  let status;
  let parcela;

  if(categoria === "receita"){

    status = "Entrada"
    parcela = "Sem parcela"

  } else if(categoria === "despesa"){

    status = "Aberto"
    parcela =  parseFloat(document.getElementById("parcelado").value)

    if(tipo === "fixa") { 
      parcela = "1"
    }
    
  }

  let id;
  if (transacoes.length === 0){
    id = 0
  }else{
    let ultimoID = transacoes[transacoes.length - 1].id
    id = ultimoID + 1
  }

   
   transacoes.push({ id, descricao, valor, categoria, tipo, pessoa, parcela, mesHoje, vencimento, status});
  //  console.log(transacoes)
   localStorage.setItem('transacoes', JSON.stringify(transacoes));

  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
  document.getElementById('data').value = '';

})

document.getElementById("cancelar").addEventListener("click", () => location = "../index.html")

const parcelado = document.getElementById("parcelado");

for (let i = 1; i <= 36; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = `Parcelado em ${i}x`;
  parcelado.appendChild(option);
}

const categoriaSelect = document.getElementById("categoria");
const tipoSelect = document.getElementById("tipo");

categoriaSelect.addEventListener("change", function() {
  liberarParcelas()
  if(categoriaSelect.value === "despesa") {
    
    document.getElementById("dataForm").style.cssText = "display:flex;"
    document.getElementById("checkData").checked = true

    
  }else {
   
    document.getElementById("dataForm").style.cssText = "display:none;"
    
  }
});

tipoSelect.addEventListener("change", function() {
  liberarParcelas()
});

function liberarParcelas() {
  if (categoriaSelect.value === "despesa" && tipoSelect.value === "variavel") {
    parcelado.removeAttribute("disabled")
   }else {
     parcelado.setAttribute("disabled", "true")
   }
}



document.getElementById("checkData").addEventListener("click", () => {
  let check = document.getElementById("checkData")

  if(check.checked === true) {
    document.getElementById("data").removeAttribute("disabled")
  }else if(check.checked === false) {
    document.getElementById("data").value = "0000-00-00"
    document.getElementById("data").setAttribute("disabled", "true")
  }
})



