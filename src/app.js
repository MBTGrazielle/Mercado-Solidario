const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const db = require("./database/mongoConfig");
const instituicaoRoutes = require("./routes/instituicaoRoutes");
const voluntarioRoutes = require("./routes/voluntarioRoutes");
const populacaoRoutes = require("./routes/populacaoRoutes");

db.connect();

app.use(cors());
app.use(express.json());
app.use("/instituicao", instituicaoRoutes);
app.use("/users", voluntarioRoutes);
app.use("/populacao", populacaoRoutes);

module.exports = app;
