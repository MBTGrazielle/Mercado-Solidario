const UserSchema = require("../models/VoluntarioSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

const login = (request, response) => {
  const { email } = request.body;

  //verifica se o email é válido
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return response.status(400).send({
      Alerta: "Email inválido!",
    });
  }

  try {
    
    UserSchema.findOne({ email: request.body.email }, (error, user) => {
      if (!user) {
        return response.status(404).send({
          Prezades: "Usuário não encontrado",
        });
      }

      const validPassword = bcrypt.compareSync(
        request.body.password,
        user.password
      );

      if (!validPassword) {
        return response.status(401).send({
          Alerta: "Senha inválida.",
        });
      }
      
      // jwt.sign(nome do usuário, SEGREDO)
      const token = jwt.sign({ name: user.name }, SECRET);

      response.status(200).send({
        Prezades: "Login efetuado com sucesso!",
        token,
      });

    });
  } catch (err) {
    response.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  login,
};
