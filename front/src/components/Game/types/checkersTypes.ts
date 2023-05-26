export type checkerCoords = {i: number, j: number};
export type checkerCoordsWithColor = {i: number, j: number, color: string};
export type score = {firstPlayerScore: number, secondPlayerScore: number, color: string};
export type moveCoords = {fromI: number, fromJ: number, toI: number, toJ: number};
export type checker = {
    isLady: boolean,
    color: string,
    position: checkerCoords,
    id: number
}