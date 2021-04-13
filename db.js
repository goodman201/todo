const {Sequelize} = require('sequelize');
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize({
    username: '',
    password: '',
    database: '',
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

fs.readdirSync(path.join(__dirname, 'models')).filter((file) => {
    return (file.indexOf('.') !== 0);
}).forEach((file) => {
    require(path.join(__dirname, 'models', file))(sequelize);
});

module.exports = sequelize;
