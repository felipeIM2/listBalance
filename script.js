

import usuarios from '../usuario.js'


  window.addEventListener("load", () => {
      
    $(".linha").css({"width":"100%"})
    setTimeout(() => {
    
      $(".linha").css({"background-color":"transparent", "transition":".5s"})
      $("#tabela").css({"opacity":"1", "transition":" .5s"})
      $(".totalizadores").css({"opacity":"1", "transition":".5s"})
      $("#dataHoje").css({"opacity":"1", "transition":".5s"})

    }, 500);  

    let dataAtual = $("#dataHoje")
      const hoje = new Date();  
      const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');  
      const diaHoje = String(hoje.getDate()).padStart(2, '0');        
      const anoHoje = hoje.getFullYear();
     dataAtual.val(`${anoHoje}-${mesHoje}-${diaHoje}`)
     let verifyData = sessionStorage.getItem("filtroData")
     if(verifyData) sessionStorage.removeItem("filtroData")

      
  })


  let filtroData;
  let transacoes;
  let validadorDataHoje;

  function aplicarFiltroData() {

    filtroData = sessionStorage.getItem("filtroData")

    const hoje = new Date();  
    const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');  
    const diaHoje = String(hoje.getDate()).padStart(2, '0');        
    const anoHoje = hoje.getFullYear();
     validadorDataHoje = new Date(anoHoje, mesHoje - 1, diaHoje);

    if(filtroData){
      // Aqui, ao invés de usar mesHoje e anoHoje nas transações, vamos filtrar diretamente com filtroData
      transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
      transacoes = transacoes.filter(e => e.mesHoje.includes(filtroData));
    }else{
      transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
      filtroData = `${anoHoje}-${mesHoje}`
    }

  }
  aplicarFiltroData()


  
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChartR);
  google.charts.setOnLoadCallback(drawChartD);
  google.charts.setOnLoadCallback(drawChartT);
  
  function drawChartR() {
    let num1, num2, num3;
    
    // Calculando as receitas fixas, variáveis e totais
    if(transacoes){
      let somaReceitasFixas = transacoes.reduce((total, e) => {
        if (e.categoria === 'receita' && e.tipo === 'fixa' && e.mesHoje.includes(filtroData)) {
          return total + parseFloat(e.valor);
        }
        return total;
      }, 0); 
      num1 = somaReceitasFixas;
    }
    
    if(transacoes){
      let somaReceitasVariaveis = transacoes.reduce((total, e) => {
        if (e.categoria === 'receita' && e.tipo === 'variavel' && e.mesHoje.includes(filtroData)) {
          return total + parseFloat(e.valor); 
        }
        return total;
      }, 0); 
      num2 = somaReceitasVariaveis;
    }
  
    if(transacoes){
      let somaReceitas = transacoes.reduce((total, e) => {
        if(e.categoria === "receita" && e.mesHoje.includes(filtroData)){
          return total + parseFloat(e.valor); 
        }
        return total;
      }, 0); 
      num3 = somaReceitas;
    }
  
    document.getElementById("totalR").innerHTML = `Entradas: R$ ${num3.toFixed(2) || 0}`;
    
    let data = google.visualization.arrayToDataTable([
      ['Task', ''],
      ['Fixa', num1],
      ['Variavel', num2],
    ]);
  
    let options = {
      title: 'Receitas',
      is3D: true,
      colors: ['#66BB6A', '#388E3C'], // Verde para as receitas
      legend: 'none'
    };
  
    var chart = new google.visualization.PieChart(document.getElementById('piechartR'));
    chart.draw(data, options);
  }
  
  
  function drawChartD() {
    let num1, num2, num3;
    
    // Calculando as despesas fixas, variáveis e totais
    if(transacoes){
      let somaDespesasFixas = transacoes.reduce((total, e) => {
        if (e.categoria === 'despesa' && e.tipo === 'fixa' && e.mesHoje.includes(filtroData)) {
          return total + parseFloat(e.valor);
        }
        return total;
      }, 0); 
      num1 = somaDespesasFixas;
    }
    
    if(transacoes){
      let somaDespesasVariaveis = transacoes.reduce((total, e) => {
        if (e.categoria === 'despesa' && e.tipo === 'variavel' && e.mesHoje.includes(filtroData)) {
          return total + parseFloat(e.valor); 
        }
        return total;
      }, 0); 
      num2 = somaDespesasVariaveis;
    }
    
    if(transacoes){
      let somaDespesas = transacoes.reduce((total, e) => {
        if(e.categoria === "despesa" && e.mesHoje.includes(filtroData)){
          return total + parseFloat(e.valor); 
        }
        return total;
      }, 0); 
      num3 = somaDespesas;
    }
  
    document.getElementById("totalD").innerHTML = `Saídas: R$ ${num3.toFixed(2) || 0}`;
    
    let data = google.visualization.arrayToDataTable([
      ['Task', ''],
      ['Fixa', num1],
      ['Variavel', num2],
    ]);
  
    let options = {
      title: 'Despesas',
      is3D: true,
      colors: ['#D32F2F', '#940707'], // Vermelho para as despesas
      legend: 'none'
    };
  
    var chart = new google.visualization.PieChart(document.getElementById('piechartD'));
    chart.draw(data, options);
  }
  
  
  function drawChartT() {
    let num1, num2, num3, num4;
    
    // Calculando o lucro/negativo e entradas
    if(transacoes){
      let somaTotal = transacoes.reduce((total, e) => {
        if (e.categoria === "receita" && e.mesHoje.includes(filtroData)) {
          total.receitas += e.valor; 
        } else if (e.categoria === "despesa" && e.mesHoje.includes(filtroData)) {
          total.despesas += e.valor; 
        }
        return total; 
      }, { receitas: 0, despesas: 0 }); 
  
      let totalFinal = somaTotal.receitas - somaTotal.despesas;
      
      if(totalFinal < 0){
        num3 = (totalFinal + (- totalFinal) * 2); // Ajuste para negativo
      } else {
        num1 = totalFinal; // Lucro
      }
    }
  
    if(transacoes){
      let somaRedutor = transacoes.reduce((total, e) => {
        if(e.categoria === "despesa" && e.mesHoje.includes(filtroData) && (e.status === "Aberto" || e.status === "Vencido")){
          return total + parseFloat(e.valor); 
        }
        return total;
      }, 0); 
      num2 = somaRedutor;
    }
    
    if(transacoes){
      let somaReceitas = transacoes.reduce((total, e) => {
        if(e.categoria === "receita" && e.mesHoje.includes(filtroData)){
          return total + parseFloat(e.valor); 
        }
        return total;
      }, 0); 
      
      num4 = somaReceitas;
    }
  
    document.getElementById("totalN").innerHTML = `Pendente: R$ ${num2.toFixed(2) || 0}`;

    if(num4 === num1) num4 = 0;

    if(num3) num4 = 0;
    
    let data = google.visualization.arrayToDataTable([
      ['Task', ''],
      ['Lucro', num1],  
      ['Negativo', num3],
      ['Entrada', num4],
    ]);
  
    let options = {
      title: 'Lucro/Negativo',
      is3D: true,
      colors: ['#66BB6A', '#FF7043', '#1E88E5'], // Verde para lucro, laranja para negativo, azul para entrada
      legend: 'none'
    };
  
    var chart = new google.visualization.PieChart(document.getElementById('piechartT'));
    chart.draw(data, options);
  }
  
  



    // const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
    let validadorDataVencimento;

  function validaVencimento(){

    let achou;
   
    transacoes.forEach(e => {
     
      if (e.vencimento != "Sem Vencimento" && e.status === "Aberto") { 

        const vencimentoSemBarras = e.vencimento.replace(/\//g, '');  
        let dia = vencimentoSemBarras.substring(0, 2); 
        let mes = vencimentoSemBarras.substring(2, 4); 
        let ano = vencimentoSemBarras.substring(4, 8);

        validadorDataVencimento = new Date(ano, mes - 1, dia);
          // console.log(validadorDataHoje, validadorDataVencimento)
        

        if(validadorDataHoje > validadorDataVencimento){
         
          e.status = "Vencido"
          localStorage.setItem('transacoes', JSON.stringify(transacoes));
          achou = 1
        }


      }
    });

    if(achou === 1){
      alert("Foram alterados itens para o status vencido! ")
  
    }

  }

  function carregarTransacoes() {
    // const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
    const tabela = $('#tabela').find('tbody')[0];
    tabela.innerHTML = ''; 

    let transacoesFiltradas = [...transacoes]; 

    function aplicarFiltros() {

      let recDescricao = $('#descricao').val().toLowerCase();
      let recValor = $('#valor').val().toLowerCase();
      let recStatus = $('#status').val().toLowerCase();
      let recCategoria = $('#categoria').val().toLowerCase();
      let recTipo = $('#tipo').val().toLowerCase();
      let recParcelado = $('#parcelado').val().toLowerCase();
      let recVencimento = $('#vencimento').val().toLowerCase();
        

      if (recParcelado.includes("0")) {
        recParcelado = "sem parcela";
      }
      

      function matchField(value, search) {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(search);
        } else if (typeof value === 'number') {
          return String(value).includes(search);
        }
        return false;
      }

      transacoesFiltradas = transacoes.filter((transacao) => {
        return matchField(transacao.descricao, recDescricao) &&
          matchField(transacao.valor, recValor) &&
          matchField(transacao.status, recStatus) &&
          matchField(transacao.categoria, recCategoria) &&
          matchField(transacao.tipo, recTipo) &&
          matchField(transacao.parcelado, recParcelado) &&
          matchField(transacao.vencimento, recVencimento);
      });


        if (transacoesFiltradas.length === 0) {
          $("#alertaPesquisa").addClass("alertaPesquisaOn").removeClass("alertaPesquisaOff");
        } else {
          $("#alertaPesquisa").addClass("alertaPesquisaOff").removeClass("alertaPesquisaOn");
        }

      
    
      renderizarTabela(transacoesFiltradas);
    }

    $("#limpar").on("click", () => {

      $('#descricao').val('');
      $('#valor').val('');
      $('#status').val('');
      $('#categoria').val('');
      $('#tipo').val('');
      $('#parcelado').val('');
      $('#vencimento').val('');


      aplicarFiltros()
      

    })

    $('#tabela').on('input change', function(e) {
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
          if (e.categoria === "despesa" && e.mesHoje.includes(filtroData)) return total + parseFloat(e.valor);
          return total;
        }, 0); 

        let porcentagemR = ((transacao.valor / somaReceitas) * 100).toFixed(1);
        let porcentagemD = ((transacao.valor / somaDespesas) * 100).toFixed(1);
        
        const row = tabela.insertRow();
          // console.log(transacao.mesHoje, filtroData)
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
              <td style="font-weight:bold; text-align:center;">1x</td> 
              <td style="font-weight:bold; text-align:center;">${transacao.parcelado}</td>
              <td >${transacao.vencimento}</td>
              <td><span class="editar"><i class="fas fa-edit" id="${transacao.id}"></i></span></td>
            </tr>
          `;
        } else if(transacao.mesHoje.includes(filtroData)) {
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
              <td style="font-weight:bold; text-align:center;">${transacao.parcelado}x</td>
              <td style="font-weight:bold; text-align:center;">${transacao.parcela}</td>
              <td>${transacao.vencimento}</td>
              <td><span class="editar" ><i class="fas fa-edit" id="${transacao.id}"></i></span></td>
            </tr>
          `;
        }
      });

      
      $(".editar").on("click", (e) => {editarTransacao(e.target.id)}) 
      
    }
    renderizarTabela(transacoes);
    


    function editarTransacao(i) {
      
      const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
          
        transacoes.forEach(element => {
  
          let optAtual = $("#optAtual");
          let selectStatus = $("#selectStatus");
          let nomeCelula = $("#nomeCelula");
          let valorCelula = $("#valorCelula")
          
          let tipoCelula = $("#tipoCelula");
           
          if (element.id === Number(i)) {
            
              let valorFormatado = `${(element.valor).toFixed(2).replace(".", ",")}`;
                
              if (element.status === "Entrada" || element.status === "Quitado") {
                selectStatus.attr("disabled", "true");
  
                optAtual.text(element.status);          
                optAtual.val(element.status);           
                nomeCelula.val(element.descricao);      
                valorCelula.val(valorFormatado);              
                tipoCelula.val(element.categoria);   
                  
                
              } else {
                 selectStatus.removeAttr("disabled");
               
                 optAtual.text(element.status);        
                 optAtual.val(element.status);         
                 nomeCelula.val(element.descricao);    
                 valorCelula.val(valorFormatado);       
                 tipoCelula.val(element.categoria);    
                 
                 
              }
          }
      });
  
      $("#excluirRegistro").on("click", () => {
  
            let index = transacoes.findIndex(transacao => transacao.id === Number(i))
          
              console.log(transacoes[index])

            if(transacoes[index].parcelado && transacoes[index].parcelado !== undefined){
              console.log(transacoes[index].parcelado)
            }




            if (index !== -1) { 
              transacoes.splice(index, 1); 
              
            }
           
  
            // setTimeout(() => {
            //   localStorage.setItem('transacoes', JSON.stringify(transacoes));
            //   setTimeout(() => {
            //     $("#modalEditar").attr("class", "modalOFF") 
            //       aplicarFiltroData()
            //       carregarTransacoes()
            //       drawChartD()
            //       drawChartR()
            //       drawChartT()
            //   }, 200);
            // }, 200);
  
          })
  
          $("#salvarEdicao").on("click", () => { 
            
            let index = transacoes.findIndex(transacao => transacao.id === Number(i))
  
            if(index !== -1){
              let status = $("#selectStatus").val()
              let valor = $("#valorCelula").val().replace(",", ".")
             
              transacoes[index] = {
                ...transacoes[index], 
                status: String(status),  
                valor: Number(valor)     
              }
  
              setTimeout(() => {
                localStorage.setItem('transacoes', JSON.stringify(transacoes));
                setTimeout(() => {
                  $("#modalEditar").attr("class", "modalOFF") 
                    aplicarFiltroData()
                    carregarTransacoes()
                    drawChartD()
                    drawChartR()
                    drawChartT()
                }, 200);
              }, 200);
  
            }
  
          })
      $("#modalEditar").attr("class", "modalEditarON") 
    }

  }

  setTimeout(() => {validaVencimento(), carregarTransacoes()}, 1600);
  carregarTransacoes()

 $(".editar").on("click", (e) => {editarTransacao(e.target.id)}) 
 
  $("#fecharModalEdicao").on("click", () => {
    $("#modalEditar").attr("class", "modalOFF") 
  })



  $("#filtro").on("click", () => {  
      
    console.log("1")

    let filtro = $(".pesquisa-container");
    
    if (filtro.length === 0) {
      $(".pesquisa-containerOn").each(function() {
        $(this).removeClass("pesquisa-containerOn").addClass("pesquisa-container");
      });
    }
    filtro.each(function() {
      if ($(this).hasClass('pesquisa-container')) {
        $(this).removeClass('pesquisa-container').addClass('pesquisa-containerOn');
      }
    });
  });


  $("#outros").on("click", () => {


    let item = $(".opcoes")
    // console.log(item[0])
    let estilos = window.getComputedStyle(item[0])
    let display = estilos.getPropertyValue("display")
      
    if(display === "none"){

      item[0].style.cssText = "display:block; opacity:0; transition:.4s;"
      setTimeout(() => {
        item[0].style.cssText = "display:block; opacity:1; transition:.4s;"
      }, 200);

    }else {
        item[0].style.cssText = "display:block; opacity:0; transition:.4s;"
        setTimeout(() => {
          item[0].style.cssText = "display:none; opacity:0; transition:.4s;"
      }, 200);
    }
    
  })

  
  $('#downloadJson').on('click', function() {

    let data = localStorage.getItem("transacoes")
      console.log(data)
      const blob = new Blob([data], { type: 'application/json' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Backup.json'; 

      link.click();
  });

  $('#uploadFile').on('change', function(event) {
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

  function exibePessoa() {
    let pessoa =  $("#selectPessoa")
    usuarios.forEach(element => {
      let opt = document.createElement("option")
      opt.value = element.nome
  
      pessoa.append(opt)
    });
  }
  exibePessoa()

  function exibeMes() {
    let mes =  $("#selectMes")
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    meses.forEach((mes1, index) => {
      let option = document.createElement("option");
      option.value = index + 1; 
      option.textContent = mes1; 
      mes.append(option); 
    });

  }
  exibeMes()




  $("#dataHoje").on("input", (e) => {

    $(".linha").css({"width":"0%"})

    setTimeout(() => {
      $(".linha").css({"width":"100%", "background-color":"rgba(202, 201, 201, 0.705)"})

      setTimeout(() => {
        $(".linha").css({"background-color":"transparent", "transition":".5s"})
      }, 500); 

    }, 500); 
   
 
    const hoje = new Date();  
    const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');  
    const diaHoje = String(hoje.getDate()).padStart(2, '0');        
    const anoHoje = hoje.getFullYear();

    let dataAtual = e.target.value
    if(dataAtual !== `${anoHoje}-${mesHoje}-${diaHoje}`){
      sessionStorage.setItem("filtroData", dataAtual)
      aplicarFiltroData()
      drawChartD()
      drawChartR()
      drawChartT()
      carregarTransacoes()
    }else {
      sessionStorage.removeItem("filtroData")
      aplicarFiltroData()
      drawChartD()
      drawChartR()
      drawChartT()
      carregarTransacoes()
    }
  })











