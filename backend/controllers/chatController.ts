import {Request, Response} from "express";
import Room, {IRoom} from "../models/Room";

const jwt = require("jsonwebtoken");
import User, {IUser} from "../models/User";
import {IMessage, MessageModel} from "../models/Message";

const secret = require("../config/config");
import emitToPlayers from "../util/util";
import {HydratedDocument} from "mongoose";

class chatController {
    public getMessages = async (req: Request, res: Response) => {
        try {
            const room = await Room.findById(req.params.roomId);
            return res.status(200).json(room.chat);
        } catch (e) {
            return res.status(404).json({message: "room not found"});
        }
    }

    public sendMessage = async (req: Request, res: Response) => {
        try {
            const room: IRoom = await Room.findById(req.params.roomId);
            const token: string = req.cookies.jwt;
            const {id: userId} = jwt.verify(token, secret);
            const user: IUser = await User.findById(userId);
            const text: string = req.body.text;
            const message = {
                author: user.username,
                text: text,
            };
            const newMessage: HydratedDocument<IMessage> = new MessageModel(message);
            room.chat.push(<IMessage>newMessage);
            emitToPlayers(req, [room.firstPlayer.toString(), room.secondPlayer.toString()], 'newMessage', message)
            await room.save();
            return res.status(200).json({message: "successfully sent"});
        } catch (e) {
            return res.status(404).json({message: "room not found"});
        }
    }
}

export default new chatController();