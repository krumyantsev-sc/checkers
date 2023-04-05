import checkersController from "./controllers/checkersController";

const Router = require("express");
const router = new Router();
const cors = require("cors");
import roleMiddleware from "./middleware/roleMiddleware"
import CheckersController from "./controllers/checkersController"
import board from "./services/BoardService.js";
const _ = require("lodash");
router.use(cors({
    origin: ['http://localhost:63342']
}));

let activeGames: CheckersController[] = [];

function findControllerByRoomId(activeGames: CheckersController[], roomId: string) {
    return activeGames[_.findIndex(activeGames, function(o) { return o.roomId === roomId; })];
}

router.post("/:roomId/getPossiblePositions", function(request: any, response: any){
    // отправляем ответ
    response.send(findControllerByRoomId(activeGames,request.params.roomId).getPositionsForHighlighting(request));
});

router.post("/:roomId/updateBoard", function(req: any,res: any) {
    let beatPositions = findControllerByRoomId(activeGames,req.params.roomId).moveCheckerOnBoard(req);
    console.log(beatPositions);
    // io.to(secondPlayer).emit('checkerMoved', req.body);
    res.send(beatPositions);
});

router.get("/:roomId/getBoard", function(req,res) {
    res.send(findControllerByRoomId(activeGames,req.params.roomId).getBoard());
});

router.post("/:roomId/getBeatPositions", function(req,res) {
    res.send(findControllerByRoomId(activeGames,req.params.roomId).getBeatPos(req.body));
});

router.get("/:roomId/initialize", async function(req,res) {
    let checkersController = new CheckersController();
    await checkersController.initializeGame(req.params.roomId);
    activeGames.push(checkersController);
    res.status(200).json({message:"Successfully"});
});

router.get("/:roomId/getMoveStatusInfo", function (req,res) {
    let status = findControllerByRoomId(activeGames,req.params.roomId).getMoveStatusInfo(req);
    console.log(status)
    res.json(status)
})
export default router;
