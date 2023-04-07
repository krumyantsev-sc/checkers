import {Request, Response} from "express";
const Router = require("express");
const router = new Router();
const cors = require("cors");
import CheckersController from "../controllers/checkersController"
import roleMiddleware from "../middleware/roleMiddleware";
const _ = require("lodash");
router.use(cors({
    origin: '*'
}));

let activeGames: CheckersController[] = [];

const findControllerByRoomId = (activeGames: CheckersController[], roomId: string): CheckersController => {
    return activeGames[_.findIndex(activeGames, function(o) { return o.roomId === roomId; })];
}

router.post("/:roomId/getPossiblePositions", function(request: Request, response: Response){
    response.send(findControllerByRoomId(activeGames,request.params.roomId).getPositionsForHighlighting(request));
});

router.post("/:roomId/updateBoard", function(req: Request, res: Response) {
    let beatPositions = findControllerByRoomId(activeGames,req.params.roomId).moveCheckerOnBoard(req);
    res.send(beatPositions);
});

router.get("/:roomId/getBoard", function(req: Request, res: Response) {
    res.send(findControllerByRoomId(activeGames,req.params.roomId).getBoard());
});

router.post("/:roomId/getBeatPositions", function(req: Request, res: Response) {
    res.send(findControllerByRoomId(activeGames,req.params.roomId).getBeatPos(req.body));
});

router.get("/:roomId/initialize", async function(req: Request, res: Response) {
    let checkersController = new CheckersController();
    await checkersController.initializeGame(req.params.roomId);
    activeGames.push(checkersController);
    res.status(200).json({message:"Successfully"});
});

router.get("/:roomId/getMoveStatusInfo", function (req: Request, res: Response) {
    let status = findControllerByRoomId(activeGames,req.params.roomId).getMoveStatusInfo(req);
    res.json(status)
})
export default router;
