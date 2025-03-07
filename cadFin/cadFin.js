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
  let mesHoje = hoje.getMonth() + 1; 
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

  let id = new Date().getTime(); 
    
  if (totalParcelas > 1 && categoria === "despesa") {

    if (vencimento === "Sem Vencimento") { 
      return alert('Favor indicar o dia do vencimento no campo "Vencimento" ');
    }

    let valorParcela = valor / totalParcelas;
    let parcelas = [];

    for (let i = 0; i < totalParcelas; i++) {
      let mesParcela = mesHoje + i;
      let anoParcela = anoHoje;
    
      
      if (mesParcela > 12) {
        anoParcela += Math.floor((mesParcela - 1) / 12); 
        mesParcela = (mesParcela - 1) % 12 + 1;
      }

      mesParcela = String(mesParcela).padStart(2, '0');


      if (vencimento) {
        let [vencimentoDia] = vencimento.split('/').map(Number);
        vencimento = `${vencimentoDia}/${mesParcela}/${anoParcela}`;
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
      mesHoje,
      vencimento,
      status
    };
        // console.log(transacao.mesHoje)
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
  
  $('#descricao').val('');
  $('#valor').val('');
  $('#data').val('');
});



// console.log(parcelas)

function mostrarModal() {

  const parcelas = JSON.parse(sessionStorage.getItem('parcelasTemp'));

  $(".container").hide();

  let modalContent = `
    <table>
      <div style="margin-bottom:20px">
        <button id="gravarParcelas">Gerar Parcelas</button>
        <button id="cancelarParcelas">Cancelar</button></div>
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
    // console.log(parcela)
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

  setTimeout(() => {
    $('#modalContent').html(modalContent);
    $('#modal').show();


    $("#gravarParcelas").click(() => {
      const parcelas = JSON.parse(sessionStorage.getItem('parcelasTemp'));
      const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
      transacoes.push(...parcelas);
      localStorage.setItem('transacoes', JSON.stringify(transacoes));
      sessionStorage.removeItem('parcelasTemp'); 
      alert('Parcelas gravadas com sucesso!');
      $('#modal').hide();
      $(".container").show();
    });


    $("#cancelarParcelas").on("click", () => {
      sessionStorage.removeItem('parcelasTemp'); 
      $('#modal').hide();
      $(".container").show();
    });


  }, 400);
}


$("#cancelar").click(() => location = "../index.html");

$(document).ready(() => {
  $('body').append(`
    <div id="modal" style="display:none">
        <h1 style="color:white; font-size:40px">
          Gerar Parcelas
        </h1>
      <div id="modalContent">

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
