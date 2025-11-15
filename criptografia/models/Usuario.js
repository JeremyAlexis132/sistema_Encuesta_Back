const { DataTypes } = require('sequelize');
const { dbCriptografia } = require('../database/config.js');

const Usuario = dbCriptografia.define('Usuario', {
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numeroCuenta: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  correo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  privateKey: {
    type: DataTypes.TEXT,  // Cambiar a TEXT para soportar claves RSA en formato PEM
    allowNull: false
  }
}, {
  tableName: 'Usuario',
  timestamps: false
});

module.exports = Usuario;
