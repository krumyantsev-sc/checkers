import { Schema, model } from 'mongoose';

const RoomSchema = new Schema({
    firstPlayerId: {type: String, default: "no player"},
    secondPlayerId: {type: String, default: "no player"},
    winner: {type: String, default: "no winner"}
});

const RoomModel = model('Room', RoomSchema);

export default RoomModel;