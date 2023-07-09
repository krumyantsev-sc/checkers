import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    ForeignKey,
    UpdatedAt,
    HasMany, BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";
import { Game } from "./Game";
import { Message } from "./Message";

@Table({
    defaultScope: {
        attributes: { exclude: ["deletedAt"] },
    },
    paranoid: true,
    tableName: "rooms",
})
export class Room extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    firstPlayerId!: string | null;

    @BelongsTo(() => User,{as: 'firstPlayer'})
    firstPlayer!: User;

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    secondPlayerId!: string | null;

    @BelongsTo(() => User, {as: 'secondPlayer'})
    secondPlayer!: User;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
    })
    winnerId!: number;

    @Column({
        type: DataType.ENUM,
        values: ["active", "finished"],
        defaultValue: "active",
    })
    status!: string;

    @ForeignKey(() => Game)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
    })
    gameId!: number;

    @HasMany(() => Message)
    chat!: Message[];

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    createdAt!: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    startedAt!: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    finishedAt!: Date;
}