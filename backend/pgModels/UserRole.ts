import {
    Table,
    Column,
    Model,
    ForeignKey,
} from 'sequelize-typescript';
import { User } from './User';
import { Role } from './Role';

@Table
export class UserRole extends Model {
    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Role)
    @Column
    roleId: number;
}