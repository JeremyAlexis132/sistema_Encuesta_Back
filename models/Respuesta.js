const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Respuesta = sequelize.define('Respuesta', {
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
