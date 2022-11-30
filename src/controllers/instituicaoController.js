const mongoose = require("mongoose");
const InstituicaoSchema = require("../models/InstituicaoSchema");
const PacienteSchema = require("../models/InstituicaoSchema");

const buscarInstituicaoById = async (request, response) => {
  const { id } = request.params;
  try {
    if (id.length > 24) {
      return response.status(404).json({
        Alerta: `Id incorreto. Caracter a mais: ${id.length - 24}.`,
      });
    }
    if (id.length < 24) {
      return response.status(404).json({
        Alerta: `Id incorreto. Caracter a menos: ${24 - id.length}.`,
      });
    }
    const instituicao = await InstituicaoSchema.find({ id });
    if (instituicao.length == 0) {
      return response
        .status(404)
        .json({ message: `A instituição não foi encontrado.` });
    }
    response.status(200).json({
      Prezades: `Segue a instituição para este id [${id}]:`,
      instituicao,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const buscarAllInstituicao = async (request, response) => {
  try {
    const instituicao = await PacienteSchema.find();
    if (instituicao.length > 1) {
      return response.status(200).json({
        message: `Encontramos ${instituicao.length} instituições.`,
        instituicao,
      });
    } else if (instituicao.length == 1) {
      return response.status(200).json({
        message: `Encontramos ${instituicao.length} instituição.`,
        instituicao,
      });
    } else {
      return response.status(404).json({
        message: `Não encontramos nenhuma instituição até o momento.`,
      });
    }
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const criarCadastroInstituicao = async (request, response) => {
  const {
    nome,
    cnpj,
    iniciativa_privada,
    endereco: {
      cep,
      rua,
      numero,
      complemento,
      referencia,
      estado,
      cidade,
      bairro,
    },
    site,
    horario_funcionamento,
    pessoa_responsavel,
  } = request.body;

  const buscaCnpj = await InstituicaoSchema.find({ cnpj });
  if (buscaCnpj.length !== 0) {
    return response.status(401).json({
      Alerta: `O número deste CNPJ já está cadastrado.`,
    });
  }
  try {
    const instituicao = new InstituicaoSchema({
      nome: nome,
      cnpj: cnpj,
      iniciativa_privada: iniciativa_privada,
      endereco: {
        cep: cep,
        rua: rua,
        numero: numero,
        complemento: complemento,
        referencia: referencia,
        estado: estado,
        cidade: cidade,
        bairro: bairro,
      },
      site: site,
      horario_funcionamento: horario_funcionamento,
      pessoa_responsavel: pessoa_responsavel,
    });
    const salvarInstituicao = await instituicao.save();
    response.status(200).json({
      message: `Instituição cadastrada com sucesso`,
      salvarInstituicao,
    });
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
};

const deletarCadastroInstituicao = async (request, response) => {
  const { id } = request.params;
  try {
    if (id.length > 24) {
      return response.status(404).json({
        Alerta: `Id incorreto. Caracter a mais: ${id.length - 24}.`,
      });
    }
    if (id.length < 24) {
      return response.status(404).json({
        Alerta: `Id incorreto. Caracter a menos: ${24 - id.length}.`,
      });
    }
    const instituicaoEncontrada = await InstituicaoSchema.deleteOne({ id });
    if (instituicaoEncontrada.deletedCount === 1) {
      return response
        .status(200)
        .send({ message: `A instutuição foi deletada com sucesso!` });
    } else {
      return response
        .status(404)
        .send({ message: "A instutuição não foi encontrada." });
    }
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const atualizarCadastroInstituicao = async (request, response) => {
  const { id } = request.params;
  const {
    nome,
    cnpj,
    iniciativa_privada,
    endereco: {
      cep,
      rua,
      numero,
      complemento,
      referencia,
      estado,
      cidade,
      bairro,
    },
    site,
    horario_funcionamento,
    pessoa_responsavel,
  } = request.body;
  try {
    if (id.length > 24) {
      return response.status(404).json({
        Alerta: `Id incorreto. Caracter a mais: ${id.length - 24}.`,
      });
    }
    if (id.length < 24) {
      return response.status(404).json({
        Alerta: `Id incorreto. Caracter a menos: ${24 - id.length}.`,
      });
    }
    const instituicaoAtualizada = await InstituicaoSchema.find({id})
    .updateOne({
      nome,
    cnpj,
    iniciativa_privada,
    endereco: {
      cep,
      rua,
      numero,
      complemento,
      referencia,
      estado,
      cidade,
      bairro,
    },
    site,
    horario_funcionamento,
    pessoa_responsavel,
    });

    const instituicaoUpdate= await InstituicaoSchema.find({id})
    if (instituicaoUpdate.length == 0) {
      return response.status(404).json({
        message: `O instituição não foi encontrada.`,
      });
    }
    response.status(200).send({
      message: "Instituição atualizado com sucesso",
      instituicaoUpdate,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  buscarInstituicaoById,
  buscarAllInstituicao,
  criarCadastroInstituicao,
  deletarCadastroInstituicao,
  atualizarCadastroInstituicao,
};
