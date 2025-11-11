const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Administrador = sequelize.define('Administrador', {
  idAdministrador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'Administrador',
  timestamps: false
});

module.exports = Administrador;
