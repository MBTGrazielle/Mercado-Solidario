const mongoose = require("mongoose");

const produtosSchema = new mongoose.Schema({
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
  }
});

module.exports = mongoose.model("produtos", produtosSchema);
