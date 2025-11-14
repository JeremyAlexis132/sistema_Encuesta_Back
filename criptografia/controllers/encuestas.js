const { Encuesta, Usuario, Pregunta } = require('../models');

// POST /encuestas/crear - Crear encuesta (solo admin)
const crear = async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden crear encuestas' });
    }

    const { idUsuario } = req.body;

    if (!idUsuario) {
      return res.status(400).json({ error: 'Falta idUsuario' });
    }

    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const encuesta = await Encuesta.create({ idUsuario });

    res.status(201).json({
      mensaje: 'Encuesta creada',
      encuesta: { idEncuesta: encuesta.idEncuesta, idUsuario }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /encuestas/agregar-pregunta - Agregar pregunta (solo admin)
const agregarPregunta = async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden crear preguntas' });
    }

    const { idEncuesta, pregunta } = req.body;

    if (!idEncuesta || !pregunta) {
      return res.status(400).json({ error: 'Falta idEncuesta o pregunta' });
    }

    const encuesta = await Encuesta.findByPk(idEncuesta);
    if (!encuesta) {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }

    const nuevaPregunta = await Pregunta.create({ idEncuesta, pregunta });

    res.status(201).json({
      mensaje: 'Pregunta añadida',
      pregunta: { idPregunta: nuevaPregunta.idPregunta, idEncuesta, pregunta }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET /encuestas - Obtener todas las encuestas
const obtenerEncuestas = async (req, res) => {
  try {
    const encuestas = await Encuesta.findAll({
      include: [{ model: Pregunta }]
    });

    res.json({ encuestas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /encuestas/obtener - Obtener encuesta específica
const obtenerEncuesta = async (req, res) => {
  try {
    const { idEncuesta } = req.body;

    if (!idEncuesta) {
      return res.status(400).json({ error: 'Falta idEncuesta' });
    }

    const encuesta = await Encuesta.findByPk(idEncuesta, {
      include: [{ model: Pregunta }]
    });
    
    if (!encuesta) {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }

    res.json({ encuesta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  crear,
  agregarPregunta,
  obtenerEncuestas,
  obtenerEncuesta
};
