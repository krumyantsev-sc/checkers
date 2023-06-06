const { Model, DataTypes } = require('sequelize');
import sequelize from '../db/database';
import Role from './Role';

interface UserAttributes {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
}

interface UserInstance extends Model<UserAttributes>, UserAttributes {
    addRole: (role: Role) => Promise<void>;
}

const User = sequelize.define<UserInstance>('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING, defaultValue: "profile-avatar-default.png" },
})

export default User;