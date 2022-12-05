const mongoose = require("mongoose");

const familiaSchema = new mongoose.Schema({
    numero_cartao_alimentacao: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  numero_nis: {
    type: String,
    required: true,
  },
  numero_integrantes_familia: {
    type: Number,
    required: true,
  },
  name_integrantes_familia: {
    type: Array,
    required: true,
  },
  name_do_responsavel_familiar: {
    type: String,
    required: true,
  },
  cpf_do_responsavel_familiar: {
    type: String,
    required: true,
    unique: true,
  },
  renda_familiar:{
    type: Number,
    required: true,
  },
  endereco: {
    cep: {
        type: String,
        required: true
    },
    rua: {
        type: String,
        required: true
    },
    numero: {
        type: String,
        required: true
    },
    complemento: {
        type: String,
        required: false
    },
    referencia: {
        type: String,
        required: false
    },
    estado: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    bairro: {
        type: String,
        required: true
    }},
  telefone: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("familia", familiaSchema);