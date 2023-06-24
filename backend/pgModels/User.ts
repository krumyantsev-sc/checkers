import {
    Table,
    Column,
    Model,
    DataType,
    BelongsToMany,
    HasOne, HasMany
} from 'sequelize-typescript';
import { UserRole } from './UserRole';
import {Role} from "./Role";
import { Statistic } from './Statistic';
import {Room} from "./Room";

@Table
export class User extends Model {
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    firstName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    lastName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email: string;

    @Column({
        type: DataType.STRING,
        defaultValue: "profile-avatar-default.png"
    })
    avatar: string;

    @HasOne(() => Statistic)
    statistic!: Statistic;

    @BelongsToMany(() => Role, () => UserRole)
    roles: Role[];

    @HasMany(() => Room, 'firstPlayerId')
    firstPlayerRooms!: Room[];

    @HasMany(() => Room, 'secondPlayerId')
    secondPlayerRooms!: Room[];
}