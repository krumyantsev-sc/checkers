import User, {IUser} from "../models/User"
import Room, {IRoom} from "../models/Room"
import emitToPlayers from "../util/util";
import {Request, Response} from 'express';
import {HydratedDocument} from "mongoose";
import Game, {IGame} from "../models/Game";

const jwt = require("jsonwebtoken");
const secret = require("../config/config");


class roomController{
    public connect = async (req: Request, res: Response): Promise<any> => {
        try {
            const token: string = req.cookies.jwt;
            const {id: userId} = jwt.verify(token, secret);
            const candidate: IUser = await User.findById(userId);
            const roomId: string = req.body.roomId;
            const room: IRoom = await Room.findById(roomId);
            if (!room.firstPlayer && room.secondPlayer !== candidate) {
                room.firstPlayer = candidate;
                await room.save();
            }
            else if (!room.secondPlayer && room.firstPlayer !== candidate) {
                room.secondPlayer = candidate;
                await room.save();
            }
            res.sendStatus(200).json({status: "connected"});
        }
        catch (error) {
            console.log(error);
        }
    }

    public createRoom = async (req: Request, res: Response): Promise<any> => {
        try {
            const gameName: string = req.params.gameName;
            console.log(gameName);
            const game: IGame = await Game.findOne({name: gameName});
            const room: HydratedDocument<IRoom> = new Room({game: game});
            await room.save();
            res.sendStatus(200).json({status: "room created"});
        }
        catch (error) {
            console.log(error);
        }
    }

    public getRoomList = async (req: Request, res: Response): Promise<any> => {
        try {
            const rooms: IRoom[] = await Room.find()
                .populate('firstPlayer' )
                .populate('secondPlayer')
                .exec();
            const transformedRooms = rooms.map(room => {
                return {
                    _id: room._id,
                    firstPlayer: room.firstPlayer ? room.firstPlayer.username : "no player",
                    secondPlayer: room.secondPlayer ? room.secondPlayer.username : "no player"
                };
            });
            res.json(transformedRooms);
        }
        catch (error) {
            console.log(error);
        }
    }

    // public getRoomId = async (req: Request, res: Response): Promise<any> => {
    //     try {
    //         const token: string = req.cookies.jwt;
    //         const {id: userId} = jwt.verify(token, secret);
    //         let currentRoom: IRoom = await Room.findOne({$or:[{'firstPlayerId': userId}, {'secondPlayerId': userId}]});
    //         res.send({roomId:currentRoom._id});
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    // }

    public getLobbyInfo = async (req: Request, res: Response): Promise<any> => {
        try {
            let firstPlayerId;
            let secondPlayerId;
            const token: string = req.cookies.jwt;
            console.log(req.body.id)
            const {id: userId} = jwt.verify(token, secret);
            console.log(req.body)
            let currentRoom: IRoom = await Room.findOne({_id: req.body.id})
                .populate('firstPlayer' )
                .populate('secondPlayer')
                .exec()
            if (currentRoom.firstPlayer) {
                firstPlayerId = currentRoom.firstPlayer._id.toString();
            }
            if (currentRoom.secondPlayer) {
                secondPlayerId = currentRoom.secondPlayer._id.toString();
            }
            //{$or:[{'firstPlayer._id': new mongoose.Types.ObjectId(userId)}, {'secondPlayer._id':  new mongoose.Types.ObjectId(userId)}]});
            const transformedRoom = {
                    roomId: currentRoom._id,
                    firstPlayer: currentRoom.firstPlayer ? currentRoom.firstPlayer.username : "no player",
                    secondPlayer: currentRoom.secondPlayer ? currentRoom.secondPlayer.username : "no player"
            };
            res.send(transformedRoom);
            if (currentRoom.firstPlayer && currentRoom.secondPlayer) {
                emitToPlayers(req,[firstPlayerId],'updateLobbyData', transformedRoom);
                emitToPlayers(req,[firstPlayerId, secondPlayerId],'makeBtnActive',{});
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}

export default new roomController();