import { Schema, model, Document } from 'mongoose';
import { IUser } from "./User";
import { IGame } from "./Game";
import { IMessage, MessageModel } from "./Message";

export interface IRoom extends Document {
    firstPlayer: IUser['_id'];
    secondPlayer: IUser['_id'];
    winner: IUser['_id'];
    status: string;
    game: IGame['_id'];
    chat: IMessage[];
}

const statusEnum: string[] = ['active', 'finished'];

const RoomSchema = new Schema({
    firstPlayer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    secondPlayer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: statusEnum,
        default: 'active',
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
    },
    chat: {
        type: [MessageModel.schema],
        default: [],
    },
});

export const RoomModel = model<IRoom>('Room', RoomSchema);

export default RoomModel;