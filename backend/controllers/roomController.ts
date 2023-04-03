import User from "../models/User"
import Room from "../models/Room"
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
const emitToPlayers = require("../util/util");

class roomController {
    firstPlayer: any = null;
    secondPlayer: any = null;

    connect = async (req: any, res: any) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const {id: userId} = jwt.verify(token, secret);

            const candidate = await User.findById(userId);
            const roomId = req.body.roomId;
            const room = await Room.findById(roomId);

            if (room.firstPlayerId === "no player") {
                room.firstPlayerId = candidate._id;
                await room.save();
            }
            else if (room.secondPlayerId === "no player") {
                room.secondPlayerId = candidate._id;
                await room.save();
            }

            res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
        }
    }

    createRoom = async (req: any, res: any) => {
        try {
            const room = new Room();
            await room.save();
            res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
        }
    }

    getRoomList = async (req: any, res: any) => {
        try {
            const rooms = await Room.find();
            res.json(rooms);
        }
        catch (error) {
            console.log(error);
        }
    }

    getRoomId = async (req: any, res: any) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const {id: userId} = jwt.verify(token, secret);
            let currentRoom = await Room.findOne({$or:[{'firstPlayerId': userId}, {'secondPlayerId': userId}]});
            res.send({roomId:currentRoom._id});
        }
        catch (error) {
            console.log(error);
        }
    }

    getLobbyInfo = async (req: any, res: any) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const {id: userId} = jwt.verify(token, secret);
            let currentRoom = await Room.findOne({$or:[{'firstPlayerId': userId}, {'secondPlayerId': userId}]});
            let firstPlayer = "no player";
            let secondPlayer = "no player";
            if (currentRoom.firstPlayerId !== "no player") {
                firstPlayer = await User.findById(currentRoom.firstPlayerId);
                firstPlayer = firstPlayer.username;
            }
            if (currentRoom.secondPlayerId !== "no player") {
                secondPlayer = await User.findById(currentRoom.secondPlayerId);
                secondPlayer = secondPlayer.username;
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