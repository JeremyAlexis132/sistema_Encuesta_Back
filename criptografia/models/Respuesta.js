const { DataTypes } = require('sequelize');
const { dbCriptografia } = require('../database/config.js');

const Respuesta = dbCriptografia.define('Respuesta', {
  idRespuesta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPregunta: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fechaRespuesta: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Respuesta',
  timestamps: false
});

module.exports = Respuesta;
