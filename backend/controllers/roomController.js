const User = require("../models/User")
const Room = require("../models/Room")
const jwt = require("jsonwebtoken");
const {secret} = require("../config/config");
const {authenticateToken} = require("../jwtVerification");
const app = require("../index")

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
    async test(req,res) {
        res.sendStatus(200);
    }

    async getRoomInfo(id) {
        const room = await Room.findById(id);
        return {firstPlayerId: room.firstPlayerId, secondPlayerId: room.secondPlayerId};
    }

    async createLobbyPage(req,res) {
        let lobbyId = req.params.lobbyId;
        const room = await Room.findById(lobbyId);
        let firstPlayerName = "no player";
        let secondPlayerName = "no player";
        if (room.firstPlayerId !== "no player") {
            let firstPlayer = await User.findById(room.firstPlayerId);
             firstPlayerName = firstPlayer.username;
        }
        if (room.secondPlayerId !== "no player") {
            let secondPlayer = await User.findById(room.secondPlayerId);
            secondPlayerName = secondPlayer.username;
            app.get("socketService").emiter('message', req.body);
        }
        res.render('main.hbs', {
            firstPlayerName: firstPlayerName,
            secondPlayerName: secondPlayerName,
            roomId: lobbyId
        })
        if (room.firstPlayerId !== "no player" && room.secondPlayerId !== "no player") {
            req.app.get("socketService").emiter('playersReady', room.firstPlayerId, {roomId: lobbyId});
            req.app.get("socketService").emiter('playersReady', room.secondPlayerId, {roomId: lobbyId});
        }
    }
}

module.exports = new roomController();