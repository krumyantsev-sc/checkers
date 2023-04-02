import User from "../models/User"
const Room = require("../models/Room")
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
const emitToPlayers = require("../util/util");

class roomController {
    firstPlayer = null;
    secondPlayer = null;

    async connect(req,res) {
        const token = req.headers.authorization.split(' ')[1]
        const {id: userId} = jwt.verify(token, secret);
        const candidate = await User.findById(userId);
        const roomId = req.body.roomId;
        const room = await Room.findById(roomId);
        if (room.firstPlayerId === "no player") {
            room.firstPlayerId = candidate._id;
            room.save();
        } else if (room.secondPlayerId === "no player") {
            room.secondPlayerId = candidate._id;
            room.save();
        }
        res.sendStatus(200);
    }

    async createRoom(req,res) {
        const room = new Room();
        await room.save();
        res.sendStatus(200);
    }

    async getRoomList(req,res) {
        try {
            const rooms = await Room.find();
            res.json(rooms);
        } catch (e) {
            console.log(e);
        }
    }
    async getRoomId(req,res) {
        const token = req.headers.authorization.split(' ')[1]
        const {id: userId} = jwt.verify(token, secret);
        let currentRoom = await Room.findOne({$or:[{'firstPlayerId': userId}, {'secondPlayerId': userId}]});
        res.send({roomId:currentRoom._id});
    }

    async getLobbyInfo(req,res) {
        const token = req.headers.authorization.split(' ')[1]
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
            emitToPlayers(req,[currentRoom.firstPlayerId],'updateLobbyData',
                {roomId: currentRoom._id, firstPlayer: firstPlayer, secondPlayer: secondPlayer});
            emitToPlayers(req,[currentRoom.firstPlayerId, currentRoom.secondPlayerId],'makeBtnActive',{});
        }
    }
}

module.exports = new roomController();