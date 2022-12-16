const mongoose = require("mongoose");
const { updateOne } = require("../models/DoacaoSchema");
const DoacaoSchema = require("../models/DoacaoSchema");
const ProdutosSchema = require("../models/ProdutosSchema");
const validarItens = require("../utils/servico");

const cadastrarDoacao = async (request, response) => {
  const {
    name_produto,
    categoria_produto,
    quantidade_produto,
    pontos_por_produto,
  } = request.body;

  const produtos = await ProdutosSchema.find({ name_produto });
  let novaQuantidade = quantidade_produto;
  if (produtos.length > 0) {
   novaQuantidade = (produtos[0].quantidade_produto += quantidade_produto);
   const atualizarProduto= await ProdutosSchema.find({name_produto}).updateOne({
    quantidade_produto:novaQuantidade
   })
  } else {
    const novoProduto = new ProdutosSchema({
      name_produto,
      categoria_produto,
      quantidade_produto,
    });
    const salvarProduto = await novoProduto.save();
  }
  //Deve retornar(400) ao inserir tipo de dado incorreto;
  //e caso não respeite o preenchimento obrigatório.
  if (validarItens.validaTipoEObrigatoriedadeDoacao(request.body)) {
    return response.status(400).json({
      message: validarItens.validaTipoEObrigatoriedadeDoacao(request.body),
    });
  }

  try {
    const novaDoacao = new DoacaoSchema(request.body);
    const salvarDoacao = await novaDoacao.save();

    //Deve retornar(201) quando criar a doação.

    response.status(201).send({
      Prezades: "Doação cadastrada com sucesso",
      Cadastro: salvarDoacao,
    });
  } catch (err) {
    response.status(500).send({
      message: err.message,
    });
  }
};

const buscarAllDoacao = async (request, response) => {
  try {
    const doacao = await DoacaoSchema.find();

    //Deve retornar(200) caso encontre as doações.

    if (doacao.length > 0) {
      return response.status(200).json({
        Prezades: `Encontramos ${doacao.length} doaç${
          doacao.length === 1 ? "ão" : "ões"
        }.`,
        Lista_doacoes: doacao,
      });

      //Deve retornar(404) caso não exista doação cadastrada.
    } else {
      return response.status(404).json({
        Prezades: `Nenhuma doação foi cadastrada até o momento.`,
      });
    }
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const buscarDoacaoById = async (request, response) => {
  const { id } = request.params;

  //Deve retornar(400) caso o Id não possua 24 caracteres.

  if (validarItens.validaId(request.params)) {
    return response.status(400).json({
      message: validarItens.validaId(request.params),
    });
  }

  try {
    const doacao = await DoacaoSchema.find({ id });

    //Deve retornar(404) caso o id da doação não exista no banco de dados.

    if (doacao.length == 0) {
      return response.status(404).json({
        Prezades: `A doação não foi encontrada.`,
      });
    }

    //Deve retornar(200) caso o id da doação exista no banco de dados.

    response.status(200).json({
      Prezades: `Segue a doação para este id [${id}]:`,
      doacao,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  cadastrarDoacao,
  buscarAllDoacao,
  buscarDoacaoById,
};
