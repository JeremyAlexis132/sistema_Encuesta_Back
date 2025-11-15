// Importar todos los modelos
const Administrador = require('./Administrador');
const Usuario = require('./Usuario');
const Encuesta = require('./Encuesta');
const Pregunta = require('./Pregunta');
const Respuesta = require('./Respuesta');
const EncuestaAsignada = require('./EncuestaAsignada');
const OpcionRespuesta = require('./OpcionRespuesta');

// Definir relaciones
Usuario.hasMany(EncuestaAsignada, { foreignKey: 'idUsuario' });
EncuestaAsignada.belongsTo(Usuario, { foreignKey: 'idUsuario' });

Encuesta.hasMany(EncuestaAsignada, { foreignKey: 'idEncuesta' });
EncuestaAsignada.belongsTo(Encuesta, { foreignKey: 'idEncuesta' });

Pregunta.hasMany(OpcionRespuesta, { foreignKey: 'idPregunta', onDelete: 'CASCADE' });
OpcionRespuesta.belongsTo(Pregunta, { foreignKey: 'idPregunta' });

Encuesta.hasMany(Pregunta, { foreignKey: 'idEncuesta' });
Pregunta.belongsTo(Encuesta, { foreignKey: 'idEncuesta' });

Usuario.hasMany(Respuesta, { foreignKey: 'idUsuario', onDelete: 'CASCADE' });
Respuesta.belongsTo(Usuario, { foreignKey: 'idUsuario' });

Pregunta.hasMany(Respuesta, { foreignKey: 'idPregunta', onDelete: 'CASCADE' });
Respuesta.belongsTo(Pregunta, { foreignKey: 'idPregunta' });

OpcionRespuesta.hasMany(Respuesta, { foreignKey: 'idOpcionRespuesta', onDelete: 'CASCADE' });
Respuesta.belongsTo(OpcionRespuesta, { foreignKey: 'idOpcionRespuesta' });

module.exports = {
  Administrador,
  Usuario,
  Encuesta,
  EncuestaAsignada,
  Pregunta,
  Respuesta,
  OpcionRespuesta
};
