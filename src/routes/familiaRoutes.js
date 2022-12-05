const express = require("express");
const router = express.Router();

const familiaController = require("../controllers/familiaController");

const { checkAuth } = require("../middlewares/auth");

router.get("/all", checkAuth, familiaController.buscarAllFamilia);
router.get("/buscarResponsavel/:name_do_responsavel_familiar", checkAuth, familiaController.buscarFamiliaByNameResponsavelFamiliar);
router.get("/buscarCartao/:numero_cartao_alimentacao", checkAuth, familiaController.buscarFamiliaByCartao);
router.get("/perfil/", checkAuth, familiaController.perfilSocioEconomico);
router.post("/criar", familiaController.cadastrarFamilia);
router.patch("/atualizar/:numero_cartao_alimentacao", checkAuth, familiaController.atualizarFamiliaByCartao);
router.delete("/deletar/:numero_cartao_alimentacao", checkAuth, familiaController.deletarVoluntarioByCartao);

module.exports = router;
