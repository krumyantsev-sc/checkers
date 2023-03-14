const User = require("../models/User")
const Room = require("../models/Room")
const jwt = require("jsonwebtoken");
const {secret} = require("../config/config");

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
    }

    async createRoom() {
        const room = new Room({firstPlayerId: this.firstPlayer, secondPlayerId: this.secondPlayer});
        await room.save();
        this.firstPlayer = null;
        this.secondPlayer = null;
    }
}