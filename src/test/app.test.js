const app = require("../app");
const request = require("supertest");
const model = require("../models/PacienteSchema");

describe("Paciente Controller", () => {
  const pacienteMock = {
    nome: " Gre ",
    telefone: " 1234 ",
    endereco: " teste ",
    plano_saude: " Unimed ",
    plano_saude_numero: 5871485962,
  };

  beforeAll(async () => {
    const newpaciente = new model(pacienteMock);
    await newpaciente.save();

    pacienteMock.id;
  });

  //testa quantos pacientes existem 200 ok
  test("GET /paciente/", (done) => {
    request(app)
      .get("/paciente/")
      .expect(200)
      .expect((response) => {
        expect(response.body.message).toContain("Encontramos");
        expect(response.body.message).toContain("paciente");
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

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
  test("GET /paciente/:id", (done) => {
    fakeId = "6384c61fd1ba6eb220940242";
    request(app)
      .get("/paciente/" + fakeId)
      .expect(200)
      .expect((response) => {
        expect(response.body.Prezades).toBe(
          `Segue o paciente para este id [6384c61fd1ba6eb220940242]:`
        );
      })
      .end((err) => done(err));
  });

  // //testa paciente por id 404 ok
  test("GET /paciente/:id", (done) => {
    fakeId = "6384c61fd1ba6eb220940245";
    request(app)
      .get("/paciente/" + fakeId)
      .expect(404)
      .expect((response) => {
        expect(response.body.Prezades).toBe(undefined);
      })
      .end((err) => done(err));
  });

  // //teste criar usuario com o mesmo numero de plano 401 ok
  test("POST /paciente/", (done) => {
    const pacienteBody = {
      nome: " Gre ",
      telefone: " 1234 ",
      endereco: " teste ",
      plano_saude: " Unimed ",
      plano_saude_numero: 5871485962,
    };

    request(app)
      .post("/paciente/")
      .send(pacienteBody)
      .expect(401)
      .expect((response) => {
        expect(response.body.message).toBe(
          "Não é possível cadastrar esse número de plano novamente."
        );
      })
      .end((err) => {
        return done(err);
      });
  });

  // //teste criar usuario 200 ok
  test("POST /paciente/", (done) => {
    const pacienteBody = {
      nome: "Grazielle",
      telefone: "1234",
      endereco: "teste",
      plano_saude: "Unimed",
      plano_saude_numero: 652629859885952,
    };

    request(app)
      .post("/paciente/")
      .send(pacienteBody)
      .expect(200)
      .expect((response) => {
        expect(response.body.message).toBe("Paciente cadastrado com sucesso");
      })
      .end((err) => {
        return done(err);
      });
  });

  // // //testa atualizar paciente encontrado 200 ok
  test("PATCH /paciente/:id", (done) => {
    fakeId = "6384c61fd1ba6eb220940242";
    const pacienteBody = {
      nome: "Grazielle",
      telefone: "71997295879",
      endereco: "teste1",
      plano_saude: "Bradesco",
      plano_saude_numero: 5871485,
    };
    request(app)
      .patch("/paciente/" + fakeId)
      .send(pacienteBody)
      .expect(200)
      .expect((response) => {
        expect(response.body.message).toBe("Paciente atualizado com sucesso");
      })
      .end((err) => done(err));
  });

  // //   //testa atualizar paciente não encontrado 404 ok
  test("PATCH /paciente/:id", (done) => {
    fakeId = "6384c61fd1ba6eb220940245";
    const pacienteBody = {
      nome: "nome at",
      telefone: "telefone atualizado",
      endereco: "teste",
      plano_saude: "Unimed",
      plano_saude_numero: 5871485,
    };
    request(app)
      .patch("/paciente/" + fakeId)
      .send(pacienteBody)
      .expect(404)
      .expect((response) => {
        expect(response.body.message).toBe("O paciente não foi encontrado.");
      })
      .end((err) => done(err));
  });

  // //   //testa delete 200 ok //modificar sempre o id, pois ele apaga
  test("DELETE /paciente/:id", (done) => {
    fakeId = "6384c61fd1ba6eb220940242";
    request(app)
      .delete("/paciente/" + fakeId)
      .expect(200)
      .expect((response) => {
        expect(response.body.message).toBe(
          "O paciente foi deletado com sucesso!"
        );
      })
      .end((err) => done(err));
  });

  //testa delete 404 ok
  test("DELETE /paciente/:id", (done) => {
    fakeId = "6384c61fd1ba6eb220940245";
    request(app)
      .delete("/paciente/" + fakeId)
      .expect(404)
      .expect((response) => {
        expect(response.body.message).toBe("O paciente não foi encontrado.");
      })
      .end((err) => done(err));
  });
});
