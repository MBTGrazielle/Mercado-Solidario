const mongoose = require("mongoose");

const instituicaoSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Types.ObjectId,
      default: mongoose.Types.ObjectId,
    },
    nome: {
      type: String,
      required: true,
    },
    cnpj: {
      type: Number,
      required: true,
    },
    iniciativa_privada: {
      type: Boolean,
      required: false,
    },
    endereco: {
      cep: {
        type: String,
        required: true,
      },
      rua: {
        type: String,
        required: true,
      },
      numero: {
        type: Number,
        required: true,
      },
      complemento: {
        type: String,
        required: false,
      },
      referencia: {
        type: String,
        required: false,
      },
      estado: {
        type: String,
        required: true,
      },
      cidade: {
        type: String,
        required: true,
      },
      bairro: {
        type: String,
        required: true,
      },
    },
    site: {
      type: String,
      required: false,
    },
    horario_funcionamento: {
      type: String,
      required: true,
    },
    pessoa_responsavel: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("instituicao", instituicaoSchema);
