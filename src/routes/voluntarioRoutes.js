const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/voluntarioController");

const { checkAuth } = require("../middlewares/auth");

router.get("/all", checkAuth, userController.buscarAllVoluntario);
router.get("/buscarId/:id", checkAuth, userController.buscarVoluntarioById);
router.get("/buscarCpf/:cpf", checkAuth, userController.buscarVoluntarioByCPF);
router.get("/filtroDisponibilidade",userController.filtrarVoluntarioDisponibilidade)
router.post("/criar", userController.cadastrarVoluntario);
router.post("/login", authController.login);
router.patch("/atualizar/:id", checkAuth, userController.atualizarVoluntarioById);
router.delete("/deletar/", checkAuth, userController.deletarVoluntario);

module.exports = router;
