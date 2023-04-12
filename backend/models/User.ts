import {Schema, model, Document} from "mongoose";
import {IRole} from "./Role";

export interface IUser extends Document{
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    wins: number;
    loses: number;
    email: string;
    avatar: string;
    role: Array<IRole>;
}

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    wins: {type: Number, default: 0},
    loses: {type: Number, default: 0},
    email: {type: String, required: true},
    avatar: {type: String},
    role: [{type:String, ref:'Role'}]
});

const UserModel = model<IUser>("User", UserSchema);
export default UserModel;
