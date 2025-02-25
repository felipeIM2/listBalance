 

  function carregarTransacoes() {
    const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
    const tabela = document.getElementById('tabela').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; 

    let transacoesFiltradas = [...transacoes]; 

    function aplicarFiltros() {
      let recDescricao = document.getElementById('descricao').value.toLowerCase();
      let recValor = document.getElementById('valor').value.toLowerCase();
      let recStatus = document.getElementById('status').value.toLowerCase();
      let recCategoria = document.getElementById('categoria').value.toLowerCase();
      let recTipo = document.getElementById('tipo').value.toLowerCase();
      let recParcelado = document.getElementById('parcelado').value.toLowerCase();
      let recVencimento = document.getElementById('vencimento').value.toLowerCase();
        
      transacoesFiltradas = transacoes.filter((transacao) => {
      
        if(recParcelado.includes("0")){
          recParcelado = "sem parcela"
        }

        let descricaoMatch = transacao.descricao.toLowerCase().includes(recDescricao);
        let valorMatch = String(transacao.valor).includes(recValor);
        let statusMatch = transacao.status.toLowerCase().includes(recStatus);
        let categoriaMatch = transacao.categoria.toLowerCase().includes(recCategoria);
        let tipoMatch = transacao.tipo.toLowerCase().includes(recTipo);
        let parcelaMatch = transacao.parcela.toString().toLowerCase().includes(recParcelado);
        let vencimentoMatch = transacao.parcela.toString().toLowerCase().includes(recVencimento);

        return descricaoMatch && valorMatch && statusMatch && categoriaMatch && tipoMatch && parcelaMatch && vencimentoMatch;
      });


        if(transacoesFiltradas.length === 0){
          document.getElementById("alertaPesquisa").setAttribute("class", "alertaPesquisaOn")
        }else {
          document.getElementById("alertaPesquisa").setAttribute("class", "alertaPesquisaOff")
        }
      renderizarTabela(transacoesFiltradas);
    }

    document.getElementById("limpar").addEventListener("click", () => {

      document.getElementById('descricao').value = ''
      document.getElementById('valor').value = ''
      document.getElementById('status').value = ''
      document.getElementById('categoria').value = ''
      document.getElementById('tipo').value = ''
      document.getElementById('parcelado').value = ''
      document.getElementById('vencimento').value = ''

      aplicarFiltros()

    })

    document.querySelector("#tabela").addEventListener("input", (e) => {
      if (e.target.id) {
        aplicarFiltros(); 
      }
    });

    document.querySelector("#tabela").addEventListener("change", (e) => {
      if (e.target.id) {
        aplicarFiltros(); 
      }
    });


    function renderizarTabela(transacoes) {

      tabela.innerHTML = '';  

      transacoes.forEach((transacao) => {
        let somaReceitas = transacoes.reduce((total, e) => {
          if (e.categoria === "receita") return total + parseFloat(e.valor);
          return total;
        }, 0); 

        let somaDespesas = transacoes.reduce((total, e) => {
          
          if (e.categoria === "despesa") return total + parseFloat(e.valor);
          return total;
        }, 0); 

        let porcentagemR = ((transacao.valor / somaReceitas) * 100).toFixed(1);
        let porcentagemD = ((transacao.valor / somaDespesas) * 100).toFixed(1);

        const row = tabela.insertRow();
        if (transacao.categoria === 'receita') {
          row.innerHTML = `
            <tr>
              <td style="text-align:left !important;">${transacao.descricao}</td>
              <td style="text-align:left !important;">
                ${transacao.valor < 10 
                  ? `R$: ${transacao.valor.toFixed(2).replace(".", ",")}` 
                  : (transacao.valor % 1 === 0 
                      ? `R$: ${(transacao.valor).toFixed(0).replace(".", ",")}` 
                      : `R$: ${(transacao.valor).toFixed(2).replace(".", ",")}`)}
              </td>
              <td style="color:green; font-weight:bold;">${porcentagemR}%</td>
              <td>${transacao.categoria}</td>
              <td>${transacao.tipo}</td>
              <td style="color:green; font-weight:bold;">${transacao.status}</td>
              <td style="font-weight:bold; text-align:center;">Sem parcela</td>
              <td >${transacao.vencimento}</td>
              <td><span onclick="editarTransacao(${transacao.id})"><i class="fas fa-edit"></i></span></td>
            </tr>
          `;
        } else {
          row.innerHTML = `
            <tr>
              <td style="text-align:left !important;">${transacao.descricao}</td>
              <td style="text-align:left !important;">
                ${transacao.valor < 10 
                  ? `R$: ${transacao.valor.toFixed(2).replace(".", ",")}` 
                  : (transacao.valor % 1 === 0 
                      ? `R$: ${(transacao.valor).toFixed(0).replace(".", ",")}` 
                      : `R$: ${(transacao.valor).toFixed(2).replace(".", ",")}`)}
              </td>
              <td style="color:red; font-weight:bold;">${porcentagemD}%</td>
              <td>${transacao.categoria}</td>
              <td>${transacao.tipo}</td>
              <td style="color:${
                transacao.status === 'Quitado' ? 'darkcyan' :
                transacao.status === 'Aberto' ? 'darkorange' :
                transacao.status === 'Vencido' ? 'red' : 'inherit'
              }; font-weight: bold;">${transacao.status}</td>
              <td style="font-weight:bold; text-align:center;">${transacao.parcela}x</td>
              <td>${transacao.vencimento}</td>
              <td><span onclick="editarTransacao(${transacao.id})"><i class="fas fa-edit"></i></span></td>
            </tr>
          `;
        }
      });
    }
    renderizarTabela(transacoes);
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

        document.getElementById("salvarEdicao").addEventListener("click", () => { 
          
          let index = transacoes.findIndex(transacao => transacao.id === i)

          if(index !== -1){
            let status = document.getElementById("selectStatus").value
            let valor = document.getElementById("valorCelula").value.replace(",", ".")
           
            transacoes[index] = {
              ...transacoes[index], 
              status: String(status),  
              valor: Number(valor)     
            }

            setTimeout(() => {
              localStorage.setItem('transacoes', JSON.stringify(transacoes));
              setTimeout(() => {
                location.reload()
              }, 600);
            }, 600);

          }

        })
        

        document.getElementById("modalEditar").setAttribute("class", "modalEditarON") 

  }

  
  document.getElementById("fecharModalEdicao").addEventListener("click", () => {
    document.getElementById("modalEditar").setAttribute("class", "modalOFF") 
  })

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

  document.getElementById("filtro").addEventListener("click", () => {
    let filtro = document.querySelectorAll(".pesquisa-container")
  if(filtro.length === 0 ){
    let filtro = document.querySelectorAll(".pesquisa-containerOn")
      filtro.forEach(e => {
        e.className = "pesquisa-container"
      });

    }
    filtro.forEach(e => {
      
      if(e.className === "pesquisa-container"){
        e.className = "pesquisa-containerOn"
      } 
   });
    
  })


  document.getElementById('downloadJson').addEventListener('click', function() {

    let data = localStorage.getItem("transacoes")
      console.log(data)
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
                    console.log(JSON.stringify(dados))
                localStorage.setItem("transacoes", JSON.stringify(dados))

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



  const hoje = new Date(); 
  const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');  
  const diaHoje = String(hoje.getDate()).padStart(2, '0');        
  const anoHoje = hoje.getFullYear()

 
