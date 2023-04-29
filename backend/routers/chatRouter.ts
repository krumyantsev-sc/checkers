const Router = require("express");
import controller from "../controllers/chatController"
const router = new Router();
import roleMiddleware from "../middleware/roleMiddleware"
const cors = require("cors");

router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

router.get("/:roomId/getMessages",roleMiddleware(["USER", "ADMIN"]), controller.getMessages);
router.post("/:roomId/sendMessage",roleMiddleware(["USER", "ADMIN"]), controller.sendMessage);


export default router;