const { DataTypes } = require('sequelize');
const { dbCriptografia } = require('../database/config.js');
  
const Pregunta = dbCriptografia.define('Pregunta', {
  idPregunta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idEncuesta: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  texto: {
    type: DataTypes.STRING(300),
    allowNull: false
  }
}, {
  tableName: 'Pregunta',
  timestamps: false
});

module.exports = Pregunta;
