import {Request, Response} from "express";
const Router = require("express");
const router = new Router();
const cors = require("cors");
const EventEmitter = require('events');
const checkersEmitter = new EventEmitter();

import tttController from "../controllers/tttController"
import roleMiddleware from "../middleware/roleMiddleware";
const _ = require("lodash");
router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

let activeGames: tttController[] = [];

export const removeController = (controllerId: string) => {
    const index = _.findIndex(activeGames, function(o) { return o.roomId === controllerId; });
    if (index !== -1) {
        activeGames.splice(index, 1);
    }
}

checkersEmitter.on('gameEnded', removeController);
const findControllerByRoomId = (activeGames: tttController[], roomId: string): tttController => {
    return activeGames[_.findIndex(activeGames, function(o) { return o.roomId === roomId; })];
}

router.get("/:roomId/getBoard", function(req: Request, res: Response) {
    res.send(findControllerByRoomId(activeGames,req.params.roomId).getBoard(req));
});

router.get("/:roomId/initialize", async function(req: Request, res: Response) {
    if (!findControllerByRoomId(activeGames,req.params.roomId)) {
        let controller = new tttController();
        await controller.initializeGame(req.params.roomId, req, res);
        activeGames.push(controller);
    }
    res.status(200).json({message:"Successfully initialized"});
});

router.post("/:roomId/makeMove", async function(req: Request, res: Response) {
    findControllerByRoomId(activeGames,req.params.roomId).makeMove(req,res);
    res.status(200).json({message:"Successfully moved"});
});

export default router;
