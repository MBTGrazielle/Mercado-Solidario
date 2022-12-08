const mongoose = require("mongoose");
const FamiliaSchema = require("../models/FamiliaSchema");
const validarItens = require("../utils/servico");

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

  //Deve retornar(400) se a renda familiar per capita for superior a 1.5 salário mínimo
  const rendaPerCapita=(renda_familiar/numero_integrantes_familia)
  if(validarItens.validarRendaFamiliarPerCapita(rendaPerCapita)){
    return response.status(401).json({
      message: validarItens.validarRendaFamiliarPerCapita(rendaPerCapita),
    });
  }

  //Deve retornar(400) ao inserir tipo de dado incorreto;
  //e caso não respeite o preenchimento obrigatório.
  if (validarItens.validaTipoEObrigatoriedadeFamilia(request.body)){
    return response.status(400).json({
      message: validarItens.validaTipoEObrigatoriedadeFamilia(request.body),
    });
  }

  //Deve retornar conflito(409) ao cadastrar um cpf existente no banco de dados

  const cpfExiste = await FamiliaSchema.exists({
    cpf_do_responsavel_familiar: request.body.cpf_do_responsavel_familiar,
  });
  if (cpfExiste) {
    return response.status(409).send({
      Alerta: "Este CPF já está cadastrado."
    });
  }

  //Deve retornar(400) caso o CPF não possua 11 caracteres.
  if(validarItens.validaCpfResponsavelFamiliar(request.body)){
    return response.status(400).json({
      message: validarItens.validaCpfResponsavelFamiliar(request.body),
    });
  }

  try {
    const novoUsuario = new FamiliaSchema(request.body);
    const salvarUsuario = await novoUsuario.save();

    //Deve retornar(201) quando criar a família.

    response.status(201).send({
      Bem_vindes: "Família cadastrada com sucesso",
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

    if (familia.length > 0) {
      return response.status(200).json({
        Prezades: `Encontramos ${familia.length} família${familia.length === 1? "": "s"}.`,
        Lista_voluntarios: familia,
      });

      //Deve retornar(404) caso não exista familia cadastrada.
    } else {
      return response.status(404).json({
        Prezades: `Nenhuma família foi cadastrada até o momento.`
      });
    }
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

const perfilEconomico = async (request, response) => {
  try{
    const familias = await FamiliaSchema.find();
    let mediaRendaFamiliar = 0
    let mediaNumeroPessoas=0
    let qtdFamilias = familias.length

    familias.forEach((a)=>{
      mediaNumeroPessoas += a.numero_integrantes_familia
      mediaRendaFamiliar += a.renda_familiar/qtdFamilias
    })
 
    response.status(200).json({Media_Renda_Familiar: `R$ ${mediaRendaFamiliar.toFixed(0)}`,Total_Pessoas_Cadastradas:mediaNumeroPessoas})
  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }}

const buscarFamiliaByNameResponsavelFamiliar = async (request, response) => {
  const { name_do_responsavel_familiar } = request.params;

  try {
    const familia = await FamiliaSchema.find({ name_do_responsavel_familiar });

    //Deve retornar(404) caso o nome do responsável familiar não exista no banco de dados.

    if (familia.length == 0) {
      return response.status(404).json({
        Prezades: `A familia não foi encontrada.`
      });
    }

    //Deve retornar(200) caso o nome do responsável familiar exista no banco de dados.

    response.status(200).json({
      Prezades: `Segue a família encontrada através do nome do representante familiar: [${name_do_responsavel_familiar}]`,
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
if(validarItens.validaCartaoAlimentacao(request.params)){
  return response.status(400).json({
    message: validarItens.validaCartaoAlimentacao(request.params),
  });
}

  try {
    const familiaNumeroCartao = await FamiliaSchema.find({
      numero_cartao_alimentacao,
    });

    //Deve retornar(404) caso o número do cartão alimentação não exista no banco de dados.

    if (familiaNumeroCartao.length == 0) {
      return response.status(404).json({
        Prezades: `A família não foi encontrada.`
      });
    }

    //Deve retornar(200) caso o número do cartão alimentação exista no banco de dados.

    response.status(200).json({
      Prezades: `Segue a família encontrada para este cartão [${numero_cartao_alimentacao}]:`,
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

  if(validarItens.validaCartaoAlimentacao(request.params)){
    return response.status(400).json({
      message: validarItens.validaCartaoAlimentacao(request.params),
    });
  }

  //Deve retornar mensagem de erro(400) ao atualizar o cartão NIS.

  if(validarItens.naoPermiteAtualizarNis(request.body)){
    return response.status(400).json({
      message: validarItens.naoPermiteAtualizarNis(request.body),
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
        Prezades: `A família não foi encontrada.`
      });
    }

    //Deve retornar(200) caso encontre a família pelo número do cartão alimentação.

    response.status(200).send({
      Prezades: "Família atualizada com sucesso",
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
  if(validarItens.validaCartaoAlimentacao(request.params)){
    return response.status(400).json({
      message: validarItens.validaCartaoAlimentacao(request.params),
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
        Prezades: "A família não foi encontrada."
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
  perfilEconomico,
  buscarFamiliaByNameResponsavelFamiliar,
  buscarFamiliaByCartao,
  atualizarFamiliaByCartao,
  deletarVoluntarioByCartao,
};
