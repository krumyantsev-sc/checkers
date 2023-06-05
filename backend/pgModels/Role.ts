const { DataTypes, Model } = require('sequelize');
import sequelize from '../db/database';

const Role = sequelize.define('Role', {
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
});

export default Role