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

  test("Deve retornar voluntário, status (200), na busca por cpf", (done) => {
    request(app)
    .get("/voluntario/buscarCpf/" + voluntarioMock.cpf)
    .set("authorization", token)
    .expect(200)
    .expect(response=>{
      expect(response.body.Prezades).toBe(`Segue o voluntário para este cpf [${voluntarioMock.cpf}]:`)})
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

});
