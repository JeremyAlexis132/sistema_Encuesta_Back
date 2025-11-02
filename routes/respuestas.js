const express = require('express');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST /respuestas/:idPregunta - Responder pregunta
router.post('/:idPregunta', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { idPregunta } = req.params;
    const { respuesta } = req.body;

    if (!respuesta) {
      return res.status(400).json({ error: 'Falta respuesta' });
    }

    const [pregunta] = await connection.query('SELECT * FROM Pregunta WHERE idPregunta = ?', [idPregunta]);
    if (pregunta.length === 0) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    await connection.query('UPDATE Pregunta SET respuesta = ? WHERE idPregunta = ?', [respuesta, idPregunta]);

    res.json({ mensaje: 'Respuesta registrada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// GET /respuestas/encuesta/:idEncuesta - Obtener respuestas de encuesta
router.get('/encuesta/:idEncuesta', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { idEncuesta } = req.params;

    const [encuesta] = await connection.query('SELECT * FROM Encuesta WHERE idEncuesta = ?', [idEncuesta]);
    if (encuesta.length === 0) {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }

    const [preguntas] = await connection.query('SELECT * FROM Pregunta WHERE idEncuesta = ?', [idEncuesta]);

    res.json({
      encuesta: { idEncuesta: encuesta[0].idEncuesta, idUsuario: encuesta[0].idUsuario, preguntas }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// GET /respuestas/pregunta/:idPregunta - Obtener respuesta de pregunta
router.get('/pregunta/:idPregunta', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { idPregunta } = req.params;

    const [pregunta] = await connection.query('SELECT * FROM Pregunta WHERE idPregunta = ?', [idPregunta]);
    if (pregunta.length === 0) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    res.json({ pregunta: pregunta[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
