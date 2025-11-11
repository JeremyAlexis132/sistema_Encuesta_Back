const express = require('express');
const { Pregunta, Encuesta } = require('../models');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST /respuestas - Responder pregunta
router.post('/', verifyToken, async (req, res) => {
  try {
    const { idPregunta, respuesta } = req.body;

    if (!idPregunta || !respuesta) {
      return res.status(400).json({ error: 'Falta idPregunta o respuesta' });
    }

    const pregunta = await Pregunta.findByPk(idPregunta);
    if (!pregunta) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    await pregunta.update({ respuesta });

    res.json({ mensaje: 'Respuesta registrada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /respuestas/encuesta - Obtener respuestas de encuesta
router.post('/obtener-encuesta', verifyToken, async (req, res) => {
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
});

// POST /respuestas/obtener-pregunta - Obtener respuesta de pregunta
router.post('/obtener-pregunta', verifyToken, async (req, res) => {
  try {
    const { idPregunta } = req.body;

    if (!idPregunta) {
      return res.status(400).json({ error: 'Falta idPregunta' });
    }

    const pregunta = await Pregunta.findByPk(idPregunta);
    if (!pregunta) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    res.json({ pregunta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
