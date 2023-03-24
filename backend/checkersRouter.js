const Router = require("express");
const controller = require("./controllers/authController.js")
const router = new Router();
const cors = require("cors");
const roleMiddleware = require("./middleware/roleMiddleware");
const checkersController = require("./controllers/checkersController.js");
const board = require("./services/BoardService.js");
router.use(cors({
    origin: ['http://localhost:63342']
}));

router.post("/getPossiblePositions", function(request, response){
    // отправляем ответ
    response.send(checkersController.getPositionsForHighlighting(+request.body.i,+request.body.j));
});

router.post("/updateBoard", function(req,res) {
    checkersController.moveCheckerOnBoard(req.body.fromI,req.body.fromJ,req.body.toI,req.body.toJ);
    // io.to(secondPlayer).emit('checkerMoved', req.body);
    res.sendStatus(200);
});

router.get("/getBoard", function(req,res) {
    res.send(board.getBoard());
});

router.post("/getBeatPositions", function(req,res) {
    res.send(checkersController.getBeatPos(req.body));
});

module.exports = router