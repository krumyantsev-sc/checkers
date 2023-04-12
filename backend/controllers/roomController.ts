import User from "../models/User"
import {IUser} from "../models/User"
import Room from "../models/Room"
import {IRoom} from "../models/Room"
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
import emitToPlayers from "../util/util";
import {Request, Response} from 'express';
import {HydratedDocument} from "mongoose";

class roomController{
    public connect = async (req: Request, res: Response): Promise<any> => {
        try {
            const token: string = req.cookies.jwt;
            const {id: userId} = jwt.verify(token, secret);
            const candidate: IUser = await User.findById(userId);
            const roomId: string = req.body.roomId;
            const room: IRoom = await Room.findById(roomId);
            if (room.firstPlayerId === "no player") {
                room.firstPlayerId = candidate._id;
                await room.save();
            }
            else if (room.secondPlayerId === "no player") {
                room.secondPlayerId = candidate._id;
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
            const room: HydratedDocument<IRoom> = new Room();
            await room.save();
            res.sendStatus(200).json({status: "room created"});
        }
        catch (error) {
            console.log(error);
        }
    }

    public getRoomList = async (req: Request, res: Response): Promise<any> => {
        try {
            const rooms: IRoom[] = await Room.find();
            res.json(rooms);
        }
        catch (error) {
            console.log(error);
        }
    }

    public getRoomId = async (req: Request, res: Response): Promise<any> => {
        try {
            const token: string = req.cookies.jwt;
            const {id: userId} = jwt.verify(token, secret);
            let currentRoom: IRoom = await Room.findOne({$or:[{'firstPlayerId': userId}, {'secondPlayerId': userId}]});
            res.send({roomId:currentRoom._id});
        }
        catch (error) {
            console.log(error);
        }
    }

    public getLobbyInfo = async (req: Request, res: Response): Promise<any> => {
        try {
            const token: string = req.cookies.jwt;
            const {id: userId} = jwt.verify(token, secret);
            let currentRoom: IRoom = await Room.findOne({$or:[{'firstPlayerId': userId}, {'secondPlayerId': userId}]});
            let firstPlayer: string = "no player";
            let secondPlayer: string = "no player";
            if (currentRoom.firstPlayerId !== "no player") {
                let firstPlayerDoc: IUser = await User.findById(currentRoom.firstPlayerId);
                firstPlayer = firstPlayerDoc.username;
            }
            if (currentRoom.secondPlayerId !== "no player") {
                let secondPlayerDoc: IUser = await User.findById(currentRoom.secondPlayerId);
                secondPlayer = secondPlayerDoc.username;
            }
            res.send({roomId: currentRoom._id, firstPlayer: firstPlayer, secondPlayer: secondPlayer});
            if (currentRoom.firstPlayerId !== "no player" && currentRoom.secondPlayerId !== "no player") {
                emitToPlayers(req,[currentRoom.firstPlayerId],'updateLobbyData', {roomId: currentRoom._id, firstPlayer: firstPlayer, secondPlayer: secondPlayer});
                emitToPlayers(req,[currentRoom.firstPlayerId, currentRoom.secondPlayerId],'makeBtnActive',{});
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}

export default new roomController();