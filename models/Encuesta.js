const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Encuesta = sequelize.define('Encuesta', {
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
