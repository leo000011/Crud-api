const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../model/user.model");
const States = require("../model/states.model");
const ad = require("../model/ad.model");
const Category = require("../model/category.model");
const { validationResult, matchedData } = require("express-validator");

module.exports = {
  getdata: async (req, res) => {
    const user = await User.find();
    res.json({ user });
  },

  getStates: async (req, res) => {
    try {
      let states = await States.find();
      res.status(200).json({ states });
    } catch (err) {
      res.status(500).json({ err });
    }
  },

  info: async (req, res) => {
    let token = req.query.token;

    const user = await User.findOne({ token });
    const state = await States.findById(user.states);
    const ads = await ad.find({ idUser: user._id.toString() });

    let adList = await [];
    for (let i in ads) {
      const cat = await Category.findById(ads[i].category);
      adList.push({ ...ads[i], category: cat.slug });
    }

    res.json({
      name: user.name,
      email: user.email,
      states: state.name,
      ads: adList,
    });
  },

  editAction: async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ error: errors.mapped() });
      return;
    }
    let data = matchedData(req);

    let updates = {};

    if (data.name) {
      updates.name = data.name;
    }

    if (data.email) {
      const emailCheck = await User.findOne({ email: data.email });
      if (emailCheck) {
        res.json({ error: "Email já existente!" });
        return;
      }
      updates.email = data.email;
    }

    if (data.state) {
      if (mongoose.Types.ObjectId.isValid(data.state)) {
        const stateCheck = await User.findById({ data: data.state });
        if (!stateCheck) {
          res.json({ error: "O código esta inválido" });
        }
        updates.states = data.state;
      }
    }

    if (data.password) {
      updates.passwordHash = await bcrypt.hash(data.password, 10);
    }

    await User.findOneAndUpdate({ token: data.token }, { $set: updates });
  },
};
