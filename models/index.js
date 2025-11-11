// Importar todos los modelos
const Administrador = require('./Administrador');
const Usuario = require('./Usuario');
const Encuesta = require('./Encuesta');
const Pregunta = require('./Pregunta');
const Respuesta = require('./Respuesta');

// Definir relaciones
// Usuario - Encuesta (One to Many)
Usuario.hasMany(Encuesta, { foreignKey: 'idUsuario' });
Encuesta.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// Encuesta - Pregunta (One to Many)
Encuesta.hasMany(Pregunta, { foreignKey: 'idEncuesta' });
Pregunta.belongsTo(Encuesta, { foreignKey: 'idEncuesta' });

// Pregunta - Respuesta (One to Many)
Pregunta.hasMany(Respuesta, { foreignKey: 'idPregunta', onDelete: 'CASCADE' });
Respuesta.belongsTo(Pregunta, { foreignKey: 'idPregunta' });

// Usuario - Respuesta (One to Many)
Usuario.hasMany(Respuesta, { foreignKey: 'idUsuario', onDelete: 'CASCADE' });
Respuesta.belongsTo(Usuario, { foreignKey: 'idUsuario' });

module.exports = {
  Administrador,
  Usuario,
  Encuesta,
  Pregunta,
  Respuesta
};
