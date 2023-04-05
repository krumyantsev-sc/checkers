import IPlayer from "./interfaces/IPlayer";

class Player implements IPlayer {
    color: string;
    id: string;
    score: number = 0;

    constructor(color: string) {
        this.color = color;
    }
}

export default Player;