const mongoose = require("mongoose");
const VoluntarioSchema = require("../models/VoluntarioSchema");
const bcrypt = require("bcrypt");
const validarItens = require("../utils/servico");

const cadastrarVoluntario = async (request, response) => {
  const {
    name,
    cpf,
    telefone,
    email,
    disponibilidade_dia,
    disponibilidade_turno,
  } = request.body;

  //Deve retornar(400) ao cadastrar turno noturno
  if (validarItens.naoPermiteTurnoNoturno(request.body)) {
    return response.status(400).json({
      message: validarItens.naoPermiteTurnoNoturno(request.body),
    });
  }
  const senhaHasheada = bcrypt.hashSync(request.body.password, 10);
  request.body.password = senhaHasheada;

  //Deve retornar(400) ao inserir tipo de dado incorreto;
  //e caso não respeite o preenchimento obrigatório.

  if (validarItens.validaTipoEObrigatoriedadeVoluntario(request.body)) {
    return response.status(400).json({
      message: validarItens.validaTipoEObrigatoriedadeVoluntario(request.body),
    });
  }

  //Deve retornar conflito(409) ao cadastrar um email existente no banco de dados

  const emailExiste = await VoluntarioSchema.exists({
    email: request.body.email,
  });
  if (emailExiste) {
    return response.status(409).send({
      Alerta: "Este endereço de email já está em uso. Tente outro.",
    });
  }

  //Deve retornar conflito(409) ao cadastrar um cpf existente no banco de dados

  const cpfExiste = await VoluntarioSchema.exists({
    cpf: request.body.cpf,
  });
  if (cpfExiste) {
    return response.status(409).send({
      Alerta: "Este CPF já está cadastrado.",
    });
  }

  //Deve retornar(400) caso o CPF não possua 11 caracteres.

  if (validarItens.validaCpfVoluntario(request.body)) {
    return response.status(400).json({
      message: validarItens.validaCpfVoluntario(request.body),
    });
  }

  //Deve retornar(400)caso o e-mail seja inválido.

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return response.status(400).send({
      Alerta: "Email inválido!",
    });
  }

  try {
    const novoUsuario = new VoluntarioSchema(request.body);
    const salvarUsuario = await novoUsuario.save();

    const usuario = {
      id: salvarUsuario.id,
      nome: salvarUsuario.name,
      cpf: salvarUsuario.cpf,
      telefone: salvarUsuario.telefone,
      email: salvarUsuario.email,
      password: senhaHasheada,
      disponibilidade_dia: salvarUsuario.disponibilidade_dia,
      disponibilidade_turno: salvarUsuario.disponibilidade_turno,
    };

    //Deve retornar(201) quando criar o usuário.

    response.status(201).send({
      Bem_vindes: "Parabéns por sua iniciativa! O seu usuário foi cadastrado!",
      Cadastro: usuario,
    });
  } catch (err) {
    response.status(500).send({
      message: err.message,
    });
  }
};

const buscarAllVoluntario = async (request, response) => {
  try {
    const voluntarios = await VoluntarioSchema.find();

    //Deve retornar(200) caso encontre os voluntários.

    if (voluntarios.length > 0) {
      return response.status(200).json({
        Prezades: `Encontramos ${voluntarios.length} voluntário${
          voluntarios.length === 1 ? "" : "s"
        }.`,
        voluntarios,
      });

      //Deve retornar(404) caso não exista voluntário cadastrado.
    } else {
      return response.status(404).json({
        Prezades: `Nenhum voluntário foi cadastrado até o momento.`,
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

  if (validarItens.validaId(request.params)) {
    return response.status(400).json({
      message: validarItens.validaId(request.params),
    });
  }

  try {
    const voluntario = await VoluntarioSchema.find({ id });

    //Deve retornar(404) caso o id do voluntário não exista no banco de dados.

    if (voluntario.length == 0) {
      return response.status(404).json({
        Prezades: `O voluntário não foi encontrado.`,
      });
    }

    //Deve retornar(200) caso o id do voluntário exista no banco de dados.

    response.status(200).json({
      Prezades: `Segue o voluntário para este id [${id}]:`,
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

  if (validarItens.validaCpfVoluntario(request.params)) {
    return response.status(400).json({
      message: validarItens.validaCpfVoluntario(request.params),
    });
  }

  try {
    const voluntarioByCPF = await VoluntarioSchema.find({ cpf });

    //Deve retornar(404) caso o cpf do voluntário não exista no banco de dados.

    if (voluntarioByCPF.length == 0) {
      return response.status(404).json({
        Prezades: `O voluntário não foi encontrado.`,
      });
    }

    //Deve retornar(200) caso o cpf do voluntário exista no banco de dados.

    response.status(200).json({
      Prezades: `Segue o voluntário para este cpf [${cpf}]:`,
      voluntarioByCPF,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const filtrarVoluntarioDisponibilidade = async (request, response) => {
  const { disponibilidade_dia, disponibilidade_turno } = request.body;

  //Deve retornar(400) caso não preencha disponibilidade dia e turno
  if (validarItens.validaPreenchimentoDisponibilidade(request.body)) {
    return response.status(400).json({
      message: validarItens.validaPreenchimentoDisponibilidade(request.body),
    });
  }

  try {
    const filtroDia = await VoluntarioSchema.find({ disponibilidade_dia });
    const filtroTurno = await VoluntarioSchema.find({ disponibilidade_turno });

    response.status(200).send({
      Prezades: `Segue a lista de voluntários por dia e turno:`,
      VoluntarioByDia: filtroDia,
      VoluntarioByTurno: filtroTurno,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const atualizarVoluntarioById = async (request, response) => {
  const { id } = request.params;
  const {
    name,
    telefone,
    disponibilidade_dia,
    disponibilidade_turno,
    email,
    password,
  } = request.body;
  const senhaHasheada = bcrypt.hashSync(request.body.password, 10);

  //Deve retornar(400) ao atualizar turno para noturno
  if (validarItens.naoPermiteTurnoNoturno(request.body)) {
    return response.status(400).json({
      message: validarItens.naoPermiteTurnoNoturno(request.body),
    });
  }

  //Deve retornar mensagem de erro(400) caso o Id não possua 24 caracteres.
  if (validarItens.validaId(request.params)) {
    return response.status(400).json({
      message: validarItens.validaId(request.params),
    });
  }

  //Deve retornar mensagem de erro(400) ao atualizar o CPF.
  if (validarItens.validaPreenchimentoCpf(request.body)) {
    return response.status(400).json({
      message: validarItens.validaPreenchimentoCpf(request.body),
    });
  }

  try {
    const voluntarioAtualizado = await VoluntarioSchema.find({ id }).updateOne({
      name,
      telefone,
      disponibilidade_dia,
      disponibilidade_turno,
      password: senhaHasheada,
      email:email
    });

    const cadastroAtualizado = await VoluntarioSchema.find({ id });
    const usuario = {
      nome: cadastroAtualizado[0].name,
      telefone: cadastroAtualizado[0].telefone,
      disponibilidade_dia: cadastroAtualizado[0].disponibilidade_dia,
      disponibilidade_turno: cadastroAtualizado[0].disponibilidade_turno,
      email:cadastroAtualizado[0].email
    };

    //Deve retornar mensagem de erro(404) caso o id voluntário não exista no banco de dados.
    if (cadastroAtualizado.length == 0) {
      return response.status(404).json({
        Prezades: `O voluntário não foi encontrado.`,
      });
    }

    //Deve retornar(200) caso encontre o paciente por Id.
    response.status(200).send({
      Prezades: "Voluntário atualizado com sucesso",
      usuario,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const deletarVoluntario = async (request, response) => {
  const { email} = request.body;
    try {
      VoluntarioSchema.findOne({ email: request.body.email }, (error, user) => {
        if (!user) {
          return response.status(404).send({
            Prezades: "Usuário não encontrado",
          });
        }
    
        const validPassword = bcrypt.compareSync(
          request.body.password,
          user.password
        );
        if (!validPassword) {
          return response.status(401).send({
            Alerta: "Senha inválida.",
          });
        }
      });
        
      const removeVoluntario = await VoluntarioSchema.deleteOne({ email });
      if (removeVoluntario.deletedCount === 1) {
        return response.status(204).send({ Prezades: `Sem resultado!` });
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
  filtrarVoluntarioDisponibilidade,
  atualizarVoluntarioById,
  deletarVoluntario,
};
