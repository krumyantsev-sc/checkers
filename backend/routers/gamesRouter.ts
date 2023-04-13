const Router = require("express");
import controller from "../controllers/gameController"
const router = new Router();
import roleMiddleware from "../middleware/roleMiddleware"
const cors = require("cors");

router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

router.get("/getGames",controller.getGames);
router.post("/createGame", controller.createGame);

export default router;