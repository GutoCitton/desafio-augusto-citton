import { METODO_DE_PAGAMENTO } from "./enum/metodo-de-pagamento.enum";
import { CARDAPIO } from "./enum/cardapio.enum";

class CaixaDaLanchonete {
  calcularValorDaCompra(metodoDePagamento, itens) {
    try {
      this.validarCarrinhoVazio(itens);
      this.validarQuantidadeItens(itens);
      this.validarCodigoItens(itens);
      this.validarItemExtra(itens);
      this.validarMetodoDePagamento(metodoDePagamento);
      const valorTotal = this.calcularValorTotal(
        metodoDePagamento,
        itens
      ).toFixed(2);
      return `R$ ${valorTotal.replace(".", ",")}`;
    } catch (error) {
      return error.message;
    }
  }

  validarCarrinhoVazio(itens) {
    if (!itens.length) {
      throw new Error("Não há itens no carrinho de compra!");
    }
  }

  validarQuantidadeItens(itens) {
    itens.forEach((item) => {
      if (item.split(",")[1] == 0) {
        throw new Error("Quantidade inválida!");
      }
    });
  }

  validarCodigoItens(itens) {
    itens.forEach((item) => {
      const codigoDoItem = item.split(",")[0];
      const codigoPeloCardapio = CARDAPIO.map(
        (itemCardapio) => itemCardapio.codigo
      );
      if (!codigoPeloCardapio.includes(codigoDoItem)) {
        throw new Error("Item inválido!");
      }
    });
  }

  validarItemExtra(itens) {
    const itensDoPedido = itens.map((item) => item.split(",")[0]);

    itensDoPedido.forEach((itemDoPedido) => {
      const itemDoCardapio = CARDAPIO.find(
        (itemDoCardapio) => itemDoCardapio.codigo === itemDoPedido
      );

      if (
        itemDoCardapio.extra &&
        !itensDoPedido.includes(itemDoCardapio.extra)
      ) {
        throw new Error("Item extra não pode ser pedido sem o principal");
      }
    });
  }

  validarMetodoDePagamento(metodoDePagamento) {
    const metodosDePagamento = Object.values(METODO_DE_PAGAMENTO);

    if (!metodosDePagamento.includes(metodoDePagamento)) {
      throw new Error("Forma de pagamento inválida!");
    }
  }

  calcularValorTotal(metodoDePagamento, itens) {
    const valorTotalBruto = itens
      .map((item) => {
        const [codigoItem, qtdItens] = item.split(",");
        const itemDoCardapio = CARDAPIO.find(
          (itemDoCardapio) => itemDoCardapio.codigo === codigoItem
        );

        return itemDoCardapio.valor * Number(qtdItens);
      })
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    if (METODO_DE_PAGAMENTO.credito === metodoDePagamento) {
      return valorTotalBruto * 0.03 + valorTotalBruto;
    }
    if (METODO_DE_PAGAMENTO.dinheiro === metodoDePagamento) {
      return valorTotalBruto - valorTotalBruto * 0.05;
    }

    return valorTotalBruto;
  }
}

export { CaixaDaLanchonete };
