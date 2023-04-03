import {Schema, model, Document} from 'mongoose';

export interface IRoom extends Document {
    firstPlayerId: string;
    secondPlayerId: string;
    winner: string;
}

const RoomSchema = new Schema({
    firstPlayerId: {type: String, default: "no player"},
    secondPlayerId: {type: String, default: "no player"},
    winner: {type: String, default: "no winner"}
});

const RoomModel = model<IRoom>('Room', RoomSchema);

export default RoomModel;