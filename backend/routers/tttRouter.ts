import {Request, Response} from "express";
import tttController from "../controllers/tttController"
import roleMiddleware from "../middleware/roleMiddleware";

const Router = require("express");
const router = new Router();
const cors = require("cors");
const _ = require("lodash");

router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

let activeGames: tttController[] = [];

export const removeController = (controllerId: string) => {
    const index = _.findIndex(activeGames, function (o) {
        return o.roomId === controllerId;
    });
    if (index !== -1) {
        activeGames.splice(index, 1);
    }
}

const findControllerByRoomId = (activeGames: tttController[], roomId: string): tttController => {
    return activeGames[_.findIndex(activeGames, function (o) {
        return o.roomId === roomId;
    })];
}

router.get("/:roomId/getBoard", roleMiddleware(["USER", "ADMIN"]), function (req: Request, res: Response) {
    res.send(findControllerByRoomId(activeGames, req.params.roomId).getBoard(req));
});

router.get("/:roomId/getGameInfo", roleMiddleware(["USER", "ADMIN"]), async function (req: Request, res: Response) {
    await findControllerByRoomId(activeGames, req.params.roomId).getGameInfo(req, res);
})

router.get("/:roomId/initialize", roleMiddleware(["USER", "ADMIN"]), async function (req: Request, res: Response) {
    if (!findControllerByRoomId(activeGames, req.params.roomId)) {
        let controller = new tttController();
        await controller.initializeGame(req.params.roomId, req, res);
        activeGames.push(controller);
    }
    res.status(200).json({message: "Successfully initialized"});
});

router.post("/:roomId/makeMove", roleMiddleware(["USER", "ADMIN"]), async function (req: Request, res: Response) {
    await findControllerByRoomId(activeGames, req.params.roomId).makeMove(req);
    res.status(200).json({message: "Successfully moved"});
});

router.get("/:roomId/finishGameOnTimedOut", roleMiddleware(["USER", "ADMIN"]), function (req: Request, res: Response) {
    findControllerByRoomId(activeGames, req.params.roomId).finishGameOnDisconnect(req);
    res.status(200).json({message: "Game finished"});
})


export default router;
