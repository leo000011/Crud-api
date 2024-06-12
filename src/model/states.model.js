const { Schema, model, connection } = require("mongoose");

const UserSchema = new Schema({
  name: String,
});

const nameModel = "States";

if (connection && connection.models[nameModel]) {
  module.exports = connection.models[nameModel];
} else {
  module.exports = model(nameModel, UserSchema);
}
