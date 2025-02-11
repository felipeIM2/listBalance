

let selectDesStorage = sessionStorage.getItem("selectDespesa") // receitaSelect
let selectRecStorage = sessionStorage.getItem("selectReceita") // receitaSelect

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

      
      let porcentagemR = ((transacao.valor/somaReceitas) * 100).toFixed(1)

      let porcentagemD = ((transacao.valor/somaDespesas) * 100).toFixed(1)
      


      if(transacao.categoria === 'receita'){
        
      row.innerHTML = `
      <tr>
        <td>${transacao.descricao}</td>
                <td> ${
          transacao.valor < 10 
          ? `R$: ${transacao.valor.toFixed(2).replace(".", ",")}` 
          : (transacao.valor % 1 === 0 
              ? `R$: ${(transacao.valor).toFixed(0).replace(".", ",")}` 
              : `R$: ${(transacao.valor).toFixed(2).replace(".", ",")}`) 
        }</td>
        <td style="color:green; font-weight:bold;">${porcentagemR}%</td>
        <td>${transacao.categoria}</td>
        <td>${transacao.tipo}</td>
        <td style="color:green; font-weight:bold; ">${transacao.status}</td>
        <td style=" font-weight:bold; text-align:center;">Sem parcela</td>
        <td><span onclick="editarTransacao(${transacao.id})"><i class="fas fa-edit" style="margin-left:20px;"></i></span></td>
      </tr> 
      `;

    }else {


      row.innerHTML = `
      <tr>
        <td>${transacao.descricao}</td>
        <td> ${
          transacao.valor < 10 
          ? `R$: ${transacao.valor.toFixed(2).replace(".", ",")}` 
          : (transacao.valor % 1 === 0 
              ? `R$: ${(transacao.valor).toFixed(0).replace(".", ",")}` 
              : `R$: ${(transacao.valor).toFixed(2).replace(".", ",")}`) 
        }</td>
        <td style="color:red; font-weight:bold;">${porcentagemD}%</td>
        <td>${transacao.categoria}</td>
        <td>${transacao.tipo}</td>
        <td style="color: ${
            transacao.status === 'Quitado' ? 'darkcyan' :
            transacao.status === 'Aberto' ? 'darkorange' :
            transacao.status === 'Vencido' ? 'red' :
            'inherit'
        }; font-weight: bold; ">${transacao.status}</td>
        <td style="font-weight:bold; text-align:center;">${transacao.parcela}x</td>  
        <td><span onclick="editarTransacao(${transacao.id})"><i class="fas fa-edit" style="margin-left:20px;"></i></span></td>
      </tr> 
      `;

    }

    });


}
carregarTransacoes();

function editarTransacao(i) {

   const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
       
   transacoes.forEach(element => {

    let optAtual = document.getElementById("optAtual");
    let selectStatus = document.getElementById("selectStatus");
    let nomeCelula = document.getElementById("nomeCelula");
    let valorCelula = document.getElementById("valorCelula");
    let tipoCelula = document.getElementById("tipoCelula");

    if (element.id === i) {
        
        let valorFormatado = `${(element.valor).toFixed(2).replace(".", ",")}`;

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

}
  
  


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


  document.getElementById("outros").addEventListener("click", () => {

     let item = document.querySelector(".opcoes")
     let estilos = window.getComputedStyle(item)
     let display = estilos.getPropertyValue("display")
     console.log("")

     if(display === "none"){

      item.style.cssText = "display:block; opacity:0; transition:.4s;"
      setTimeout(() => {
         item.style.cssText = "display:block; opacity:1; transition:.4s;"
      }, 200);

     }else {
        item.style.cssText = "display:block; opacity:0; transition:.4s;"
        setTimeout(() => {
          item.style.cssText = "display:none; opacity:0; transition:.4s;"
       }, 200);
     }
    

     
  })




