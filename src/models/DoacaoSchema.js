const mongoose = require("mongoose");

const doacaoSchema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  name_produto: {
    type: String,
    required: true,
  },
  categoria_produto: {
    type: String,
    required: true,
  },
  quantidade_produto: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("doacao", doacaoSchema);
