const mongoose = require("mongoose");
const VoluntarioSchema = require("../models/VoluntarioSchema");
const bcrypt = require("bcrypt");

const cadastrarVoluntario = async (request, response) => {
  const { name, cpf,telefone, email,disponibilidade_dia, disponibilidade_turno } = request.body;

  const senhaHasheada = bcrypt.hashSync(request.body.password, 10);
  request.body.password = senhaHasheada;

  //Deve retornar(400) ao inserir tipo de dado incorreto;
  //e caso não respeite o preenchimento obrigatório.

  if (typeof name !== "string" || name.trim() === "") {
    return response.status(400).send({
      Alerta: `A string nome é obrigatória.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  } else if (typeof cpf !== "string" || cpf.trim() === "") {
    return response.status(400).send({
      Alerta: `A string do CPF é obrigatória.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  } else if (typeof email !== "string" || email.trim() === "") {
    return response.status(400).send({
      Alerta: `A string do email é obrigatória.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }else if(typeof telefone !== "string" || telefone.trim() === ""){
    return response.status(400).send({
      Alerta: `A string do telefone é obrigatória.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }else if(typeof disponibilidade_dia	 !== "string" || disponibilidade_dia.trim() === ""){
    return response.status(400).send({
      Alerta: `A string da disponibilidade do dia é obrigatória.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }else if(typeof disponibilidade_turno	 !== "string" || disponibilidade_turno.trim() === ""){
    return response.status(400).send({
      Alerta: `A string da disponibilidade do turno é obrigatória.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  //Deve retornar conflito(409) ao cadastrar um email existente no banco de dados

  const emailExiste = await VoluntarioSchema.exists({
    email: request.body.email,
  });
  if (emailExiste) {
    return response.status(409).send({
      Alerta: "Este endereço de email já está em uso. Tente outro.",
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  //Deve retornar conflito(409) ao cadastrar um cpf existente no banco de dados

  const cpfExiste = await VoluntarioSchema.exists({
    cpf: request.body.cpf,
  });
  if (cpfExiste) {
    return response.status(409).send({
      Alerta: "Este CPF já está cadastrado.",
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  //Deve retornar(400) caso o CPF não possua 11 caracteres.

  if (cpf.length < 11 || cpf.length > 11) {
    return response.status(400).send({
      Alerta: "Digite um CPF válido.",
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  //Deve retornar(400)caso o e-mail seja inválido.

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return response.status(400).send({
      Alerta: "Email inválido!",
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  try {
    const novoUsuario = new VoluntarioSchema(request.body);
    const salvarUsuario = await novoUsuario.save();

    //Deve retornar(201) quando criar o usuário.

    response.status(201).send({
      Bem_vindes: "Parabéns por sua iniciativa! O seu usuário foi cadastrado!",
      Status: "┌( ಠ‿ಠ)┘",
      Cadastro: salvarUsuario,
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

    //Deve retornar(200) caso encontre os voluntários.

    if (voluntario.length > 1) {
      return response.status(200).json({
        Prezades: `Encontramos ${voluntario.length} voluntários.`,
        Status: "┌( ಠ‿ಠ)┘",
        Lista_voluntarios: voluntario,
      });

      //Deve retornar(200) caso encontre o voluntário.
    } else if (voluntario.length == 1) {
      return response.status(200).json({
        Prezades: `Encontramos ${voluntario.length} voluntário.`,
        Status: "┌( ಠ‿ಠ)┘",
        Lista_voluntarios: voluntario,
      });

      //Deve retornar(404) caso não exista voluntário cadastrado.
    } else {
      return response.status(404).json({
        Prezades: `Nenhum voluntário foi cadastrado até o momento.`,
        Status: "┌(ಠ_ಠ)┐",
      });
    }
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const buscarVoluntarioById = async (request, response) => {
  const { id } = request.params;

  //Deve retornar(400) caso o Id não possua 24 caracteres.

  if (id.length > 24) {
    return response.status(400).json({
      Alerta: `Id incorreto. Caracter a mais: ${id.length - 24}.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }
  if (id.length < 24) {
    return response.status(400).json({
      Alerta: `Id incorreto. Caracter a menos: ${24 - id.length}.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  try {
    const voluntario = await VoluntarioSchema.find({ id });

    //Deve retornar(404) caso o id do voluntário não exista no banco de dados.

    if (voluntario.length == 0) {
      return response
        .status(404)
        .json({
          Prezades: `O voluntário não foi encontrado.`,
          Status: "┌(ಠ_ಠ)┐",
        });
    }

    //Deve retornar(200) caso o id do voluntário exista no banco de dados.

    response.status(200).json({
      Prezades: `Segue o voluntário para este id [${id}]:`,
      Status: "┌( ಠ‿ಠ)┘",
      voluntario,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const buscarVoluntarioByCPF = async (request, response) => {
  const { cpf } = request.params;

  //Deve retornar(400) caso o cpf não possua 11 caracteres.

  if (cpf.length > 11) {
    return response.status(400).json({
      Alerta: `Id incorreto. Caracter a mais: ${cpf.length - 11}.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }
  if (cpf.length < 11) {
    return response.status(400).json({
      Alerta: `Id incorreto. Caracter a menos: ${11 - cpf.length}.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  try {
    const voluntarioByCPF = await VoluntarioSchema.find({ cpf });

    //Deve retornar(404) caso o cpf do voluntário não exista no banco de dados.

    if (voluntarioByCPF.length == 0) {
      return response
        .status(404)
        .json({
          Prezades: `O voluntário não foi encontrado.`,
          Status: "┌(ಠ_ಠ)┐",
        });
    }

    //Deve retornar(200) caso o cpf do voluntário exista no banco de dados.

    response.status(200).json({
      Prezades: `Segue o voluntário para este cpf [${cpf}]:`,
      Status: "┌( ಠ‿ಠ)┘",
      voluntarioByCPF,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const atualizarVoluntarioById = async (request, response) => {
  const { id } = request.params;
  const { name, telefone,disponibilidade_dia, disponibilidade_turno,password } = request.body;
  
  //Deve retornar mensagem de erro(400) caso o Id não possua 24 caracteres.

  if (id.length > 24) {
    return response.status(400).json({
      Alerta: `Id incorreto. Caracter a mais: ${id.length - 24}.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }
  if (id.length < 24) {
    return response.status(400).json({
      Alerta: `Id incorreto. Caracter a menos: ${24 - id.length}.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }


  //Deve retornar mensagem de erro(400) ao atualizar o CPF e/ou e-mail.

  if (request.body.cpf || request.body.email) {
    return response.status(400).send({
      Alerta: `Não é possivel atualizar o CPF e/ou e-mail.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }

  try {
    
    const voluntarioAtualizado = await VoluntarioSchema.find({ id }).updateOne({
      name,
      telefone,
      disponibilidade_dia, 
      disponibilidade_turno,
      password
    });

    const cadastroAtualizado = await VoluntarioSchema.find({ id });

    //Deve retornar mensagem de erro(404) caso o id voluntário não exista no banco de dados.

    if (cadastroAtualizado.length == 0) {
      return response.status(404).json({
        Prezades: `O voluntário não foi encontrado.`,
        Status: "┌(ಠ_ಠ)┐",
      });
    }

    //Deve retornar(200) caso encontre o paciente por Id.

    response.status(200).send({
      Prezades: "Voluntário atualizado com sucesso",
      Status: "┌( ಠ‿ಠ)┘",
     cadastroAtualizado,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const deletarVoluntarioById = async (request, response) => {
  const { id } = request.params;

  //Deve retornar(400) caso o Id não possua 24 caracteres.

  if (id.length > 24) {
    return response.status(400).json({
      Alerta: `Id incorreto. Caracter a mais: ${id.length - 24}.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }
  if (id.length < 24) {
    return response.status(400).json({
      Alerta: `Id incorreto. Caracter a menos: ${24 - id.length}.`,
      Status: "┌(ಠ_ಠ)┐",
    });
  }
  try {
    const voluntarioEncontrado = await VoluntarioSchema.deleteOne({ id });

    //Deve retornar status(204) ao deletar e não há conteúdo para enviar para esta solicitação.

    if (voluntarioEncontrado.deletedCount === 1) {
      return response.status(204).send({ Prezades: `Sem resultado!` });
    } else {
      //Deve retornar(404) caso não encontre o id do voluntário.

      return response.status(404).send({
        Prezades: "O voluntário não foi encontrado.",
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
  cadastrarVoluntario,
  buscarAllVoluntario,
  buscarVoluntarioById,
  buscarVoluntarioByCPF,
  atualizarVoluntarioById,
  deletarVoluntarioById,
};

//falta hashear o password quando atualizar a senha
