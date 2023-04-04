import checker from "../../entity/checker";
import {checkerCoords} from "../../types/checkersTypes";

export default interface IBoardService {
    board: (checker | null)[][];
    getBoard(): (checker | null)[][];
    init(): void;
    checkBorders(position: checkerCoords): boolean;
    isFreeCell(position: checkerCoords): boolean;
    isCellTaken(position: checkerCoords): boolean;
}