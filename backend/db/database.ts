import {Sequelize} from 'sequelize';

const sequelize = new Sequelize('gamesint', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres'
});

export default sequelize;