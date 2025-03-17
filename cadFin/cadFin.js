import usuarios from '../usuario.js';

function exibePessoa() {
  let pessoa = $("#pessoa");
  usuarios.forEach(element => {
    let opt = $("<option></option>").text(element.nome);
    pessoa.append(opt);
  });
}
exibePessoa();

$("#adicionar").click(() => {
  const descricao = $('#descricao').val();
  const valor = parseFloat($('#valor').val());

  sessionStorage.setItem("valorIntegral", valor)

  if (!descricao || isNaN(valor)) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  const categoria = $('#categoria').val();
  const tipo = $('#tipo').val();

  let pessoa = $("#pessoa").val();

  const hoje = new Date();
  let mesHoje = hoje.getMonth() + 1;
  const anoHoje = hoje.getFullYear();

  let check = $("#checkData");
  let vencimento;

  if (check.prop('checked') === true) {
    let vencimentoData = $("#data").val();
    var [ano, mes, dia] = vencimentoData.split('-').map(Number);

    if (!dia || !mes || ano < anoHoje) {
      return alert("Favor inserir as informações do campo Vencimento corretamente!");
    } else {
      if (mes < 10) { mes = `0${mes}`; }
      if (dia < 10) { dia = `0${dia}`; }
      vencimento = `${dia}/${mes}/${ano}`;
    }
  } else {
    vencimento = "Sem Vencimento";
  }

  let status;
  let parcela;
  let totalParcelas = parseInt($("#parcelado").val());

  if (categoria === "receita") {
    status = "Entrada";
    parcela = "1";
  } else if (categoria === "despesa") {
    status = "Aberto";
    parcela = totalParcelas > 1 ? `1/${totalParcelas}` : "1/1";
    if (tipo === "fixa") {
      parcela = "1/1"; 
    }
  }

  let id = new Date().getTime(); 
  
  if (totalParcelas > 1 && categoria === "despesa") {
    if (vencimento === "Sem Vencimento") { 
      return alert('Favor indicar o dia do vencimento no campo "Vencimento" ');
    }

    let valorParcela = valor / totalParcelas;
    let parcelas = [];
    
    function getMaxDiasDoMes(mes, ano) {
      const diasPorMes = [31, (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      return diasPorMes[mes - 1];
    }

    for (let i = 0; i < totalParcelas; i++) {

      const diaHoje = String(hoje.getDate()).padStart(2, '0');

      let mesParcela = mes + i;
      let anoParcela = ano;
      
      if (mesParcela > 12) {
        anoParcela += Math.floor((mesParcela - 1) / 12); 
        mesParcela = (mesParcela - 1) % 12 + 1;
      }

      let maxDiasMes = getMaxDiasDoMes(mesParcela, anoParcela); 
      let vencimentoDia = vencimento ? parseInt(vencimento.split('/')[0]) : 31;

      if (vencimentoDia > maxDiasMes) {
        vencimentoDia = maxDiasMes;
      }

      let vencimentoFormatado = `${String(vencimentoDia).padStart(2, '0')}/${String(mesParcela).padStart(2, '0')}/${anoParcela}`;
      
      let dataMesHoje = mesHoje + i;
      let dataAnoHoje = anoHoje;

      if (mesParcela > 12) {
        dataMesHoje += Math.floor((dataMesHoje - 1) / 12); 
        dataAnoHoje = (dataAnoHoje - 1) % 12 + 1;
      }
      let mesFormatado = String(dataMesHoje).padStart(2, '0');

      parcelas.push({
        descricao,
        valor: Number(valorParcela.toFixed(2)),
        categoria,
        tipo,
        pessoa,
        vencimento: vencimentoFormatado,
        status: "Aberto",
        parcela: `${i + 1}/${totalParcelas}`,
        parcelado: totalParcelas,
        mesHoje: `${dataAnoHoje}-${mesFormatado}-${diaHoje}`,
        id: id + i,
        alterado:false
      });
    }

    sessionStorage.setItem('parcelasTemp', JSON.stringify(parcelas));

  } else {
    const diaHoje = String(hoje.getDate()).padStart(2, '0');  
    mesHoje = String(mesHoje).padStart(2, '0');
    const transacao = {
      id,
      descricao,
      valor,
      categoria,
      tipo,
      pessoa,
      parcela,
      parcelado: totalParcelas,
      mesHoje: `${anoHoje}-${mesHoje}-${diaHoje}`,
      vencimento,
      status
    };
    
    setTimeout(() => {
      const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
      transacoes.push(transacao);
      localStorage.setItem('transacoes', JSON.stringify(transacoes));
      alert("Novo Registro adicionado com Sucesso!");
    }, 400);
  }

  if(categoria === "despesa" && totalParcelas > 1){
    mostrarModal();
  }

  if(totalParcelas <= 1){
    $('#descricao').val('');
    $('#valor').val('');
    $('#data').val('');
  }

});

// Função para exibir o modal de confirmação de parcelas
function mostrarModal() {
  const parcelas = JSON.parse(sessionStorage.getItem('parcelasTemp'));

  $(".container").hide();

  let modalContent = `
    <table>
      <div style="margin-bottom:20px">
        <button id="gravarParcelas" style="color:green; font-weight:bold;">Gerar Parcelas</button>
        <button id="cancelarParcelas" style="color:red; font-weight:bold;">Cancelar</button></div>
      </div>
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Valor</th>
          <th>Vencimento</th>
          <th>Parcelado</th>
          <th>Parcela</th>
        </tr>
      </thead>
      <tbody>
  `;

  parcelas.forEach(parcela => {
    modalContent += `
      <tr>
        <td>${parcela.descricao}</td>
        <td>${parcela.valor.toFixed(2)}</td>
        <td>${parcela.vencimento}</td>
        <td>${parcela.parcelado}x</td>
        <td>${parcela.parcela}</td>
        <td><button class="editarParcela">Editar</button></td>
      </tr>
    `;
  });

  modalContent += `</tbody></table>`;
  setTimeout(() => {
    $('#modalContent').html(modalContent);
    $('#modal').show();

    $("#gravarParcelas").click(() => {

      const parcelas = JSON.parse(sessionStorage.getItem('parcelasTemp'));
      const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
      transacoes.push(...parcelas);
      localStorage.setItem('transacoes', JSON.stringify(transacoes));
      sessionStorage.removeItem('parcelasTemp');

      $('#descricao').val('');
      $('#valor').val('');
      $('#data').val('');

      alert('Parcelas gravadas com sucesso!');
      $('#modal').hide();
      $(".container").show();
    });

    $("#cancelarParcelas").on("click", () => {
      sessionStorage.removeItem('parcelasTemp'); 
      $('#modal').hide();
      $(".container").show();
    });

    $(document).on("click", ".editarParcela", function() {

      const index = $(this).closest('tr').index();
      const parcela = parcelas[index];
      
      // Função para formatar a data de 'dd/mm/yyyy' para 'yyyy-mm-dd'
      function formatarDataParaInput(data) {
        const [dia, mes, ano] = data.split('/');  // Divide a data em dia, mês e ano
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;  // Formata para 'yyyy-mm-dd'
      }
      
      // Exibe campos editáveis
      const editModalContent = `
      <div class="editarParcela">
          <div>
            <label for="editDescricao">Descrição:</label>
            <input type="text" id="editDescricao" value="${parcela.descricao}" />
          </div>
          <div>
            <label for="editValor">Valor:</label>
            <input type="number" id="editValor" value="${parcela.valor}" />
          </div>
          <div>
            <label for="editVencimento">Vencimento:</label>
            <input type="date" id="editVencimento" value="${formatarDataParaInput(parcela.vencimento)}" />
          </div>
          <button id="salvarEdicao">Salvar</button>
          <button id="cancelarEdicao">Cancelar</button>
        </div>
      `;

      
      $('#modalContent').html(editModalContent);
      

      $("#salvarEdicao").click(function() {

        const novoDescricao = $("#editDescricao").val();
        const novoValor = parseFloat($("#editValor").val());
        const novoVencimento = $("#editVencimento").val();
    
        let valorIntegral = sessionStorage.getItem("valorIntegral");
    
        // Verificar se o valor inserido é menor que o valor integral
        if (Number(novoValor) >= Number(valorIntegral)) {
            return alert("Favor inserir um valor de parcela menor que o valor total do registro!");
        }
    
        if (isNaN(novoValor) || !novoDescricao || !novoVencimento) {
            alert("Preencha todos os campos corretamente!");
            return;
        }
    
        const [dia, mes, ano] = novoVencimento.split('-');
        const diaFormatado = dia.padStart(2, '0');
        const mesFormatado = mes.padStart(2, '0');
        const vencimentoFormatado = `${ano}/${mesFormatado}/${diaFormatado}`;
    
        // Recalcular parcelas restantes
        const valorRestante = valorIntegral - novoValor; // valor integral menos o valor da parcela alterada

        let valorRestantePorParcela;
        if(!parcela.alterado){
          valorRestantePorParcela =  valorRestante / (parcela.parcelado - 1); // rateio entre as parcelas restantes
        }
       
    
        const novasParcelas = [];
        for (let i = 0; i < parcela.parcelado; i++) {

          if (i === index) { // Se for a parcela que foi alterada
            console.log("1")
            novasParcelas.push({
                ...parcela,
                descricao: novoDescricao,
                valor: novoValor, // valor da parcela alterada
                vencimento: vencimentoFormatado,
                alterado: true
            });
        } else {
          console.log("0")
            // Verifica se a parcela não foi alterada anteriormente
            if (!parcela.alterado) {
                novasParcelas.push({
                    ...parcela,
                    valor: valorRestantePorParcela, // valor redistribuído para as parcelas restantes
                });
            } else {
                // Se a parcela já foi alterada, mantém o valor original
                novasParcelas.push({
                    ...parcela
                });
            }
        }

        }

        console.log(novasParcelas)
         sessionStorage.setItem('parcelasTemp', JSON.stringify(novasParcelas));
    
        // setTimeout(() => {
        //     $('#modal').hide();
        //     mostrarModal();
        //     //alert("Parcela editada com sucesso!");
        // }, 600);
    });


      $("#cancelarEdicao").click(function() {
        $('#modal').hide();
        mostrarModal();
      });

    });
  }, 400);
}

$("#cancelar").click(() => location = "../index.html");

$(document).ready(() => {
  $('body').append(`
    <div id="modal" style="display:none">
      <h1 style="color:white; font-size:40px">Gerar Parcelas</h1>
      <div id="modalContent"></div>
    </div>
  `);
});

$("#cancelar").click(() => location = "../index.html");

const parcelado = $("#parcelado");
for (let i = 1; i <= 36; i++) {
  const option = $("<option></option>").val(i).text(`Parcelado em ${i}x`);
  parcelado.append(option);
}

const categoriaSelect = $("#categoria");
const tipoSelect = $("#tipo");

categoriaSelect.change(function() {
  liberarParcelas();
  if (categoriaSelect.val() === "despesa") {
    $("#dataForm").css("opacity", "1");
    $("#parcelForm").css("opacity", "1");
    $("#checkData").prop("checked", true);
  } else {
    $("#dataForm").css("opacity", "0");
    $("#parcelForm").css("opacity", "0");
    $("#checkData").prop("checked", false);
  }
});

tipoSelect.change(function() {
  liberarParcelas();
});

function liberarParcelas() {
  if (categoriaSelect.val() === "despesa" && tipoSelect.val() === "variavel") {
    parcelado.removeAttr("disabled");
  } else {
    parcelado.attr("disabled", "true");
    parcelado.val("1");
  }
}

$("#checkData").click(() => {
  let check = $("#checkData");
  if (check.prop('checked') === true) {
    $("#data").removeAttr("disabled");
  } else {
    $("#data").val("0000-00-00");
    $("#data").attr("disabled", "true");
  }
});
