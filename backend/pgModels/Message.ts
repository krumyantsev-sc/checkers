import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Room } from './Room';

@Table({
    defaultScope: {
        attributes: { exclude: ['deletedAt'] },
    },
    paranoid: true,
    tableName: 'messages',
})
export class Message extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    author!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    text!: string;

    @ForeignKey(() => Room)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    roomId!: number;

    @BelongsTo(() => Room)
    room!: Room;
}