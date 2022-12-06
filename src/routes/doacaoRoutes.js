const express = require("express");
const router = express.Router();

const doacaoController = require("../controllers/doacaoController");

const { checkAuth } = require("../middlewares/auth");

router.get("/all", checkAuth, doacaoController.buscarAllDoacao);
router.get("/buscar/:id", checkAuth, doacaoController.buscarDoacaoById);
router.post("/criar", doacaoController.cadastrarDoacao);


module.exports = router;