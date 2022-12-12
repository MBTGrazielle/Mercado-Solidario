const app = require("../app")
const request = require("supertest")
const model = require("../models/FamiliaSchema")
const jwt = require('jsonwebtoken');
const SECRET= process.env.SECRET

describe('Familia Controller', () => {

  const token="bearer "+jwt.sign({ name:"grazielle" }, SECRET)
  
  const familiaMock = {
    numero_cartao_alimentacao:"6391e999bba2beb2d7aed62e",
      numero_nis: "4785965842132255",
      numero_integrantes_familia: 2,
      name_integrantes_familia: ["alane","pricila","Leticia"],
      name_do_responsavel_familiar:"Joselita",
      cpf_do_responsavel_familiar:"04830212968",
      renda_familiar:2000,
      endereco: {
      cep: "41600110",
      rua: "Rua das Meninas",
      numero: "589",
      complemento: "predio",
      referencia: "Ao lado do Atacadao",
      estado: "Bahia",
      cidade: "Salvador",
      bairro:"Mata Exura"}, 
      telefone: "71985741525"
  }

  beforeAll(async () => {
    const newfamilia = new model(familiaMock)
    await newfamilia.save()

    familiaMock.id =newfamilia.id
  })

  afterAll(async () => {
    await model.deleteMany() // deletar muitos
  })

  test('Deve retornar todas as famílias, status(200)', (done) => {
     request(app)
     .get("/familia/all")
     .set("authorization", token)
     .expect(200)
     .expect(response => {
        expect(response.body.Prezades).toContain("Encontramos")
        expect(response.body.Prezades).toContain("família")
     })
     .end(err => {
        if (err) return done(err)
        return done()
     })
  })

  test("Deve retornar família, status (200), na busca pelo nome do responsável familiar", (done) => {
    request(app)
    .get("/familia/buscarNome/" + familiaMock.name_do_responsavel_familiar)
    .set("authorization", token)
    .expect(200)
    .expect(response=>{
      expect(response.body.Prezades).toBe(`Segue a família encontrada através do nome do representante familiar: [${familiaMock.name_do_responsavel_familiar}]`)})
    .end(err => done(err))
  })

  test("Deve retornar status (404), se não encontrar a família pela busca pelo nome do responsável familiar", (done) => {
    fakeName='Joana'
    request(app)
    .get("/familia/buscarNome/" + fakeName)
    .set("authorization", token)
    .expect(404)
    .expect(response=>{
      expect(response.body.Prezades).toBe(`A familia não foi encontrada.`)})
    .end(err => done(err))
  })

  test("Deve retornar status (400), se o cartão alimentação estiver incorreto- caracteres a mais", (done) => {
    fakeCartao='6391e999bba2beb2d7aed62f7'
    request(app)
    .get("/familia/buscarCartao/" + fakeCartao)
    .set("authorization", token)
    .expect(400)
    .expect(response=>{
      expect(response.body.message).toBe(`Número incorreto. Caracter a mais: ${
        fakeCartao.length - 24
      }.`)})
    .end(err => done(err))
  })

  test("Deve retornar status (400), se o cartão alimentação estiver incorreto- caracteres a menos", (done) => {
    fakeCartao='6391e999b'
    request(app)
    .get("/familia/buscarCartao/" + fakeCartao)
    .set("authorization", token)
    .expect(400)
    .expect(response=>{
      expect(response.body.message).toBe(`Número incorreto. Caracter a menos: ${24-
        fakeCartao.length
      }.`)})
    .end(err => done(err))
  })

  test("Deve retornar família, status (200), na busca pelo número do cartão alimentação", (done) => {
    request(app)
    .get("/familia/buscarCartao/" + familiaMock.numero_cartao_alimentacao)
    .set("authorization", token)
    .expect(200)
    .expect(response=>{
      expect(response.body.Prezades).toBe(`Segue a família encontrada para este cartão [${familiaMock.numero_cartao_alimentacao}]:`)})
    .end(err => done(err))
  })

  test('Deve retornar to perfil econômico das famílias cadastradas, status(200)', (done) => {
    request(app)
    .get("/familia/perfilEconomico")
    .set("authorization", token)
    .expect(200)
    .expect(response => {
       expect(response.body.Media_Renda_Familiar).toContain("R$")
    })
    .end(err => {
       if (err) return done(err)
       return done()
    })
 })

  test("Deve cadastrar(201) nova família", (done) => {
    const familiaBody = {
      numero_nis: "4785965842132255",
      numero_integrantes_familia: 2,
      name_integrantes_familia: ["alane","pricila","Leticia"],
      name_do_responsavel_familiar:"Joselita",
      cpf_do_responsavel_familiar:"04830212978",
      renda_familiar:2000,
      endereco: {
      cep: "41600110",
      rua: "Rua das Meninas",
      numero: "589",
      complemento: "predio",
      referencia: "Ao lado do Atacadao",
      estado: "Bahia",
      cidade: "Salvador",
      bairro:"Mata Exura"}, 
      telefone: "71985741525"
    }

    request(app)
    .post("/familia/criar")
    .send(familiaBody)
    .set("authorization", token)
    .expect(201)
    .expect(response => {
       expect(response.body.Bem_vindes).toBe("Família cadastrada com sucesso")
    })
    .end(err => {
       return done(err)
    })
  })

  test("Deve atualizar a família pelo numero do cartao alimentacao, status (200)", (done) => {
    const familiaBody = {
      numero_integrantes_familia: 3,
      name_integrantes_familia: ["alane","pricila","Leticia"],
      name_do_responsavel_familiar:"Grazielle",
      telefone: "71985741524"
    }
    request(app)
    .patch("/familia/atualizar/" + familiaMock.numero_cartao_alimentacao)
    .send(familiaBody)
    .set("authorization", token)
    .expect(200)
    .expect(response=>{
      expect(response.body.Prezades).toBe("Família atualizada com sucesso")})
    .end(err => done(err))
  })

  test("Deve retornar status (400) ao tentar atualizar numero do cartão nis", (done) => {
    const familiaBody = {
      numero_nis:"7485471596685",
      numero_integrantes_familia: 3,
      name_integrantes_familia: ["alane","pricila","Leticia"],
      name_do_responsavel_familiar:"Grazielle",
      telefone: "71985741524"
    }
    request(app)
    .patch("/familia/atualizar/" + familiaMock.numero_cartao_alimentacao)
    .send(familiaBody)
    .set("authorization", token)
    .expect(400)
    .expect(response=>{
      expect(response.body.message).toBe("Não é possivel atualizar o número do cartão NIS .")})
    .end(err => done(err))
  })

  test("Deve deletar a família, status (200) ", (done) => {
    request(app)
    .delete("/familia/deletar/"+ familiaMock.numero_cartao_alimentacao)
    .set("authorization", token)
    .expect(204)
    .end(err => done(err))
  })

  test("Deve retornar status (404) com cartão incorreto ", (done) => {
    fakeCartao='6394e4fa93f6c7d814be99d6'
    request(app)
    .delete("/familia/deletar/"+ fakeCartao)
    .set("authorization", token)
    .expect(404)
    .expect(response=>{
      expect(response.body.Prezades).toBe("A família não foi encontrada.")})
    .end(err => done(err))
  })

});
