const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fileupload = require("express-fileupload");
const router = require("./src/router/router");
const connectToDatabase = require("./src/database/mongoose.database");
const path = require("path");
dotenv.config();

connectToDatabase();

const server = express();
server.use(cors());
server.use(express.static(path.join(__dirname, "./public")));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(fileupload());

//Rota

server.use("/", router);

server.listen(process.env.PORT, () => {
  console.log(`Listenig in ${process.env.BASE}`);
});
