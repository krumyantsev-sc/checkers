import {
    Table,
    Column,
    Model,
    DataType,
    BelongsToMany,
} from 'sequelize-typescript';
import {User} from "./User";
import {UserRole} from "./UserRole";


@Table
export class Role extends Model {
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    name: string;

    @BelongsToMany(() => User, () => UserRole)
    users: User[];
}