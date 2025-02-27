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
  const mesHoje = String(hoje.getMonth() + 1).padStart(2, '0');
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

  const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

  let status;
  let parcela;

  if (categoria === "receita") {
    status = "Entrada";
    parcela = "Sem parcela";
  } else if (categoria === "despesa") {
    status = "Aberto";
    parcela = parseFloat($("#parcelado").val());
    if (tipo === "fixa") {
      parcela = "1";
    }
  }

  let id = transacoes.length === 0 ? 0 : transacoes[transacoes.length - 1].id + 1;

  transacoes.push({ id, descricao, valor, categoria, tipo, pessoa, parcela, mesHoje, vencimento, status });
  localStorage.setItem('transacoes', JSON.stringify(transacoes));
  if(categoria === "despesa") alert(`Despesa adicioanda com sucesso!`); else alert(`Receita adicioanda com sucesso!`) 

  $('#descricao').val('');
  $('#valor').val('');
  $('#data').val('');
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
  console.log(categoriaSelect.val())
  if (categoriaSelect.val() === "despesa") {
    $("#dataForm").css("display", "flex");
    $("#checkData").prop("checked", true);
  } else {
    $("#dataForm").css("display", "none");
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
