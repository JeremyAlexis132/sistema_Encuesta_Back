const { DataTypes } = require('sequelize');
const { dbCriptografia } = require('../database/config.js');

const OpcionRespuesta = dbCriptografia.define('OpcionRespuesta', {
  idOpcionRespuesta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idPregunta: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  opcion: {
    type: DataTypes.STRING(200),
    allowNull: false
  }
}, {
  tableName: 'OpcionRespuesta',
  timestamps: false
});

module.exports = OpcionRespuesta;