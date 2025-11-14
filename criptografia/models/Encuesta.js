const { DataTypes } = require('sequelize');
const { dbCriptografia } = require('../database/config.js');

const Encuesta = dbCriptografia.define('Encuesta', {
  idEncuesta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Encuesta',
  timestamps: false
});

module.exports = Encuesta;
