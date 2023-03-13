const Router = require("express");
const router = new Router();
const controller = require("./controllers/lobbyController.js")
const cors = require("cors");
const io = require("./index.js")
const jwtVerificationMiddleware = require("./middleware/jwtVerificationMiddleware")
router.use(cors({
    origin: ['http://localhost:63342']
}));

router.post("/verifyToken", jwtVerificationMiddleware(), controller.connect);

module.exports = router