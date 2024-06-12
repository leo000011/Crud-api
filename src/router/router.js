const { Router } = require("express");

const router = Router();

const AuthValidator = require("../validator/auth.validator");

const AuthController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const adsController = require("../controllers/ads.controller");
const auth = require("../middleware/auth.middleware");
const userValidator = require("../validator/user.validator");

// router.get("/", (req, res) => {
//   res.json({ pong: true });
// });

router.get("/", userController.getdata);

router.get("/states", userController.getStates);

router.post("/user/signin", AuthValidator.signin, AuthController.signin);
router.post("/user/signup", AuthValidator.signup, AuthController.signup);

router.get("/user/me", auth.private, userController.info);
router.put(
  "/user/me",
  userValidator.editAction,
  auth.private,
  userController.editAction
);

router.get("/categories", adsController.getCategories);
router.post("/categories", adsController.registerCategories); // Pode apagar futuramente, porque eu fiz essa rota, só para resgitra o animais

router.post("/ad/add", auth.private, adsController.addAction);
router.get("/ad/list", adsController.getList);
router.get("/ad/item", adsController.getItem);
router.post("/ad/:id", auth.private, adsController.editAction);

module.exports = router;
