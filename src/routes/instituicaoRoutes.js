const rotas = require("express").Router();
const controller = require("../controllers/instituicaoController");

const { checkAuth } = require("../middlewares/auth");

rotas.get("/:id", checkAuth, controller.buscarInstituicaoById);
rotas.get("/", checkAuth, controller.buscarAllInstituicao);
rotas.post("/", checkAuth, controller.criarCadastroInstituicao);
rotas.delete("/:id", checkAuth, controller.deletarCadastroInstituicao);
rotas.patch("/:id", checkAuth, controller.atualizarCadastroInstituicao);

module.exports = rotas;
