require("dotenv-safe").config();
const express = require("express");
const cors = require("cors");
const db = require("./database/mongoConfig");
const voluntarioRoutes = require("./routes/voluntarioRoutes");
const familiaRoutes = require("./routes/familiaRoutes");

const app = express();

app.use(express.json());
app.use(cors());
db.connect();

app.use("/voluntario", voluntarioRoutes);
app.use("/familia", familiaRoutes);

module.exports = app;
