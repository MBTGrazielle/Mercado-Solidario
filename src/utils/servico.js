function naoPermiteTurnoNoturno(body) {
    if(body.disponibilidade_turno=="noturno"){
    return `O mercado solidário não funciona a noite.`
}
}

function naoPermiteAtualizarNis(body){
    if (body.numero_nis) {
        return  `Não é possivel atualizar o número do cartão NIS .`
      }
}

function validaTipoEObrigatoriedadeVoluntario(body) {
    if (typeof body.name !== "string" || body.name.trim() === "") {
        return  `A string nome é obrigatória.`
      } else if (typeof body.cpf !== "string" || body.cpf.trim() === "") {
        return `A string do CPF é obrigatória.`
      } else if (typeof body.email !== "string" || body.email.trim() === "") {
        return `A string do email é obrigatória.`
      }else if(typeof body.telefone !== "string" || body.telefone.trim() === ""){
        return `A string do telefone é obrigatória.`
      }else if(typeof body.disponibilidade_dia	 !== "string" || body.disponibilidade_dia.trim() === ""){
        return `A string da disponibilidade do dia é obrigatória.`
      }else if(typeof body.disponibilidade_turno	 !== "string" || body.disponibilidade_turno.trim() === ""){
        return `A string da disponibilidade do turno é obrigatória.`
      }
}

function validaTipoEObrigatoriedadeFamilia(body){
    if (typeof body.numero_nis !== "string" || body.numero_nis.trim() === "") {
        return `A string do NIS é obrigatória.`
      } else if (typeof body.numero_integrantes_familia !== "number") {
        return  `O número de integrantes da família é obrigatório.`
      } else if (
        typeof body.name_do_responsavel_familiar !== "string" ||
        body.name_do_responsavel_familiar.trim() === ""
      ) {
        return  `A string do nome do responsável familiar é obrigatória.`
      } else if (
        typeof body.cpf_do_responsavel_familiar !== "string" ||
        body.cpf_do_responsavel_familiar.trim() === ""
      ) {
        return  `A string do cpf do responsável familiar é obrigatória.`
      } else if (typeof body.renda_familiar !== "number") {
        return  `O número da renda familiar é obrigatório.`
      } else if (typeof body.telefone !== "string" || body.telefone.trim() === "") {
        return  `A string do telefone é obrigatória.`
      }
}

function validaTipoEObrigatoriedadeDoacao(body){
  if (typeof body.name_produto !== "string" || body.name_produto.trim() === "") {
      return `A string do nome do produto é obrigatória.`
    } else if (typeof body.quantidade_produto !== "number") {
      return  `O número da quantidade de produtos é obrigatório.`
    } else if (
      typeof body.categoria_produto !== "string" ||
      body.categoria_produto.trim() === ""
    ) {
      return  `A string da categoria do produto é obrigatória.`
    }
}

function validaCpfVoluntario(body){
    if (body.cpf.length < 11 || body.cpf.length > 11) {
        return  `Digite um CPF válido.`
}}

function validaCpfResponsavelFamiliar(body){
    if (body.cpf_do_responsavel_familiar.length < 11 || body.cpf_do_responsavel_familiar.length > 11) {
        return  `Digite um CPF válido.`
}}

function validaCartaoAlimentacao(body){
    if (body.numero_cartao_alimentacao.length > 24) {
        return  `Número incorreto. Caracter a mais: ${
            body.numero_cartao_alimentacao.length - 24
          }.`
      }
      if (body.numero_cartao_alimentacao.length < 24) {
        return `Número incorreto. Caracter a menos: ${
            24 - body.numero_cartao_alimentacao.length
          }.`
      }
}

function validaId(body){
    if (body.id.length > 24) {
        return `Id incorreto. Caracter a mais: ${body.id.length - 24}.`
      }
      if (body.id.length < 24) {
        return `Id incorreto. Caracter a menos: ${24 - body.id.length}.`
      }
}

function validaPreenchimentoDisponibilidade(body){
    if(!body.disponibilidade_dia||!body.disponibilidade_turno){
        return  `O preenchimento da disponbilidade de dia e turno é obrigatório`
}}

function validaPreenchimentoCpf(body){
    if (body.cpf) {
        return  `Não é possivel atualizar o CPF.`
      }
}

function validarRendaFamiliarPerCapita(rendaPerCapita){
  if(rendaPerCapita>1818){
    return `Erro ao cadastrar: Renda familiar per capita superior a 1,5 salário mínimo.`
    }
  }



module.exports = {
    naoPermiteTurnoNoturno,
    naoPermiteAtualizarNis,
    validaTipoEObrigatoriedadeVoluntario,
    validaTipoEObrigatoriedadeFamilia,
    validaTipoEObrigatoriedadeDoacao,
    validaCpfVoluntario,
    validaCpfResponsavelFamiliar,
    validaCartaoAlimentacao,
    validaId,
    validaPreenchimentoDisponibilidade,
    validaPreenchimentoCpf,
    validarRendaFamiliarPerCapita
}