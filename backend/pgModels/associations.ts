import User from './User';
import Role from './Role';
import Statistics from './Statistics';

User.belongsToMany(Role, { through: 'UserRole' });
Role.belongsToMany(User, { through: 'UserRole' });

User.hasOne(Statistics, { foreignKey: 'userId', as: 'statistics' });
Statistics.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

export default { User, Role, Statistics };