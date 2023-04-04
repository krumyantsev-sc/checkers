import {checkerCoords} from "../../types/checkersTypes";
import BoardService from "../BoardService";
import checker from "../../entity/checker";


export interface IMoveVariants {
    (boardService: BoardService, position: checkerCoords): checkerCoords[];
}

export interface IMoveChecker {
    (boardService: BoardService, checker: checker | null, to: checkerCoords): void;
}