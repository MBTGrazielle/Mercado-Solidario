const mongoose = require("mongoose");
const DoacaoSchema = require("../models/DoacaoSchema");
const validarItens = require("../utils/servico");

const buscarAllProdutos = async (request, response) => {
  const mercado=await DoacaoSchema.find()
  let filtroCategoria=0
  var estoque = mercado.map(function(name_produto) {
  return name_produto.name_produto+`: `+ name_produto.quantidade_produto;

});

return response.status(200).send(estoque)
}

const filtroMercadoNomeProduto = async (request, response) => {
  const { name_produto } = request.body;
  try {
    const doacao = await DoacaoSchema.find({ name_produto });

    let filtroCategoria = 0;

    doacao.forEach((a) => {
      filtroCategoria += a.quantidade_produto;
    });

    response.status(200).json({ filtro_Produto: `${name_produto}: ` + filtroCategoria.toFixed(0) });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const filtroMercadoCategoria = async (request, response) => {
  const { categoria_produto } = request.body;
  try {
    const doacao = await DoacaoSchema.find({ categoria_produto });

    let filtroCategoria = 0;

    doacao.forEach((a) => {
      filtroCategoria += a.quantidade_produto;
    });

    response.status(200).json({ filtro_Categoria: `${categoria_produto}: ` + filtroCategoria.toFixed(0) });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  buscarAllProdutos,
  filtroMercadoNomeProduto,
  filtroMercadoCategoria
};
