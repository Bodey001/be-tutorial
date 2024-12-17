const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("tutorial_db", "root", "Wunmi10@mysql", {
    host: "localhost",
    dialect: "mysql",
    logging: true
});

module.exports = sequelize;