const { DataTypes, Model } = require('sequelize');
import sequelize from '../db/database';

const Statistics = sequelize.define('Statistics', {
    wins: { type: DataTypes.INTEGER, defaultValue: 0 },
    loses: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export default Statistics