const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Pregunta = sequelize.define('Pregunta', {
  idPregunta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idEncuesta: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pregunta: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Pregunta',
  timestamps: false
});

module.exports = Pregunta;
