import {Schema, model, Document} from 'mongoose';

export interface IRoom extends Document{
    firstPlayerId: string;
    secondPlayerId: string;
    winner: string;
}

const statusEnum: string[] = ['active', 'finished'];

const RoomSchema = new Schema({
    firstPlayerId: {type: String, default: "no player"},
    secondPlayerId: {type: String, default: "no player"},
    winner: {type: String, default: "no winner"},
    status: {
        type: String,
        enum: statusEnum,
        default: 'viewer',
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
    }
});

const RoomModel = model<IRoom>('Room', RoomSchema);

export default RoomModel;