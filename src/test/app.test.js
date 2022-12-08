const app = require("../app")
const request = require("supertest")
const model = require("../models/VoluntarioSchema")
const jwt = require('jsonwebtoken');
const SECRET= process.env.SECRET

describe('Voluntario Controller', () => {

  const token="bearer "+jwt.sign({ name:"grazielle" }, SECRET)
  
  const voluntarioMock = {
nome:" Gre ",
telefone:" 1234 ",
endereco:" teste ",
plano_saude:" Unimed ",
plano_saude_numero:5871485962
  }

  beforeAll(async () => {
    const newpaciente = new model(pacienteMock)
    await newpaciente.save()

    pacienteMock.id =newpaciente.id
  })

//testa quantos pacientes existem 200 ok
  test('Deve retornar todos os pacientes, status(200)', (done) => {
     request(app)
     .get("/paciente/")
     .set("authorization", token)
     .expect(200)
     .expect(response => {
        expect(response.body.message).toContain("Encontramos")
        expect(response.body.message).toContain("paciente")
     })
     .end(err => {
        if (err) return done(err)
        return done()
     })
  })

 //testa se o banco de dados está vazio 404 ok
//   test('GET /paciente/', (done) => {
//     request(app)
//     .get("/paciente/")
//     .expect(404)
//     .expect(response => {
//        expect(response.body.message).toBe("Não encontramos nenhum paciente até o momento.")
//     })
//     .end(err => {
//        if (err) return done(err)
//        return done()
//     })
//  })

//testa paciente por id 200 ok
test("Deve retornar paciente, status (200), na busca por Id", (done) => {
    request(app)
    .get("/paciente/" + pacienteMock.id)
    .set("authorization", token)
    .expect(200)
    .expect(response=>{
      expect(response.body.Prezades).toBe(`Segue o paciente para este id [${pacienteMock.id}]:`)})
    .end(err => done(err))
  })

test("Deve retornar erro(404) na busca do paciente por Id", (done) => {
  fakeId= '6384c61fd1ba6eb220940245'
    request(app)
    .get("/paciente/" + fakeId)
    .set("authorization", token)
    .expect(404)
    .expect(response=>{
      expect(response.body.Prezades).toBe(undefined)})
    .end(err => done(err))
  })
 
  test("Deve retonar não autorizado(401) ao criar novo usuário com mesmo numero de plano", (done) => {
    const pacienteBody = {
      nome:" Gre ",
telefone:" 1234 ",
endereco:" teste ",
plano_saude:" Unimed ",
plano_saude_numero:5871485962
    }

    request(app)
    .post("/paciente/")
    .send(pacienteBody)
    .set("authorization", token)
    .expect(401)
    .expect(response => {
       expect(response.body.message).toBe("Não é possível cadastrar esse número de plano novamente.")
    })
    .end(err => {
       return done(err)
    })
  })

test("Deve criar(200) novo paciente", (done) => {
    const pacienteBody = {
      nome: "Grazielle",
    telefone: "1234",
    endereco: "teste",
    plano_saude:"Unimed",
    plano_saude_numero: 65262626457457626265
    }

    request(app)
    .post("/paciente/")
    .send(pacienteBody)
    .set("authorization", token)
    .expect(200)
    .expect(response => {
       expect(response.body.message).toBe("Paciente cadastrado com sucesso")
    })
    .end(err => {
       return done(err)
    })
  })

  test("Deve atualizar o paciente por Id, status (200)", (done) => {
    const pacienteBody = {
      nome: "Grazielle",
      telefone: "71997295879",
      endereco: "teste1",
    plano_saude:"Bradesco",
    plano_saude_numero: 5871485
    }
    request(app)
    .patch("/paciente/" + pacienteMock.id)
    .send(pacienteBody)
    .set("authorization", token)
    .expect(200)
    .expect(response=>{
      expect(response.body.message).toBe("Paciente atualizado com sucesso")})
    .end(err => done(err))
  })

test("Deve retornar erro(404) ao atualizar o paciente que não existe", (done) => {
  fakeId = '6384c61fd1ba6eb220940245';
  const pacienteBody = {
    nome: "nome at",
    telefone: "telefone atualizado",
    endereco: "teste",
  plano_saude:"Unimed",
  plano_saude_numero: 5871485
  }
  request(app)
  .patch("/paciente/" + fakeId)
  .send(pacienteBody)
  .set("authorization", token)
  .expect(404)
  .expect(response=>{
    expect(response.body.message).toBe('O paciente não foi encontrado.')})
  .end(err => done(err))
})

  test("Deve deletar o paciente por Id, status (200) ", (done) => {
    request(app)
    .delete("/paciente/" +pacienteMock.id)
    .set("authorization", token)
    .expect(200)
    .expect(response=>{
      expect(response.body.message).toBe("O paciente foi deletado com sucesso!")})
    .end(err => done(err))
  })

 test("Deve retornar erro(404) ao deletar paciente que nao existe", (done) => {
  fakeId = '6384c61fd1ba6eb220940245';
  request(app)
  .delete("/paciente/" + fakeId)
  .set("authorization", token)
  .expect(404)
  .expect(response=>{
    expect(response.body.message).toBe("O paciente não foi encontrado.")})
  .end(err => done(err))
})

});
