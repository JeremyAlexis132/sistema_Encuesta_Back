const { Pregunta, Encuesta, Respuesta } = require('../models');

// POST /respuestas - Responder pregunta
const obtenerRespuestas = async (req, res) => {
  try {
    const { idPregunta, respuesta } = req.body;

    if (!idPregunta || !respuesta) {
      return res.status(400).json({ error: 'Falta idPregunta o respuesta' });
    }

    // Verificar que la pregunta existe
    const pregunta = await Pregunta.findByPk(idPregunta);
    if (!pregunta) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    // Verificar que el usuario no haya contestado ya esta pregunta
    const respuestaExistente = await Respuesta.findOne({
      where: {
        idPregunta,
        idUsuario: req.user.idUsuario
      }
    });

    if (respuestaExistente) {
      return res.status(400).json({ error: 'Ya has contestado esta pregunta' });
    }

    // Crear nueva respuesta
    await Respuesta.create({
      idPregunta,
      idUsuario: req.user.idUsuario,
      respuesta
    });

    res.json({ mensaje: 'Respuesta registrada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /respuestas/obtener-encuesta - Obtener encuesta con todas las respuestas
const obtenerEncuesta = async (req, res) => {
  try {
    const { idEncuesta } = req.body;

    if (!idEncuesta) {
      return res.status(400).json({ error: 'Falta idEncuesta' });
    }

    const encuesta = await Encuesta.findByPk(idEncuesta, {
      include: [
        {
          model: Pregunta,
          include: [
            {
              model: Respuesta,
              attributes: ['idRespuesta', 'idUsuario', 'respuesta', 'fechaRespuesta']
            }
          ]
        }
      ]
    });
    
    if (!encuesta) {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }

    res.json({
      encuesta: {
        idEncuesta: encuesta.idEncuesta,
        idUsuario: encuesta.idUsuario,
        Preguntas: encuesta.Preguntas
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /respuestas/obtener-pregunta - Obtener pregunta con sus respuestas
const obtenerPregunta = async (req, res) => {
  try {
    const { idPregunta } = req.body;

    if (!idPregunta) {
      return res.status(400).json({ error: 'Falta idPregunta' });
    }

    const pregunta = await Pregunta.findByPk(idPregunta, {
      include: [
        {
          model: Respuesta,
          attributes: ['idRespuesta', 'idUsuario', 'respuesta', 'fechaRespuesta']
        }
      ]
    });
    
    if (!pregunta) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    res.json({ pregunta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  obtenerRespuestas,
  obtenerEncuesta,
  obtenerPregunta
};