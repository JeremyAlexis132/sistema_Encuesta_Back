const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Encuesta = require('./Encuesta');

const Pregunta = sequelize.define('Pregunta', {
  idPregunta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idEncuesta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Encuesta,
      key: 'idEncuesta'
    }
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

Pregunta.belongsTo(Encuesta, { foreignKey: 'idEncuesta' });

module.exports = Pregunta;
