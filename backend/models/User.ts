import {Schema, model, Document} from "mongoose";
import {IRole} from "./Role";

export interface IUser extends Document{
    username: string;
    password: string;
    role: Array<IRole>;
}

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: [{type:String, ref:'Role'}]
});

const UserModel = model<IUser>("User", UserSchema);
export default UserModel;
