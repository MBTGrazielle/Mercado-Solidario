const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const db = require("./database/mongoConfig");
const instituicaoRoutes = require("./routes/instituicaoRoutes");
const voluntarioRoutes = require("./routes/voluntarioRoutes");

db.connect();

app.use(cors());
app.use(express.json());
app.use("/instituicao", instituicaoRoutes);
app.use("/users", voluntarioRoutes);

module.exports = app;
