require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./database/mongoConfig");
const voluntarioRoutes = require("./routes/voluntarioRoutes");
const familiaRoutes = require("./routes/familiaRoutes");
const doacaoRoutes = require("./routes/doacaoRoutes");
const mercadoRoutes = require("./routes/mercadoRoutes");
const indexRouter = require('./routes/indexRoutes')

const app = express();

app.use(express.json());
app.use(cors());
db.connect();

app.use("/voluntario", voluntarioRoutes);
app.use("/familia", familiaRoutes);
app.use("/doacao", doacaoRoutes);
app.use("/mercado", mercadoRoutes);
app.use(indexRouter)

module.exports = app;
