import { Sequelize } from 'sequelize-typescript';
import { User } from '../pgModels/User';
import {UserRole} from "../pgModels/UserRole";
import {Role} from "../pgModels/Role";
import {Statistic} from "../pgModels/Statistic";
import {Game} from "../pgModels/Game";
import {Room} from "../pgModels/Room";
import {Message} from "../pgModels/Message";

export const sequelize = new Sequelize({
    database: 'gamesint',
    dialect: 'postgres',
    username: 'postgres',
    password: '13372281',
    models: [User, Role, UserRole, Statistic, Game, Room, Message],
});