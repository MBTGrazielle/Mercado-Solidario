const app = require("../app");
const request = require("supertest");
const model = require("../models/DoacaoSchema");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

describe("Mercado Controller", () => {
  const token = "bearer " + jwt.sign({ name: "grazielle" }, SECRET);

  test("Deve retornar o produto e quantidade, status (200), na busca pelo nome", (done) => {
    const mercadoBody={
        name_produto:"presunto"
    }
    request(app)
      .get("/mercado/filtroByNome/")
      .send(mercadoBody)
      .set("authorization", token)
      .expect(200)
      .expect((response) => {
        expect(response.body.filtro_Produto).toContain(
          `${mercadoBody.name_produto}:`
        );
      })
      .end((err) => done(err));
  });

  test("Deve retornar a categoria e quantidade, status (200), na busca pela categoria", (done) => {
    const mercadoBody={
        categoria_produto:"frios"
    }
    request(app)
      .get("/mercado/filtroByCategoria/")
      .send(mercadoBody)
      .set("authorization", token)
      .expect(200)
      .expect((response) => {
        expect(response.body.filtro_Categoria).toContain(
          `${mercadoBody.categoria_produto}:`
        );
      })
      .end((err) => done(err));
  });


});
