const { v4: uuid } = require("uuid");
const jimp = require("jimp");

const Category = require("../model/category.model");
const User = require("../model/user.model");
const Ad = require("../model/ad.model");

const dotenv = require("dotenv");
dotenv.config();

const addImage = async (buffer) => {
  let newName = `${uuid()}.jpg`;
  let tmpImg = await jimp.read(buffer);
  tmpImg.cover(500, 500).quality(80).write(`./public/media/${newName}`);
  return newName;
};

module.exports = {
  getCategories: async (req, res) => {
    try {
      const cats = await Category.find();

      let categories = [];

      for (let i in cats) {
        categories.push({
          ...cats[i],
          img: `${process.env.BASE}/assets/images/${cats[i].slug}.png`,
        });
      }
      res.status(200).json({ categories });
    } catch (err) {
      res.status(500).json({ err });
    }
  },
  addAction: async (req, res) => {
    let { title, price, desc, cat, priceneg, token } = req.body;
    const user = await User.findOne({ token }).exec();

    if (!title || !cat) {
      res.json({ error: "Titulo e/ou categoria não foram preenchidos" });
      return;
    }

    if (price) {
      price = price.replace(".", "").replace(",", ".").replace("R$", "");
      price = parseFloat(price);
    } else {
      price = 0;
    }

    let newAd = new Ad();

    newAd.status = true;
    newAd.idUser = user._id;
    newAd.state = user.states;
    newAd.dataCreated = new Date();
    newAd.title = title;
    newAd.category = cat;
    newAd.price = price;
    newAd.priceNegotiable = priceneg == "true" ? true : false;
    newAd.description = desc;
    newAd.views = 0;

    if (req.files && req.files.img) {
      if (req.files.img.length == undefined) {
        if (
          ["image/jpeg", "image/jpg", "image/png"].includes(
            req.files.img.mimetype
          )
        ) {
          let url = await addImage(req.files.img.data);
          newAd.images.push({ url, default: false });
        }
      } else {
        for (let i = 0; i < req.files.img.length; i++) {
          if (
            ["image/jpeg", "image/jpg", "image/png"].includes(
              req.files.img[i].mimetype
            )
          ) {
            let url = await addImage(req.files.img[i].data);
            newAd.images.push({ url, default: false });
          }
        }
      }
    }

    if (newAd.images.length > 0) {
      newAd.images[0].default = true;
    }

    const info = await newAd.save();
    res.json({ id: info._id, img: info.images });
  },
  getList: async (req, res) => {
    let { sort = "asc", offset = 0, limit = 8, q, cat, state } = req.query;

    const adsData = await Ad.find({ status: true }).exec();

    let ads = [];

    for (let i in adsData) {
      let image;

      const defaultImg = adsData[i].images.find((e) => e.default);
      if (defaultImg) {
        image = `${process.env.BASE}/media/${defaultImg.url}`;
      } else {
        image = `${process.env.BASE}/media/default.jpg`;
      }

      ads.push({
        id: adsData[i]._id,
        title: adsData[i].title,
        price: adsData[i].price,
        priceNegotiable: adsData[i].priceNegotiable,
        image,
      });
    }

    res.json({ ads });
  },
  getItem: async (req, res) => {},
  editAction: async (req, res) => {},

  registerCategories: async (req, res) => {
    let { slug, name } = req.body;

    let register = new Category({
      name: name,
      slug: slug,
    });

    await register.save();
    res.json({ register });
  },
};
