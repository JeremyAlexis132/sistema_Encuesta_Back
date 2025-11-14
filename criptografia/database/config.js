const {Sequelize} = require('sequelize');

const dbCriptografia = new Sequelize(process.env.CRIPTOGRAFIA_DBNAME, process.env.CRIPTOGRAFIA_DBUSER, process.env.CRIPTOGRAFIA_DBPASSWORD, {
  host:'localhost',
  dialect: 'mysql',
});

module.exports = {
  dbCriptografia,
}