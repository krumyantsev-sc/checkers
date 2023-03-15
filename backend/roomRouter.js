const Router = require("express");
const router = new Router();
const controller = require("./controllers/roomController.js")
const cors = require("cors");
const {io} = require("./index.js")
const jwtVerificationMiddleware = require("./jwtVerification")
const roleMiddleware = require("./middleware/roleMiddleware");
router.use(cors({
    origin: ['http://localhost:63342']
}));

router.post("/connectToRoom", roleMiddleware(["ADMIN", "USER"]), controller.connect);
router.get("/createRoom", roleMiddleware(["ADMIN", "USER"]), controller.createRoom);
router.get("/getRoomList", roleMiddleware(["ADMIN", "USER"]), controller.getRoomList);

module.exports = router