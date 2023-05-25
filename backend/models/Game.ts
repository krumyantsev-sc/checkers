import {Schema, model, Document} from "mongoose";

export interface IGame extends Document {
    name: string;
    description: string;
    logo: string;
}

const GameSchema = new Schema({
    name: {type: String, unique: true, required: true},
    description: {type: String, required: true},
    logo: {type: String, default: "question.jpg"},
});

const GameModel = model<IGame>("Game", GameSchema);
export default GameModel;
