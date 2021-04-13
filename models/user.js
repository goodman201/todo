const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
   const User = DataTypes.define('user', {
       name: {
           type: DataTypes.STRING(128)
       },
       email: {
           type: DataTypes.STRING(128),
           unique: true
       },
       password: {
           allowNull: true,
           type: DataTypes.STRING(128)
       },
       avatar: {
           allowNull: true,
           type: DataTypes.STRING(128)
       }

    }, {
       tableName: 'users'
    });

    User.associate = (models) => {
        User.hasMany(models.task);
    };
};
