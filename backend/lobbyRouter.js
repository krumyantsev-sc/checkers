const Router = require("express");
const router = new Router();
const controller = require("./controllers/authController.js")
const cors = require("cors");
router.use(cors({
    origin: ['http://localhost:63342']
}));

