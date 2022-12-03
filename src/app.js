require("dotenv-safe").config();
const express = require("express");
const cors = require("cors");
const db = require("./database/mongoConfig");
const instituicaoRoutes = require("./routes/instituicaoRoutes");
const voluntarioRoutes = require("./routes/voluntarioRoutes");

const app = express();

app.use(express.json());
app.use(cors());
db.connect();

app.use("/instituicao", instituicaoRoutes);
app.use("/users", voluntarioRoutes);

module.exports = app;
