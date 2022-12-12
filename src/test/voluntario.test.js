const app = require("../app")
const request = require("supertest")
const model = require("../models/VoluntarioSchema")
const jwt = require('jsonwebtoken');
const SECRET= process.env.SECRET

describe('Voluntario Controller', () => {

  const token="bearer "+jwt.sign({ name:"grazielle" }, SECRET)
  
  const voluntarioMock = {
      name:"Grazi",
      cpf:"04830212533",
      telefone:"71985742562",
      email:"grazi47@gmail.com",
      disponibilidade_dia:"segunda",
      disponibilidade_turno:"vespertino",
      password:"048"
  }

  beforeAll(async () => {
    const newvoluntario = new model(voluntarioMock)
    await newvoluntario.save()

    voluntarioMock.id =newvoluntario.id
  })

  afterAll(async () => {
    await model.deleteMany() 
  })

  test('Deve retornar todos os voluntários, status(200)', (done) => {
     request(app)
     .get("/voluntario/all")
     .set("authorization", token)
     .expect(200)
     .expect(response => {
        expect(response.body.Prezades).toContain("Encontramos")
        expect(response.body.Prezades).toContain("voluntário")
     })
     .end(err => {
        if (err) return done(err)
        return done()
     })
  })

  test("Deve retornar voluntário, status (200), na busca por Id", (done) => {
    request(app)
    .get("/voluntario/buscarId/" + voluntarioMock.id)
    .set("authorization", token)
    .expect(200)
    .expect(response=>{
      expect(response.body.Prezades).toBe(`Segue o voluntário para este id [${voluntarioMock.id}]:`)})
    .end(err => done(err))
  })

  test("Deve retornar status (400), no erro de digitação do Id(caracteres a mais)", (done) => {
    fakeId='6392e989cba2beb2d7aed42e4785ss'
    request(app)
    .get("/voluntario/buscarId/" + fakeId)
    .set("authorization", token)
    .expect(400)
    .expect(response=>{
      expect(response.body.message).toBe(`Id incorreto. Caracter a mais: ${fakeId.length - 24}.`)})
    .end(err => done(err))
  })

  test("Deve retornar status (400), no erro de digitação do Id(caracteres a menos)", (done) => {
    fakeId='6392e989cb'
    request(app)
    .get("/voluntario/buscarId/" + fakeId)
    .set("authorization", token)
    .expect(400)
    .expect(response=>{
      expect(response.body.message).toBe(`Id incorreto. Caracter a menos: ${24-fakeId.length}.`)})
    .end(err => done(err))
  })

  test("Deve retornar status (404), para voluntario não encontrado pelo Id", (done) => {
    fakeId='6394f1a5065982c30125f207'
    request(app)
    .get("/voluntario/buscarId/" + fakeId)
    .set("authorization", token)
    .expect(404)
    .expect(response=>{
      expect(response.body.Prezades).toBe(`O voluntário não foi encontrado.`)})
    .end(err => done(err))
  })

  test("Deve retornar voluntário, status (200), na busca por cpf", (done) => {
    request(app)
    .get("/voluntario/buscarCpf/" + voluntarioMock.cpf)
    .set("authorization", token)
    .expect(200)
    .expect(response=>{
      expect(response.body.Prezades).toBe(`Segue o voluntário para este cpf [${voluntarioMock.cpf}]:`)})
    .end(err => done(err))
  })

  test("Deve retornar status (400), no erro de digitação do cpf(caracteres a mais)", (done) => {
    fakeCpf='048302125358'
    request(app)
    .get("/voluntario/buscarCpf/" + fakeCpf)
    .set("authorization", token)
    .expect(400)
    .expect(response=>{
      expect(response.body.message).toBe(`Digite um CPF válido.`)})
    .end(err => done(err))
  })

  test("Deve retornar status (400), no erro de digitação do cpf(caracteres a menos)", (done) => {
    fakeCpf='048'
    request(app)
    .get("/voluntario/buscarCpf/" + fakeCpf)
    .set("authorization", token)
    .expect(400)
    .expect(response=>{
      expect(response.body.message).toBe(`Digite um CPF válido.`)})
    .end(err => done(err))
  })

  test("Deve retornar status (404), para voluntario não encontrado pelo cpf", (done) => {
    fakeCpf='04830214785'
    request(app)
    .get("/voluntario/buscarCpf/" + fakeCpf)
    .set("authorization", token)
    .expect(404)
    .expect(response=>{
      expect(response.body.Prezades).toBe(`O voluntário não foi encontrado.`)})
    .end(err => done(err))
  })

  test("Deve retornar filtro de disponibilidade (200) do voluntario", (done) => {
    const voluntarioBody = {
disponibilidade_dia:" terça ",
disponibilidade_turno:" vespertino ",
    }
    request(app)
    .get("/voluntario/filtroDisponibilidade")
    .send(voluntarioBody)
    .set("authorization", token)
    .expect(200)
    .expect(response=>{
      expect(response.body.Prezades).toBe(`Segue a lista de voluntários por dia e turno:`)})
    .end(err => done(err))
  })

  test("Deve retornar status (400) por não preencher campo obrigatório e tipo de dado incorreto no filtro de disponibilidade ", (done) => {
    const voluntarioBody = {
disponibilidade_dia:1258965,
disponibilidade_turno:"",
    }
    request(app)
    .get("/voluntario/filtroDisponibilidade")
    .send(voluntarioBody)
    .set("authorization", token)
    .expect(400)
    .expect(response=>{
      expect(response.body.message).toBe(`O preenchimento da disponbilidade de dia e turno é obrigatório`)})
    .end(err => done(err))
  })

  test("Deve criar(201) novo paciente", (done) => {
    const voluntarioBody = {
      name:"Grazi",
      cpf:"04830212748",
      telefone:"71985742562",
      email:"paula@gmail.com",
      disponibilidade_dia:"segunda",
      disponibilidade_turno:"vespertino",
      password:"048"
    }

    request(app)
    .post("/voluntario/criar")
    .send(voluntarioBody)
    .set("authorization", token)
    .expect(201)
    .expect(response => {
       expect(response.body.Bem_vindes).toBe("Parabéns por sua iniciativa! O seu usuário foi cadastrado!")
    })
    .end(err => {
       return done(err)
    })
  })

  test("Deve atualizar o voluntário por Id, status (200)", (done) => {
    const voluntarioBody = {
      name:"Grazi",
      telefone:"71985742562",
      email:"grazi48@gmail.com",
      disponibilidade_dia:"quarta",
      disponibilidade_turno:"vespertino",
      password:"048"
    }
    request(app)
    .patch("/voluntario/atualizar/" + voluntarioMock.id)
    .send(voluntarioBody)
    .set("authorization", token)
    .expect(200)
    .expect(response=>{
      expect(response.body.Prezades).toBe("Voluntário atualizado com sucesso")})
    .end(err => done(err))
  })

  test("Deve retornar status (400) com preenchimento do turno: noturno", (done) => {
    const voluntarioBody = {
      name:"Grazi",
      telefone:"71985742562",
      email:"grazi48@gmail.com",
      disponibilidade_dia:"quarta",
      disponibilidade_turno:"noturno",
      password:"048"
    }
    request(app)
    .patch("/voluntario/atualizar/" + voluntarioMock.id)
    .send(voluntarioBody)
    .set("authorization", token)
    .expect(400)
    .expect(response=>{
      expect(response.body.message).toBe("O mercado solidário não funciona a noite.")})
    .end(err => done(err))
  })

  test("Deve retornar status (400)-atualizar, no erro de digitação do Id(caracteres a mais)", (done) => {
    fakeId='6392e989cba2beb2d7aed42e4785ss'
    const voluntarioBody = {
      name:"Grazi",
      telefone:"71985742562",
      email:"grazi47@gmail.com",
      disponibilidade_dia:"segunda",
      disponibilidade_turno:"vespertino",
      password:"048"
  }
    request(app)
    .patch("/voluntario/atualizar/" + fakeId)
    .send(voluntarioBody)
    .set("authorization", token)
    .expect(400)
    .expect(response=>{
      expect(response.body.message).toBe(`Id incorreto. Caracter a mais: ${fakeId.length - 24}.`)})
    .end(err => done(err))
  })

  test("Deve retornar status (400)-atualizar, no erro de digitação do Id(caracteres a menos)", (done) => {
    fakeId='6392e989cb'
    const voluntarioBody = {
      name:"Grazi",
      telefone:"71985742562",
      email:"grazi47@gmail.com",
      disponibilidade_dia:"segunda",
      disponibilidade_turno:"vespertino",
      password:"048"
  }
    request(app)
    .patch("/voluntario/atualizar/" + fakeId)
    .send(voluntarioBody)
    .set("authorization", token)
    .expect(400)
    .expect(response=>{
      expect(response.body.message).toBe(`Id incorreto. Caracter a menos: ${24-fakeId.length}.`)})
    .end(err => done(err))
  })

  test("Deve retornar status (400)-atualizar, cpf-não é permitido atualizar", (done) => {
    const voluntarioBody = {
      name:"Grazi",
      telefone:"71985742562",
      cpf:"04857489652",
      email:"grazi47@gmail.com",
      disponibilidade_dia:"segunda",
      disponibilidade_turno:"vespertino",
      password:"048"
  }
    request(app)
    .patch("/voluntario/atualizar/" + voluntarioMock.id)
    .send(voluntarioBody)
    .set("authorization", token)
    .expect(400)
    .expect(response=>{
      expect(response.body.message).toBe(`Não é possivel atualizar o CPF.`)})
    .end(err => done(err))
  })

  test("Deve deletar o voluntário, status (200) ", (done) => {
    const voluntarioBody={
        email:"paula@gmail.com",
        password:"048"
    }
    request(app)
    .delete("/voluntario/deletar/")
    .send(voluntarioBody)
    .set("authorization", token)
    .expect(204)
    .end(err => done(err))
  })

  test("Deve retornar status (404) se não encontrar o email do voluntario", (done) => {
    const voluntarioBody={
      email:"luana@gmail.com",
      password:"048"
  }
    request(app)
    .delete("/voluntario/deletar/")
    .send(voluntarioBody)
    .set("authorization", token)
    .expect(404)
    .expect(response=>{
      expect(response.body.Prezades).toBe(`Usuário não encontrado`)})
    .end(err => done(err))
  })

});
