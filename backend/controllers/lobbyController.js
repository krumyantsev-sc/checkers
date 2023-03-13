const User = require("../models/User")
const jwt = require("jsonwebtoken");
const {secret} = require("../config/config");





class lobbyController {
    player1;
    player2;

    async connect(req,res) {
        console.log("middleware test");
        res.sendStatus(200);
    }

    async join() {

    }
}

module.exports = new lobbyController();