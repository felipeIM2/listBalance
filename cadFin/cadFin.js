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

  if (!descricao || isNaN(valor)) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  const categoria = $('#categoria').val();
  const tipo = $('#tipo').val();

  let pessoa = $("#pessoa").val();

  const hoje = new Date();
  const mesHoje = hoje.getMonth() + 1; 
  const anoHoje = hoje.getFullYear();

  let check = $("#checkData");
  let vencimento;

  if (check.prop('checked') === true) {
    let vencimentoData = $("#data").val();
    let [ano, mes, dia] = vencimentoData.split('-').map(Number);

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
    parcela = "Sem parcela";
  } else if (categoria === "despesa") {
    status = "Aberto";
    parcela = totalParcelas > 1 ? `1/${totalParcelas}` : "Sem parcela";
    if (tipo === "fixa") {
      parcela = "1/1"; 
    }
  }

  let id = new Date().getTime(); // Usando um ID único baseado no timestamp
  
  if (totalParcelas > 1) {

    if (vencimento === "Sem Vencimento") { 
      return alert('Favor indicar o dia do vencimento no campo "Vencimento" ');
    }

    let valorParcela = valor / totalParcelas;
    let parcelas = [];

    for (let i = 0; i < totalParcelas; i++) {
      let mesParcela = mesHoje + i;
      let anoParcela = anoHoje;
      
      if (mesParcela > 12) {
        anoParcela++;
        mesParcela = mesParcela % 12;
      }

      mesParcela = String(mesParcela).padStart(2, '0');

      if (vencimento) {
        let [vencimentoDia, vencimentoMes, vencimentoAno] = vencimento.split('/').map(Number);
        vencimentoMes = mesParcela;
        vencimento = `${vencimentoDia}/${vencimentoMes}/${vencimentoAno}`;
      }

      parcelas.push({
        descricao,
        valor: valorParcela,
        categoria,
        tipo,
        pessoa,
        vencimento,
        status: "Aberto",
        parcela: `${i + 1}/${totalParcelas}`, 
        parcelado: totalParcelas,
        mesHoje: mesParcela,
        id: id + i
      });
    }

    // Salvar as parcelas no sessionStorage para revisão
    sessionStorage.setItem('parcelasTemp', JSON.stringify(parcelas));
  } else {
    // Se for uma única parcela, adiciona diretamente ao sessionStorage
    const transacao = {
      id,
      descricao,
      valor,
      categoria,
      tipo,
      pessoa,
      parcela,
      parcelado: totalParcelas,
      mesHoje,
      vencimento,
      status
    };
    sessionStorage.setItem('parcelasTemp', JSON.stringify([transacao]));
  }

  
  mostrarModal();

  
  $('#descricao').val('');
  $('#valor').val('');
  $('#data').val('');
});


const parcelas = JSON.parse(sessionStorage.getItem('parcelasTemp'));
// console.log(parcelas)

function mostrarModal() {

  $(".container").hide();

  let modalContent = `
    <table>
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
      </tr>
    `;
  });

  // Fechando a tabela
  modalContent += `
      </tbody>
    </table>
  `;

  // Inserir o conteúdo da tabela no modal
  $('#modalContent').html(modalContent);

  // Exibir o modal
  $('#modal').show();


  // Função para gravar as parcelas no localStorage
  $("#gravarParcelas").click(() => {
    const parcelas = JSON.parse(sessionStorage.getItem('parcelasTemp'));
    const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
    transacoes.push(...parcelas);
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
    sessionStorage.removeItem('parcelasTemp'); // Limpar o sessionStorage
    alert('Parcelas gravadas com sucesso!');
    $('#modal').hide();
  });


  $("#cancelarParcelas").on("click", () => {
    sessionStorage.removeItem('parcelasTemp'); 
    $('#modal').hide();
    $(".container").show();
  });

}


$("#cancelar").click(() => location = "../index.html");

$(document).ready(() => {
  $('body').append(`
    <div id="modal" style="display:none">
      <div id="modalContent">
      </div>
      <div style="margin-top:30px">
        <button id="gravarParcelas">Gerar Parcelas</button>
        <button id="cancelarParcelas">Cancelar</button></div>
      </div>
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
  // console.log(categoriaSelect.val());
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
