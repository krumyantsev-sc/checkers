import roleMiddleware from "../middleware/roleMiddleware"
import controller from "../controllers/gameController"

const Router = require("express");
const router = new Router();
const cors = require("cors");

router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

router.get("/getGames", roleMiddleware(["USER", "ADMIN"]), controller.getGames);
router.post("/create-game", roleMiddleware(["ADMIN"]), controller.upload.single('logo'), controller.createGame);
router.post('/update-game', roleMiddleware(["ADMIN"]), controller.upload.single('logo'), controller.editGame);
router.get('/:id/delete', roleMiddleware(["ADMIN"]), controller.deleteGame);
export default router;