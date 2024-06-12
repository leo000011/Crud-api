const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectToDatabase = () => {
  mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.h7iavlz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );
};

module.exports = connectToDatabase;
