const app = require("../app");
const request = require("supertest");
const model = require("../models/DoacaoSchema");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

describe("Familia Controller", () => {
  const token = "bearer " + jwt.sign({ name: "grazielle" }, SECRET);

  const doacaoMock = {
    name_produto: "sabão",
    categoria_produto: "limpeza",
    quantidade_produto: 3,
    pontos_por_produto:1
  };

  beforeAll(async () => {
    const newdoacao = new model(doacaoMock);
    await newdoacao.save();

    doacaoMock.id = newdoacao.id;
  });

  afterAll(async () => {
    await model.deleteMany(); // deletar muitos
  });

  test("Deve retornar todas as doações, status(200)", (done) => {
    request(app)
      .get("/doacao/all")
      .set("authorization", token)
      .expect(200)
      .expect((response) => {
        expect(response.body.Prezades).toContain("Encontramos");
        expect(response.body.Prezades).toContain("doaç");
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test("Deve retornar doação, status (200), na busca por Id", (done) => {
    request(app)
      .get("/doacao/buscar/" + doacaoMock.id)
      .set("authorization", token)
      .expect(200)
      .expect((response) => {
        expect(response.body.Prezades).toBe(
          `Segue a doação para este id [${doacaoMock.id}]:`
        );
      })
      .end((err) => done(err));
  });

  test("Deve retornar status (400), pela digitação incorreta por Id na busca por doação-caracteres a mais", (done) => {
    fakeId='6394c4a95f3a1dd3cb879ee487'
    request(app)
      .get("/doacao/buscar/" + fakeId)
      .set("authorization", token)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toBe(
          `Id incorreto. Caracter a mais: ${fakeId.length - 24}.`
        );
      })
      .end((err) => done(err));
  });

  test("Deve retornar status (400), pela digitação incorreta por Id na busca por doação-caracteres a menos", (done) => {
    fakeId='6394c4a'
    request(app)
      .get("/doacao/buscar/" + fakeId)
      .set("authorization", token)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toBe(
          `Id incorreto. Caracter a menos: ${24-fakeId.length}.`
        );
      })
      .end((err) => done(err));
  });

  test("Deve retornar status (404), não encontra Id na busca por doação", (done) => {
    fakeId='6394c4a95f3a1dd3cb879ee5'
    request(app)
      .get("/doacao/buscar/" + fakeId)
      .set("authorization", token)
      .expect(404)
      .expect((response) => {
        expect(response.body.Prezades).toBe(
          `A doação não foi encontrada.`
        );
      })
      .end((err) => done(err));
  });

  test("Deve cadastrar(201) nova doação", (done) => {
    const doacaoBody = {
      name_produto: "sabão",
      categoria_produto: "limpeza",
      quantidade_produto: 3,
      pontos_por_produto:1
    };

    request(app)
      .post("/doacao/criar")
      .send(doacaoBody)
      .set("authorization", token)
      .expect(201)
      .expect((response) => {
        expect(response.body.Prezades).toBe("Doação cadastrada com sucesso");
      })
      .end((err) => {
        return done(err);
      });
  });

  test("Deve retornar status (400) ao digitar tipo de dado incorreto e não preenchimento do campo obrigatório", (done) => {
    const doacaoBody = {
      name_produto: 14586635,
      categoria_produto: "",
      quantidade_produto: 3,
      pontos_por_produto:1
    };

    request(app)
      .post("/doacao/criar")
      .send(doacaoBody)
      .set("authorization", token)
      .expect(400)
      .end((err) => {
        return done(err);
      });
  });
});
