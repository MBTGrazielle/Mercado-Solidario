const mongoose = require("mongoose");
const VoluntarioSchema = require("../models/VoluntarioSchema");
const bcrypt = require("bcrypt");

const criarVoluntario = async (request, response) => {
  const { email } = request.body;

  const senhaHasheada = bcrypt.hashSync(request.body.password, 10);
  request.body.password = senhaHasheada;

  //verifica se o email já está cadastrado
  const emailExiste = await VoluntarioSchema.exists({
    email: request.body.email,
  });
  if (emailExiste) {
    return response.status(409).send({
      message: "Esse email já foi cadastrado!",
    });
  }
  //verifica se o email é válido
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return response.status(401).send({
      message: "Email inválido!",
    });
  }

  try {
    const novoUsuario = new VoluntarioSchema(request.body);
    const salvarUsuario = await novoUsuario.save();
    response.status(201).send({
      message:
        "Parabéns por sua iniciativa! O seu usuário foi cadastrado com sucesso!",
      salvarUsuario,
    });
  } catch (err) {
    response.status(500).send({
      message: err.message,
    });
  }
};

const buscarAllVoluntario = async (request, response) => {
  try {
    const voluntario = await VoluntarioSchema.find();
    if (voluntario.length > 1) {
      return response.status(200).json({
        message: `Encontramos ${voluntario.length} voluntários.`,
        voluntario,
      });
    } else if (voluntario.length == 1) {
      return response.status(200).json({
        message: `Encontramos ${voluntario.length} voluntario.`,
        voluntario,
      });
    } else {
      return response
        .status(404)
        .json({ message: `Não encontramos nenhum voluntário até o momento.` });
    }
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const buscarVoluntarioById = async (request, response) => {
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
    const voluntario = await VoluntarioSchema.find({ id });
    if (voluntario.length == 0) {
      return response
        .status(404)
        .json({ message: `O voluntário não foi encontrado.` });
    }
    response.status(200).json({
      Prezades: `Segue o voluntario para este id [${id}]:`,
      voluntario,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const atualizarVoluntarioById = async (request, response) => {
  const { id } = request.params;
  const { name, email, password } = request.body;
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
    const voluntarioEncontrado = await VoluntarioSchema.updateOne({
      name,
      email,
      password,
    });
    const voluntarioAtualizado = await VoluntarioSchema.find({ id });
    if (voluntarioAtualizado.length == 0) {
      return response.status(404).json({
        message: `O voluntário não foi encontrado.`,
      });
    }
    response.status(200).send({
      message: "Voluntário atualizado com sucesso",
      voluntarioAtualizado,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const deletarVoluntarioById = async (request, response) => {
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
    const voluntarioEncontrado = await VoluntarioSchema.deleteOne({ id });
    if (voluntarioEncontrado.deletedCount === 1) {
      return response
        .status(200)
        .send({ message: `O voluntário foi deletado com sucesso!` });
    } else {
      return response
        .status(404)
        .send({ message: "O voluntário não foi encontrado." });
    }
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  criarVoluntario,
  buscarAllVoluntario,
  buscarVoluntarioById,
  atualizarVoluntarioById,
  deletarVoluntarioById,
};
