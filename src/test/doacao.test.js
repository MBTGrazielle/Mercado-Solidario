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

  test("Deve cadastrar(201) nova doação", (done) => {
    const doacaoBody = {
      name_produto: "sabão",
      categoria_produto: "limpeza",
      quantidade_produto: 3,
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
});
