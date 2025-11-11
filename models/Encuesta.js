const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Usuario = require('./Usuario');

const Encuesta = sequelize.define('Encuesta', {
  idEncuesta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'idUsuario'
    }
  }
}, {
  tableName: 'Encuesta',
  timestamps: false
});

Encuesta.belongsTo(Usuario, { foreignKey: 'idUsuario' });

module.exports = Encuesta;
