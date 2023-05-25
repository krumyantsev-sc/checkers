import {Schema, model, Document} from 'mongoose';

export interface IMessage extends Document {
    author: string;
    text: string;
}

const MessageSchema = new Schema({
    author: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});

export const MessageModel = model<IMessage>('Message', MessageSchema);