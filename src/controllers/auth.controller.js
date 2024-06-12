// Biblioteca
const mongoose = require("mongoose");
const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcrypt");

// banco de dado
const User = require("../model/user.model");
const State = require("../model/states.model");

module.exports = {
  signin: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.mapped() });
      return;
    }
    const data = matchedData(req);

    let user = await User.findOne({ email: data.email });

    if (!user) {
      res.json({ error: "Email e/ou senha errados!" });
      return;
    }

    const match = await bcrypt.compare(data.password, user.passwordHash);
    if (!match) {
      res.json({ error: "Email e/ou senha errados!" });
      return;
    }

    const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload, 10);

    user.token = token;
    await user.save();

    res.json({ token, email: data.email });
  },

  signup: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.mapped() });
      return;
    }

    const data = matchedData(req);

    const user = await User.findOne({
      email: data.email,
    });

    if (user) {
      res.json({ error: { email: { msg: "Email já existe" } } });
      return;
    }

    if (mongoose.Types.ObjectId.isValid(data.state)) {
      const stateItem = await State.findById(data.state);
      if (!stateItem) {
        res.json({ error: { state: { msg: "Estado não existe" } } });
        return;
      }
    } else {
      res.json({ error: { state: { msg: "Código de estado inválido" } } });
      return;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload, 10);

    const newUSer = new User({
      name: data.name,
      email: data.email,
      passwordHash,
      token,
      states: data.state,
    });
    await newUSer.save();
    res.json({ tudocerto: true, data });
  },
};
