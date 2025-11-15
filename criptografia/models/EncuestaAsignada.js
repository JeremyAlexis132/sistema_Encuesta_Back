const { DataTypes } = require('sequelize');
const { dbCriptografia } = require('../database/config.js');

const EncuestaAsignada = dbCriptografia.define('EncuestaAsignada', {
  idEncuestaAsignada: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idEncuesta: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'EncuestaAsignada',
  timestamps: false
});

module.exports = EncuestaAsignada;