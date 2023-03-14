const {Schema, model} = require('mongoose');

const Room = new Schema({
    firstPlayerId: {type: String, required: true},
    secondPlayerId: {type: String, required: true},
    winner: {type: String, default: "no winner"}
});

module.exports = model("Room",Room);