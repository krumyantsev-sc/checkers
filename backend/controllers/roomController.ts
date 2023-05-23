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
            const activeRoom: IRoom[] = await Room.find({$and: [{$or:[{firstPlayer: candidate._id}, {secondPlayer: candidate._id}]}, {status: "active"}]});
            if (activeRoom.length !== 0) {
                if (activeRoom[0]._id.toString() !== req.body.roomId) {
                    return res.status(403).json({
                        message: "Вы уже являетесь участником активной комнаты.",
                        roomId: activeRoom[0]._id.toString()
                    });
                }
            }
            const roomId: string = req.body.roomId;
            const room: IRoom = await Room.findById(roomId);
            if (room.firstPlayer && room.secondPlayer && (room.firstPlayer.toString() !== candidate._id.toString()) && (room.secondPlayer.toString() !== candidate._id.toString())) {
                return res.status(403).json({
                    message: "Комната переполнена.",
                });
            }
            if (!room.firstPlayer) {
                room.firstPlayer = candidate;
                await room.save();
            }
            else if (!room.secondPlayer && room.firstPlayer.toString() !== candidate._id.toString()) {
                console.log("!!!",room.firstPlayer, candidate._id)
                room.secondPlayer = candidate;
                await room.save();
                emitToPlayers(req,[room.firstPlayer.toString()],'updateLobbyData', {});
            }
            return res.status(200).json({status: "connected"});
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
            return res.status(200).json({status: "room created"});
        }
        catch (error) {
            console.log(error);
        }
    }

    public getRoomList = async (req: Request, res: Response): Promise<any> => {
        try {
            const gameName = req.params.gameName;
            const game = await Game.findOne({name: gameName});
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;
            if (!game) {
                return res.status(404).json({message: "Game not found!"})
            }
            const allRooms = await Room.find({game: game._id,status: "active"});
            const rooms: IRoom[] = await Room.find({game: game._id,status: "active"})
                .skip(skip)
                .limit(limit)
                .sort({ _id: -1 })
                .populate('firstPlayer' )
                .populate('secondPlayer')
                .exec();
            const totalRooms = allRooms.length;
            const totalPages = Math.ceil(totalRooms / limit);
            const transformedRooms = rooms.map(room => {
                return {
                    _id: room._id,
                    firstPlayer: room.firstPlayer ? room.firstPlayer.username : "no player",
                    secondPlayer: room.secondPlayer ? room.secondPlayer.username : "no player"
                };
            });
            res.json({transformedRooms, totalPages});
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
                    firstPlayer: currentRoom.firstPlayer ?
                        {username: currentRoom.firstPlayer.username,
                        firstName: currentRoom.firstPlayer.firstName,
                        lastName: currentRoom.firstPlayer.lastName,
                        statistics: currentRoom.firstPlayer.statistics,
                        avatar: currentRoom.firstPlayer.avatar} : {},
                    secondPlayer: currentRoom.secondPlayer ?
                        {username: currentRoom.secondPlayer.username,
                        firstName: currentRoom.secondPlayer.firstName,
                        lastName: currentRoom.secondPlayer.lastName,
                        statistics: currentRoom.secondPlayer.statistics,
                        avatar: currentRoom.secondPlayer.avatar} : {}
            };
            res.send(transformedRoom);
        }
        catch (error) {
            console.log(error);
        }
    }
}

export default new roomController();