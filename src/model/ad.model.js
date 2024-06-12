const { Schema, model, connection } = require("mongoose");

const UserSchema = new Schema({
  idUSer: String,
  state: String,
  category: String,
  images: [Object],
  dateCreated: Date,
  title: String,
  price: Number,
  priceNegotiable: Boolean,
  description: String,
  views: Number,
  status: String,
});

const nameModel = "Ad";

if (connection && connection.models[nameModel]) {
  module.exports = connection.models[nameModel];
} else {
  module.exports = model(nameModel, UserSchema);
}
