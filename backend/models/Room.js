const {Schema, model} = require('mongoose');

const Room = new Schema({
    firstPlayerId: {type: String, default: "no player"},
    secondPlayerId: {type: String, default: "no player"},
    winner: {type: String, default: "no winner"}
});

module.exports = model("Room",Room);