const express = require("express");
const router = express.Router();

const mercadoController = require("../controllers/mercadoController");

const { checkAuth } = require("../middlewares/auth");

router.get("/all", checkAuth, mercadoController.buscarAllProdutos);
router.get("/filtroByNome", checkAuth, mercadoController.filtroMercadoNomeProduto);
router.get("/filtroByCategoria", checkAuth, mercadoController.filtroMercadoCategoria);

module.exports = router;