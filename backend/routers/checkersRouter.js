"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeController = void 0;
const Router = require("express");
const router = new Router();
const cors = require("cors");
const checkersController_1 = require("../controllers/checkersController");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const _ = require("lodash");
router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
let activeGames = [];
const removeController = (controllerId) => {
    const index = _.findIndex(activeGames, function (o) {
        return o.roomId === controllerId;
    });
    if (index !== -1) {
        activeGames.splice(index, 1);
    }
};
exports.removeController = removeController;
const findControllerByRoomId = (activeGames, roomId) => {
    return activeGames[_.findIndex(activeGames, function (o) {
        return o.roomId === roomId;
    })];
};
router.post("/:roomId/getPossiblePositions", (0, roleMiddleware_1.default)(["USER", "ADMIN"]), function (request, response) {
    response.send(findControllerByRoomId(activeGames, request.params.roomId).getPositionsForHighlighting(request));
});
router.post("/:roomId/updateBoard", (0, roleMiddleware_1.default)(["USER", "ADMIN"]), function (req, res) {
    let beatPositions = findControllerByRoomId(activeGames, req.params.roomId).moveCheckerOnBoard(req);
    res.send(beatPositions);
});
router.get("/:roomId/getGameInfo", (0, roleMiddleware_1.default)(["USER", "ADMIN"]), function (req, res) {
    findControllerByRoomId(activeGames, req.params.roomId).getGameInfo(req, res);
});
router.get("/:roomId/getBoard", (0, roleMiddleware_1.default)(["USER", "ADMIN"]), function (req, res) {
    res.send(findControllerByRoomId(activeGames, req.params.roomId).getBoard());
});
router.post("/:roomId/getBeatPositions", (0, roleMiddleware_1.default)(["USER", "ADMIN"]), function (req, res) {
    res.send(findControllerByRoomId(activeGames, req.params.roomId).getBeatPos(req.body));
});
router.get("/:roomId/initialize", (0, roleMiddleware_1.default)(["USER", "ADMIN"]), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!findControllerByRoomId(activeGames, req.params.roomId)) {
            let checkersController = new checkersController_1.default();
            yield checkersController.initializeGame(req.params.roomId, req, res);
            if (req.query.withBot) {
                checkersController.withBot = true;
            }
            activeGames.push(checkersController);
        }
        res.status(200).json({ message: "Successfully initialized" });
    });
});
router.get("/:roomId/getMoveStatusInfo", (0, roleMiddleware_1.default)(["USER", "ADMIN"]), function (req, res) {
    let status = findControllerByRoomId(activeGames, req.params.roomId).getMoveStatusInfo(req);
    res.json(status);
});
router.get("/:roomId/finishGameOnTimedOut", (0, roleMiddleware_1.default)(["USER", "ADMIN"]), function (req, res) {
    findControllerByRoomId(activeGames, req.params.roomId).finishGameOnDisconnect(req);
    res.status(200).json({ message: "Game finished" });
});
exports.default = router;
//# sourceMappingURL=checkersRouter.js.map