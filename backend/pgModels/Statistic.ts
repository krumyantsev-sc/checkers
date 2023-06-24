import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from './User';

@Table
export class Statistic extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId!: number;

    @Column(DataType.INTEGER)
    wins!: number;

    @Column(DataType.INTEGER)
    loses!: number;

    @BelongsTo(() => User)
    user!: User;
}