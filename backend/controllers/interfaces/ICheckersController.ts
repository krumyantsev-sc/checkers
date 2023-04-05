import Player from "../../entity/player";
import boardService from "../../services/BoardService"
import {Request} from "express";
import {checkerCoords, checkerCoordsWithColor, score} from "../../types/checkersTypes";
import checker from "../../entity/checker";

export default interface ICheckersController {
    counter: number;
    roomId: string;
    readonly boardService: boardService;
    player1: Player;
    player2: Player;

    initializeGame(roomId: string): Promise<void>;
    switchTeam(req: Request): void;
    getMoveStatusInfo(req: Request): score;
    getPositionsForHighlighting(req: Request): checkerCoords[];
    checkWin(req: Request): void;
    updateScore(removedChecker: checkerCoordsWithColor, req: Request): void;
    moveCheckerOnBoard(req: Request): checkerCoords[];
    getBeatPos(position: checkerCoords): Array<checkerCoords>;
    getBoard(): (checker | null)[][];
}