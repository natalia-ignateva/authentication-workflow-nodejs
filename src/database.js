const Sequelize = require('sequelize');

const user = 'postgres';
const password = 'dekameron';
const database = 'authpassport';

const sequelize = new Sequelize(database, user, password, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

sequelize
    .authenticate()
    .then(() => console.log('Database connected'))
    .catch((err) => console.log('Error' + err));

module.exports = sequelize;
