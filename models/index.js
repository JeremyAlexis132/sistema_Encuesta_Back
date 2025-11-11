// Importar todos los modelos
const Administrador = require('./Administrador');
const Usuario = require('./Usuario');
const Encuesta = require('./Encuesta');
const Pregunta = require('./Pregunta');

// Definir relaciones
// Usuario - Encuesta (One to Many)
Usuario.hasMany(Encuesta, { foreignKey: 'idUsuario' });
Encuesta.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// Encuesta - Pregunta (One to Many)
Encuesta.hasMany(Pregunta, { foreignKey: 'idEncuesta' });
Pregunta.belongsTo(Encuesta, { foreignKey: 'idEncuesta' });

module.exports = {
  Administrador,
  Usuario,
  Encuesta,
  Pregunta
};
