const { Schema, model, connection } = require("mongoose");

const UserSchema = new Schema({
  name: String,
  email: String,
  states: String,
  passwordHash: String,
  token: String,
});

const nameModel = "User1";

if (connection && connection.models[nameModel]) {
  module.exports = connection.models[nameModel];
} else {
  module.exports = model(nameModel, UserSchema);
}
