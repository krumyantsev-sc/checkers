import {checkerCoords} from "../../types/checkersTypes";
import BoardService from "../../services/BoardService";

export default interface IChecker {
    color: string;
    position: checkerCoords;
    id: number;
    isLady: boolean;

    move(gameBoard: BoardService, to: checkerCoords): void;
    canMakeLady(): boolean;
}