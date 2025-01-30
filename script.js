

let selectDesStorage = sessionStorage.getItem("selectDespesa") // receitaSelect
let selectRecStorage = sessionStorage.getItem("selectReceita") // receitaSelect

if(selectDesStorage === null) {
  let despesaSelect = document.getElementById("despesaSelect").value 
  sessionStorage.setItem("selectDespesa", despesaSelect)
  location.reload()
}


if(selectRecStorage === null){
  let receitaSelect = document.getElementById("receitaSelect").value
  sessionStorage.setItem("selectReceita", receitaSelect)
  location.reload() 
}


let despesaSelect = document.getElementById("despesaSelect").value = selectDesStorage
let receitaSelect = document.getElementById("receitaSelect").value = selectRecStorage


const hoje = new Date(); 
const ano = hoje.getFullYear(); 
const dia = String(hoje.getDate()).padStart(2, '0');
const dataFormatada = `${ano}-${mes}-${dia}`; 


function carregarTransacoes() {
    const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
    const tabela = document.getElementById('tabela').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; // Limpar a tabela antes de preencher
  
    transacoes.forEach((transacao, i) => {
      const row = tabela.insertRow();
      
     
      let  transacoes = JSON.parse(localStorage.getItem("transacoes"))

      let somaReceitas = transacoes.reduce((total, e) => {
        if(e.categoria === "receita"){
          return total + parseFloat(e.valor); 
        }
       return total
      }, 0); 

      let somaDespesas = transacoes.reduce((total, e) => {
        if(e.categoria === "despesa"){
          return total + parseFloat(e.valor); 
        }
       return total
      }, 0); 

      
      let porcentagemR = ((transacao.valor/somaReceitas) * 100).toFixed(0)

      let porcentagemD = ((transacao.valor/somaDespesas) * 100).toFixed(0)
      


      if(transacao.categoria === 'receita'){
        
      row.innerHTML = `
      <tr>
        <td>${transacao.descricao}</td>
        <td>R$:${transacao.valor}</td>
        <td style="color:green; font-weight:bold;">${porcentagemR}%</td>
        <td>${transacao.categoria}</td>
        <td>${transacao.tipo}</td>
        <td style="color:green; font-weight:bold; ">${transacao.status}</td>
        <td><span class="delete-btn" onclick="editarTransacao(${transacao.id})"><i class="fas fa-edit"></i></span></td>
      </tr> 
      `;

    }else {


      row.innerHTML = `
      <tr>
        <td>${transacao.descricao}</td>
        <td> ${
          transacao.valor < 10 
          ? `R$:${transacao.valor.toFixed(2).replace(".", ",")}` 
          : (transacao.valor % 1 === 0 
              ? `R$:${(transacao.valor).toFixed(0).replace(".", ",")}` 
              : `R$:${(transacao.valor).toFixed(2).replace(".", ",")}`) 
        }</td>
        <td style="color:red; font-weight:bold;">${porcentagemD}%</td>
        <td>${transacao.categoria}</td>
        <td>${transacao.tipo}</td>
        <td style="color: ${
            transacao.status === 'Quitado' ? 'blue' :
            transacao.status === 'Aberto' ? 'darkorange' :
            transacao.status === 'Vencido' ? 'red' :
            'inherit'
        }; font-weight: bold; ">${transacao.status}</td>
        <td><span class="delete-btn" onclick="editarTransacao(${transacao.id})"><i class="fas fa-edit"></i></span></td>
      </tr> 
      `;

    }

    });


}
  
function carregarTransacoesDespesas() {
  
    const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
    let spanDespesa = document.getElementById("despesaDescricao")
    let spanValor = document.getElementById("despesaValor")
    let spanParcela = document.getElementById("despesaParcela")
    

    spanDespesa.innerHTML = ''; 
    spanValor.innerHTML = ''; 
    spanParcela.innerHTML = ''; 

    const despesaSelect = document.getElementById("despesaSelect");

    despesaSelect.addEventListener("change", function() {
      let select = despesaSelect.value
      sessionStorage.setItem("selectDespesa", select)
      location.reload()
    });
  
    transacoes.forEach((transacao, index) => {

      let select = sessionStorage.getItem("selectDespesa")
      
      let descricao = document.createElement("p")
      let valor = document.createElement("p")
      let parcela = document.createElement("p")
      
      descricao.style.marginTop = "10px"
      valor.style.marginTop = "10px"
      parcela.style.marginTop = "10px"

    if(transacao.tipo === select){
      if(transacao.categoria === 'despesa'){

          descricao.innerText = transacao.descricao
          valor.innerText = `-${transacao.valor}`
          parcela.innerText = `${transacao.parcela} x`

          spanDespesa.appendChild(descricao)
          spanValor.appendChild(valor)
          spanParcela.appendChild(parcela)
      }
    }
    });
}

function carregarTransacoesReceitas() {
  
  const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
  let spanReceita = document.getElementById("receitaDescricao")
  let spanValor = document.getElementById("receitaValor")

   spanReceita.innerHTML = ''; 
   spanValor.innerHTML = ''; 

   

  const receitaSelect = document.getElementById("receitaSelect");

  receitaSelect.addEventListener("change", function() {
    let select = receitaSelect.value
    console.log(select)
    sessionStorage.setItem("selectReceita", select)
    location.reload()
  });

  transacoes.forEach((transacao, index) => {

    let select = sessionStorage.getItem("selectReceita")
    let descricao = document.createElement("p")
    let valor = document.createElement("p")
    
    descricao.style.marginTop = "10px"
    valor.style.marginTop = "10px"

  if(transacao.tipo === select){
    if(transacao.categoria === 'receita'){

      descricao.innerText = transacao.descricao
      valor.innerText = transacao.valor

      spanReceita.appendChild(descricao)
      spanValor.appendChild(valor)
      
    }
  }
  
  });
}

function editarTransacao(i) {

   const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
       
   transacoes.forEach(element => {

    let optAtual = document.getElementById("optAtual");
    let selectStatus = document.getElementById("selectStatus");
    let nomeCelula = document.getElementById("nomeCelula");
    let valorCelula = document.getElementById("valorCelula");
    let tipoCelula = document.getElementById("tipoCelula");

    if (element.id === i) {
        // Formatação de valor com "R$" e vírgula
        let valorFormatado = `R$ ${(element.valor).toFixed(2).replace(".", ",")}`;

        if (element.status === "Entrada" || element.status === "Quitado") {
            selectStatus.setAttribute("disabled", "true");

            optAtual.innerText = element.status;
            optAtual.value = element.status;
            nomeCelula.value = element.descricao;
            valorCelula.value = valorFormatado;  // Aplica o valor formatado
            valorCelula.innerText = valorFormatado;  // Aplica o valor formatado também
            tipoCelula.value = element.categoria;
        } else {
            selectStatus.removeAttribute("disabled");

            optAtual.innerText = element.status;
            optAtual.value = element.status;
            nomeCelula.value = element.descricao;
            valorCelula.value = valorFormatado;  // Aplica o valor formatado
            valorCelula.innerText = valorFormatado;  // Aplica o valor formatado também
            tipoCelula.value = element.categoria;
        }
    }
});

      document.getElementById("excluirRegistro").addEventListener("click", () => {

        
        let index = transacoes.findIndex(transacao => transacao.id === i)
       // console.log(index)  
        if (index !== -1) { 
            transacoes.splice(index, 1); 
        }else {
           transacoes.length = 0
        }
  
        setTimeout(() => {
          localStorage.setItem('transacoes', JSON.stringify(transacoes));
          location.reload()
        }, 500);

      })
      

      document.getElementById("modalEditar").setAttribute("class", "modalEditarON") 

    // carregarTransacoes(); 
   // location.reload()
}
  
function exibirTotalReceitasF(){

  let receitaTotalFixa = document.getElementById("receitaTotalFixa")
  let  transacoes = JSON.parse(localStorage.getItem("transacoes"))
  if(transacoes){
    let somaReceitasFixas = transacoes.reduce((total, e) => {
      if (e.categoria === 'receita' && e.tipo === 'fixa') {
        return total + parseFloat(e.valor);
      }
      return total;
    }, 0); 
    receitaTotalFixa.innerHTML = `Fixa:R$ ${somaReceitasFixas}`;
  }
}

function exibirTotalReceitasV(){

  let receitaTotalVariavel = document.getElementById("receitaTotalVariavel")
  let  transacoes = JSON.parse(localStorage.getItem("transacoes"))
  if(transacoes){
    let somaReceitasVariaveis = transacoes.reduce((total, e) => {
      if (e.categoria === 'receita' && e.tipo === 'variavel') {
        return total + parseFloat(e.valor); 
      }
      return total;
    }, 0); 
    receitaTotalVariavel.innerHTML = `Variavel:R$ ${somaReceitasVariaveis}`;
  }
}

function exibirTotalReceitas(){

  let receitaTotal = document.getElementById("receitaTotal")
  let  transacoes = JSON.parse(localStorage.getItem("transacoes"))
  if(transacoes){
  let somaReceitas = transacoes.reduce((total, e) => {
    if(e.categoria === "receita"){
      return total + parseFloat(e.valor); 
    }
   return total
  }, 0); 

   receitaTotal.innerHTML = `Total:R$ ${somaReceitas}`;
  }
}

function exibirTotalDespesasF(){

  let despesaTotalFixa = document.getElementById("despesaTotalFixa")
  let  transacoes = JSON.parse(localStorage.getItem("transacoes"))
  if(transacoes){
  let somaDespesasFixas = transacoes.reduce((total, e) => {
    if (e.categoria === 'despesa' && e.tipo === 'fixa') {
      return total + parseFloat(e.valor);
    }
    return total;
  }, 0); 
  despesaTotalFixa.innerHTML = `Fixa:R$ -${somaDespesasFixas}`;
  }
}

function exibirTotalDespesasV(){

  let despesaTotalVariavel = document.getElementById("despesaTotalVariavel")
  let  transacoes = JSON.parse(localStorage.getItem("transacoes"))
  if(transacoes){
  let somaDespesasVariaveis = transacoes.reduce((total, e) => {
    if (e.categoria === 'despesa' && e.tipo === 'variavel') {
      return total + parseFloat(e.valor); 
    }
    return total;
  }, 0); 
  despesaTotalVariavel.innerHTML = `Variavel:R$ -${somaDespesasVariaveis}`;
 }
}

function exibirTotalDespesas(){

  let despesaTotal = document.getElementById("despesaTotal")
  let despesaTotalRedutor = document.getElementById("reduzirLucro")
  let  transacoes = JSON.parse(localStorage.getItem("transacoes"))
  if(transacoes){
  let somaDespesas = transacoes.reduce((total, e) => {
    if(e.categoria === "despesa"){
      return total + parseFloat(e.valor); 
    }
   return total
  }, 0); 

  let somaRedutor = transacoes.reduce((total, e) => {
    if(e.categoria === "despesa" && e.status === "Aberto" || e.status === "Vencido"){
      return total + parseFloat(e.valor); 
    }
   return total
  }, 0); 

  despesaTotal.innerHTML = `Total:R$ -${somaDespesas}`;
  despesaTotalRedutor.innerHTML = `R$: -${somaRedutor}`;
 }
}


function exibeLucro(){

  let receitaTotal = document.getElementById("receitaTotal").innerText
  let filtrarReceita = Number(receitaTotal.replace(/[^\d.]/g, ""))

  let despesaTotal = document.getElementById("despesaTotal").innerText
  let filtrarDespesa = Number(despesaTotal.replace(/[^\d.]/g, ""))

  // console.log(despesaTotal, filtrarDespesa, filtrarReceita)

  let somaTotal = filtrarReceita + (-filtrarDespesa)

  let total = document.getElementById("lucro")
    total.innerHTML = `R$: ${somaTotal}`

}




function filtroMes() {
    const meses = [
      "Selecione","Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const select = document.getElementById("mes");

    meses.forEach((mes, index) => {
      // console.log(mes, index)
      const option = document.createElement("option");
      option.value = String(index).padStart(2, '0');  
      option.textContent = mes; 
      select.appendChild(option); 
    });

    select.addEventListener("change", () => {
      console.log(select.value)
    })
}


filtroMes()

  carregarTransacoes();
  exibirTotalReceitasF();
  exibirTotalReceitasV();
  exibirTotalReceitas();
  exibirTotalDespesasF();
  exibirTotalDespesasV();
  exibirTotalDespesas();
  carregarTransacoesReceitas();
  carregarTransacoesDespesas();
  exibeLucro();





  document.getElementById("fecharModalEdicao").addEventListener("click", () => {
    document.getElementById("modalEditar").setAttribute("class", "modalOFF") 
  })





              
              
        
          document.getElementById('downloadJson').addEventListener('click', function() {

            let data = JSON.stringify(localStorage.getItem("transacoes"))
              const blob = new Blob([data], { type: 'application/json' });
  
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'Backup.json'; 
  
              link.click();
          });


     
          document.getElementById('uploadFile').addEventListener('change', function(event) {
            const file = event.target.files[0];  

            if (file && file.type === "application/json") {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        
                        const dados = JSON.parse(e.target.result)
                            
                        localStorage.setItem("transacoes", dados)

                        setTimeout(() => {
                          location.reload()
                        }, 800);


                    } catch (error) {
                        console.error('Erro ao processar o JSON:', error);
                        alert('Falha ao ler o JSON!');
                    }
                };

                reader.readAsText(file);
            } else {
                alert("Por favor, selecione um arquivo JSON válido.");
            }
        });


window.addEventListener("resize", () => {
  let altura = window.innerHeight;
  
  if(altura >= 622){
    let alturaMenuLateral = document.querySelector(".menu-lateral");
      alturaMenuLateral.style = "height:145%"
      
  }else {
    location.reload()
  }
})