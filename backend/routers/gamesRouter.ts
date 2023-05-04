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
router.post("/create-game", controller.upload.single('logo'), controller.createGame);
router.post('/update-game', controller.upload.single('logo'), controller.editGame);
router.get('/:id/delete', controller.deleteGame);
export default router;