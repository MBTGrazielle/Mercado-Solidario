const path = require("path");
const dotenv = require("dotenv");

const loadEnv = () => {
  const env = dotenv.config({
    path: path.resolve(process.env.PWD, ".env"),
  });

  if (env.error) throw error;
  process.env = Object.assign(process.env, env.parsed);
};

loadEnv();
