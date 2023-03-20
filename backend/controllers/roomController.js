const User = require("../models/User")
const Room = require("../models/Room")
const jwt = require("jsonwebtoken");
const {secret} = require("../config/config");
const {io} = require("../index")

class roomController {
    firstPlayer = null;
    secondPlayer = null;

    async connect(req,res) {
        const token = req.headers.authorization.split(' ')[1]
        const {id: userId} = jwt.verify(token, secret);
        const candidate = await User.findById(userId);
        const roomId = req.body.roomId;
        const room = await Room.findById(roomId);
        console.log("zzzzzzaa",room.firstPlayerId);
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
        res.render('main.hbs', {
            roomId: lobbyId
        })
    }
}

module.exports = new roomController();