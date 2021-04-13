const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Task = DataTypes.define('task', {
        userId: {
            type: DataTypes.INTEGER,
            unique: true
        },
        title: {
            type: DataTypes.STRING(128)
        },
        description: {
            allowNull: true,
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'DONE')
        },
        position: {
            type: DataTypes.INTEGER
        },
        importance: {
            allowNull: true,
            type: DataTypes.ENUM('HIGH', 'AVERAGE', 'LOW')
        }


    }, {
        tableName: 'tasks'
    });


    Task.associate = (models) => {
        Task.belongsTo(models.user);
    };
};
