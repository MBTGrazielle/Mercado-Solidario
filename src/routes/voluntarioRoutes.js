const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/voluntarioController");

const { checkAuth } = require("../middlewares/auth");

router.get("/all", checkAuth, userController.buscarAllVoluntario);
router.get("/:id", checkAuth, userController.buscarVoluntarioById);
router.post("/create", userController.criarVoluntario);
router.post("/login", authController.login);
router.patch("/update/:id", checkAuth, userController.atualizarVoluntarioById);
router.delete("/delete/:id", checkAuth, userController.deletarVoluntarioById);

module.exports = router;
