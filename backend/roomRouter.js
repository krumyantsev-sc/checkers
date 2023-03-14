const Router = require("express");
const router = new Router();
const controller = require("./controllers/roomController.js")
const cors = require("cors");
const io = require("./index.js")
const jwtVerificationMiddleware = require("./middleware/jwtVerificationMiddleware")
const roleMiddleware = require("./middleware/roleMiddleware");
router.use(cors({
    origin: ['http://localhost:63342']
}));

router.post("/connectToRoom", roleMiddleware(["ADMIN", "USER"]), controller.connect);

module.exports = router