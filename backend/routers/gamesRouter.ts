const Router = require("express");
import controller from "../controllers/gameController"
const router = new Router();
import roleMiddleware from "../middleware/roleMiddleware"
const cors = require("cors");

router.use(cors({
    origin: '*'
}));

router.get("/getGames", roleMiddleware(["ADMIN", "USER"]),controller.getGames);
router.post("/createGame", roleMiddleware(["ADMIN"]), controller.createGame);

export default router;