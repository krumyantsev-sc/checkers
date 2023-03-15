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
        console.log(token);
        const {id: userId} = jwt.verify(token, secret);
        const candidate = await User.findById(userId);
        if ((candidate) && (this.firstPlayer === null)) {
            this.firstPlayer = userId;
        } else if ((candidate) && (this.firstPlayer !== null) && (this.secondPlayer === null)) {
            this.secondPlayer = userId;
        }
        if (this.firstPlayer !== null && this.secondPlayer !== null) {
            await this.createRoom()
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


}

module.exports = new roomController();