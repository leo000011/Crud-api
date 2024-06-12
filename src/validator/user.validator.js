const { checkSchema } = require("express-validator");

module.exports = {
  editAction: checkSchema({
    token: {
      notEmpty: true,
    },
    name: {
      optional: true,
      trim: true,
      isLength: {
        options: { min: 5 },
      },
      errorMessage: "Nome precisa ter pelo menos 2 caracteres",
    },
    email: {
      optional: true,
      isEmail: true,
      normalizeEmail: true,
      errorMessage: "Email inválido",
    },
    password: {
      optional: true,
      isLength: {
        options: { min: 5 },
      },
      errorMessage: "Senha precisa ter pelo menos 5 caracteres",
    },
    state: {
      optional: true,
      notEmpty: true,
      errorMessage: "Estado não preenchido",
    },
  }),
};
