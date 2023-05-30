import {Request, Response} from "express";

const Router = require("express");
const router = new Router();
const cors = require("cors");

import CheckersController from "../controllers/checkersController"
import roleMiddleware from "../middleware/roleMiddleware";

const _ = require("lodash");

router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

let activeGames: CheckersController[] = [];

export const removeController = (controllerId: string): void => {
    const index = _.findIndex(activeGames, function (o) {
        return o.roomId === controllerId;
    });
    if (index !== -1) {
        activeGames.splice(index, 1);
    }
}

const findControllerByRoomId = (activeGames: CheckersController[], roomId: string): CheckersController => {
    return activeGames[_.findIndex(activeGames, function (o) {
        return o.roomId === roomId;
    })];
}

router.post("/:roomId/getPossiblePositions", roleMiddleware(["USER", "ADMIN"]), function (request: Request, response: Response) {
    response.send(findControllerByRoomId(activeGames, request.params.roomId).getPositionsForHighlighting(request));
});

router.post("/:roomId/updateBoard", roleMiddleware(["USER", "ADMIN"]), function (req: Request, res: Response) {
    let beatPositions = findControllerByRoomId(activeGames, req.params.roomId).moveCheckerOnBoard(req);
    res.send(beatPositions);
});

router.get("/:roomId/getGameInfo", roleMiddleware(["USER", "ADMIN"]), function (req: Request, res: Response) {
    findControllerByRoomId(activeGames, req.params.roomId).getGameInfo(req, res);
})
router.get("/:roomId/getBoard", roleMiddleware(["USER","ADMIN"]), function (req: Request, res: Response) {
    res.send(findControllerByRoomId(activeGames, req.params.roomId).getBoard());
});

router.post("/:roomId/getBeatPositions", roleMiddleware(["USER", "ADMIN"]), function (req: Request, res: Response) {
    res.send(findControllerByRoomId(activeGames, req.params.roomId).getBeatPos(req.body));
});

router.get("/:roomId/initialize", roleMiddleware(["USER", "ADMIN"]), async function (req: Request, res: Response) {
    if (!findControllerByRoomId(activeGames, req.params.roomId)) {
        let checkersController = new CheckersController();
        await checkersController.initializeGame(req.params.roomId, req, res);
        if (req.query.withBot) {
            checkersController.withBot = true;
        }
        activeGames.push(checkersController);
    }
    res.status(200).json({message: "Successfully initialized"});
});

router.get("/:roomId/getMoveStatusInfo", roleMiddleware(["USER", "ADMIN"]), function (req: Request, res: Response) {
    let status = findControllerByRoomId(activeGames, req.params.roomId).getMoveStatusInfo(req);
    res.json(status)
})

router.get("/:roomId/finishGameOnTimedOut", roleMiddleware(["USER", "ADMIN"]), function (req: Request, res: Response) {
    findControllerByRoomId(activeGames, req.params.roomId).finishGameOnDisconnect(req);
    res.status(200).json({message: "Game finished"});
})


export default router;
