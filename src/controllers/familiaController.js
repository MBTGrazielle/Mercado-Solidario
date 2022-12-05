const mongoose = require("mongoose");
const FamiliaSchema = require("../models/FamiliaSchema");
const bcrypt = require("bcrypt");

const cadastrarFamilia = async (request, response) => {
  const {
    numero_nis,
    numero_integrantes_familia,
    name_integrantes_familia,
    name_do_responsavel_familiar,
    cpf_do_responsavel_familiar,
    renda_familiar,
    endereco,
    telefone,
  } = request.body;

  //Deve retornar(400) ao inserir tipo de dado incorreto;
  //e caso não respeite o preenchimento obrigatório.

  if (typeof numero_nis !== "string" || numero_nis.trim() === "") {
    return response.status(400).send({
      Alerta: `A string do NIS é obrigatória.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  } else if (typeof numero_integrantes_familia !== "number") {
    return response.status(400).send({
      Alerta: `O número de integrantes da família é obrigatório.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  } else if (
    typeof name_do_responsavel_familiar !== "string" ||
    name_do_responsavel_familiar.trim() === ""
  ) {
    return response.status(400).send({
      Alerta: `A string do nome do responsável familiar é obrigatória.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  } else if (
    typeof cpf_do_responsavel_familiar !== "string" ||
    cpf_do_responsavel_familiar.trim() === ""
  ) {
    return response.status(400).send({
      Alerta: `A string do cpf do responsável familiar é obrigatória.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  } else if (typeof renda_familiar !== "number") {
    return response.status(400).send({
      Alerta: `O número da renda familiar é obrigatório.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  } else if (typeof telefone !== "string" || telefone.trim() === "") {
    return response.status(400).send({
      Alerta: `A string do telefone é obrigatória.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }
  //Deve retornar conflito(409) ao cadastrar um cpf existente no banco de dados

  const cpfExiste = await FamiliaSchema.exists({
    cpf_do_responsavel_familiar: request.body.cpf_do_responsavel_familiar,
  });
  if (cpfExiste) {
    return response.status(409).send({
      Alerta: "Este CPF já está cadastrado.",
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  //Deve retornar(400) caso o CPF não possua 11 caracteres.

  if (
    cpf_do_responsavel_familiar.length < 11 ||
    cpf_do_responsavel_familiar.length > 11
  ) {
    return response.status(400).send({
      Alerta: "Digite um CPF válido.",
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  try {
    const novoUsuario = new FamiliaSchema(request.body);
    const salvarUsuario = await novoUsuario.save();

    //Deve retornar(201) quando criar a família.

    response.status(201).send({
      Bem_vindes: "Família cadastrada com sucesso",
      Status: "┌( ಠ‿ಠ)┘",
      Cadastro: salvarUsuario,
    });
  } catch (err) {
    response.status(500).send({
      message: err.message,
    });
  }
};

const buscarAllFamilia = async (request, response) => {
  try {
    const familia = await FamiliaSchema.find();

    //Deve retornar(200) caso encontre as famílias.

    if (familia.length > 1) {
      return response.status(200).json({
        Prezades: `Encontramos ${familia.length} famílias.`,
        Status: "┌( ಠ‿ಠ)┘",
        Lista_voluntarios: familia,
      });

      //Deve retornar(200) caso encontre a família.
    } else if (familia.length == 1) {
      return response.status(200).json({
        Prezades: `Encontramos ${familia.length} família.`,
        Status: "┌( ಠ‿ಠ)┘",
        Lista_familia: familia,
      });

      //Deve retornar(404) caso não exista familia cadastrada.
    } else {
      return response.status(404).json({
        Prezades: `Nenhuma família foi cadastrada até o momento.`,
        Status: "┌(ಠ_ಠ)┐",
      });
    }
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const perfilSocioEconomico = async (request, response) => {
  //média da renda familiar em qt de salários
  //média de integrantes da família
};

const buscarFamiliaByNameResponsavelFamiliar = async (request, response) => {
  const { name_do_responsavel_familiar } = request.params;

  try {
    const familia = await FamiliaSchema.find({ name_do_responsavel_familiar });

    //Deve retornar(404) caso o nome do responsável familiar não exista no banco de dados.

    if (familia.length == 0) {
      return response.status(404).json({
        Prezades: `A familia não foi encontrada.`,
        Status: "┌(ಠ_ಠ)┐",
      });
    }

    //Deve retornar(200) caso o nome do responsável familiar exista no banco de dados.

    response.status(200).json({
      Prezades: `Segue a família encontrada através do nome do representante familiar: [${name_do_responsavel_familiar}]`,
      Status: "┌( ಠ‿ಠ)┘",
      familia,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const buscarFamiliaByCartao = async (request, response) => {
  const { numero_cartao_alimentacao } = request.params;

  //Deve retornar(400) caso o número do cartão alimentação não possua 24 caracteres.

  if (numero_cartao_alimentacao.length > 24) {
    return response.status(400).json({
      Alerta: `Número incorreto. Caracter a mais: ${
        numero_cartao_alimentacao.length - 24
      }.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }
  if (numero_cartao_alimentacao.length < 11) {
    return response.status(400).json({
      Alerta: `Número incorreto. Caracter a menos: ${
        24 - numero_cartao_alimentacao.length
      }.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  try {
    const familiaNumeroCartao = await FamiliaSchema.find({
      numero_cartao_alimentacao,
    });

    //Deve retornar(404) caso o número do cartão alimentação não exista no banco de dados.

    if (familiaNumeroCartao.length == 0) {
      return response.status(404).json({
        Prezades: `A família não foi encontrada.`,
        Status: "┌(ಠ_ಠ)┐",
      });
    }

    //Deve retornar(200) caso o número do cartão alimentação exista no banco de dados.

    response.status(200).json({
      Prezades: `Segue a família encontrada para este cartão [${numero_cartao_alimentacao}]:`,
      Status: "┌( ಠ‿ಠ)┘",
      familiaNumeroCartao,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const atualizarFamiliaByCartao = async (request, response) => {
  const { numero_cartao_alimentacao } = request.params;
  const {
    numero_integrantes_familia,
    name_integrantes_familia,
    name_do_responsavel_familiar,
    cpf_do_responsavel_familiar,
    renda_familiar,
    endereco,
    telefone,
  } = request.body;

  //Deve retornar mensagem de erro(400) caso o número do cartão alimentação não possua 24 caracteres.

  if (numero_cartao_alimentacao.length > 24) {
    return response.status(400).json({
      Alerta: `Número incorreto. Caracter a mais: ${
        numero_cartao_alimentacao.length - 24
      }.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }
  if (numero_cartao_alimentacao.length < 24) {
    return response.status(400).json({
      Alerta: `Número incorreto. Caracter a menos: ${
        24 - numero_cartao_alimentacao.length
      }.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  //Deve retornar mensagem de erro(400) ao atualizar o cartão NIS.

  if (request.body.numero_nis) {
    return response.status(400).send({
      Alerta: `Não é possivel atualizar o número do cartão NIS .`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  try {
    const familiaAtualizado = await FamiliaSchema.find({
      numero_cartao_alimentacao,
    }).updateOne({
      numero_integrantes_familia,
      name_integrantes_familia,
      name_do_responsavel_familiar,
      cpf_do_responsavel_familiar,
      renda_familiar,
      endereco,
      telefone,
    });

    const cadastroAtualizado = await FamiliaSchema.find({
      numero_cartao_alimentacao,
    });

    //Deve retornar mensagem de erro(404) caso o número do cartão alimentação não exista no banco de dados.

    if (cadastroAtualizado.length == 0) {
      return response.status(404).json({
        Prezades: `A família não foi encontrada.`,
        Status: "┌(ಠ_ಠ)┐",
      });
    }

    //Deve retornar(200) caso encontre a família pelo número do cartão alimentação.

    response.status(200).send({
      Prezades: "Família atualizada com sucesso",
      Status: "┌( ಠ‿ಠ)┘",
      cadastroAtualizado,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const deletarVoluntarioByCartao = async (request, response) => {
  const { numero_cartao_alimentacao } = request.params;

  //Deve retornar(400) caso o número do cartão alimentação não possua 24 caracteres.

  if (numero_cartao_alimentacao.length > 24) {
    return response.status(400).json({
      Alerta: `Número incorreto. Caracter a mais: ${
        numero_cartao_alimentacao.length - 24
      }.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }
  if (numero_cartao_alimentacao.length < 24) {
    return response.status(400).json({
      Alerta: `Número incorreto. Caracter a menos: ${
        24 - numero_cartao_alimentacao.length
      }.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }
  try {
    const familiaEncontrado = await FamiliaSchema.deleteOne({
      numero_cartao_alimentacao,
    });

    //Deve retornar status(204) ao deletar e não há conteúdo para enviar para esta solicitação.

    if (familiaEncontrado.deletedCount === 1) {
      return response.status(204).send({ Prezades: `Sem resultado!` });
    } else {
      //Deve retornar(404) caso não encontre a família pelo número do cartão alimentação.

      return response.status(404).send({
        Prezades: "A família não foi encontrada.",
        Status: "┌(ಠ_ಠ)┐",
      });
    }
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  cadastrarFamilia,
  buscarAllFamilia,
  perfilSocioEconomico,
  buscarFamiliaByNameResponsavelFamiliar,
  buscarFamiliaByCartao,
  atualizarFamiliaByCartao,
  deletarVoluntarioByCartao,
};
