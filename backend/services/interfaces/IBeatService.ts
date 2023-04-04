import BoardService from "../BoardService";
import {checkerCoords} from "../../types/checkersTypes";
import {checkerCoordsWithColor} from "../../types/checkersTypes";

export interface IGetBeatPositions {
    (gameBoard: BoardService, position: checkerCoords): checkerCoords[];
}

export interface IBeat {
    (gameBoard: BoardService, from: checkerCoords, to: checkerCoords): [
        checkerCoords[],
        (checkerCoordsWithColor | undefined)
    ];
}

export interface IRemoveChecker {
    (gameBoard: BoardService, from: checkerCoords, to: checkerCoords): checkerCoordsWithColor;
}