const { Schema, model, connection } = require("mongoose");

const UserSchema = new Schema({
  name: String,
  slug: String,
});

const nameModel = "Category";

if (connection && connection.models[nameModel]) {
  module.exports = connection.models[nameModel];
} else {
  module.exports = model(nameModel, UserSchema);
}
