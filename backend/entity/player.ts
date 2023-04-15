import IPlayer from "./interfaces/IPlayer";

class Player implements IPlayer {
    color: string;
    id: string;
    name: string;
    score: number = 0;

    constructor(color: string) {
        this.color = color;
    }
}

export default Player;