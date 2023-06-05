import User from "./User";
import Role from "./Role";
import Statistics from './Statistics';

User.hasOne(Statistics, {
    foreignKey: 'userId',
    as: 'statistics',
});

Statistics.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

User.belongsToMany(Role, {
    through: 'UserRole',
    foreignKey: 'userId',
    otherKey: 'roleId'
});

Role.belongsToMany(User, {
    through: 'UserRole',
    foreignKey: 'roleId',
    otherKey: 'userId'
});

module.exports = { User, Role, Statistics };