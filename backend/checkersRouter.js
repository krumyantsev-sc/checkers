const Router = require("express");
const controller = require("./controllers/authController.js")
const router = new Router();
const cors = require("cors");
const roleMiddleware = require("./middleware/roleMiddleware");
const CheckersController = require("./controllers/checkersController.js");
const board = require("./services/BoardService.js");
const _ = require("lodash");
router.use(cors({
    origin: ['http://localhost:63342']
}));

let activeGames = [];

function findControllerByRoomId(activeGames, roomId) {
    return activeGames[_.findIndex(activeGames, function(o) { return o.roomId === roomId; })];
}

router.post("/:roomId/getPossiblePositions", function(request, response){
    // отправляем ответ
    response.send(findControllerByRoomId(activeGames,request.params.roomId).getPositionsForHighlighting(+request.body.i,+request.body.j));
});

router.post("/:roomId/updateBoard", function(req,res) {
    let beatPositions = findControllerByRoomId(activeGames,req.params.roomId).moveCheckerOnBoard(req, req.body.fromI,req.body.fromJ,req.body.toI,req.body.toJ);
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

module.exports = router