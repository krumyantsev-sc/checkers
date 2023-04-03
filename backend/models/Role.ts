import {Schema, model, Document} from 'mongoose';

export interface IRole extends Document {
    value: string;
}

const RoleSchema = new Schema({
    value: { type: String, unique: true, default: 'USER' },
});

const RoleModel = model<IRole>('Role', RoleSchema);

export default RoleModel;