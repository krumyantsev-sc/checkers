import Player from "../entity/player";
import {Request, Response} from "express";
import Room, {IRoom} from "../models/Room";


class tttController {
    private player1: Player = new Player("X");
    private player2: Player = new Player("0");
    private roomId!: string;
    private currentPlayer: Player;
    private board: string[][];

    constructor() {
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.currentPlayer = this.player1;
    }

    public getBoard = async () => {
        return {board: this.board};
    }

    public initializeGame = async (roomId: string, req: Request, res: Response,): Promise<any> => {
        this.roomId = roomId;
        try {
            const room: IRoom = await Room.findById(this.roomId)
                .populate('firstPlayer' )
                .populate('secondPlayer')
                .exec()
            room.startedAt = new Date();
            this.player1.id = room?.firstPlayer!._id.toString();
            this.player1.name = room.firstPlayer.username;
            this.player2.id = room?.secondPlayer._id.toString();
            this.player2.name = room.secondPlayer.username;
            await room.save();
        } catch {
            return res.status(404).json({message: "Game not found"});
        }
    }
}
export default tttController;