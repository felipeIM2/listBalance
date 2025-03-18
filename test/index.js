
window.addEventListener("load", () => sessionStorage.setItem("valorIntegral", 10000))


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
  
  let valorRestantePorParcela = valorRestante / (parcela.parcelado - 1); // rateio entre as parcelas restantes

  const novasParcelas = [];
  
  for (let i = 0; i < parcela.parcelado; i++) {
    
    if (i === index) { // Se for a parcela que foi alterada
      
      novasParcelas.push({
        ...parcela,
        descricao: novoDescricao,
        valor: novoValor, // valor da parcela alterada
        vencimento: vencimentoFormatado,
        alterado: true
      });

    } else {
      
      // Se a parcela não foi alterada (alterado: false), faz a redistribuição do valor
      if (parcela.alterado === false) {
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
})
