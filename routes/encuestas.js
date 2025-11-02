const express = require('express');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST /encuestas/crear - Crear encuesta (solo admin)
router.post('/crear', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden crear encuestas' });
    }

    const { idUsuario } = req.body;

    if (!idUsuario) {
      return res.status(400).json({ error: 'Falta idUsuario' });
    }

    const [usuario] = await connection.query('SELECT * FROM Usuario WHERE idUsuario = ?', [idUsuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const [result] = await connection.query('INSERT INTO Encuesta (idUsuario) VALUES (?)', [idUsuario]);

    res.status(201).json({
      mensaje: 'Encuesta creada',
      encuesta: { idEncuesta: result.insertId, idUsuario }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// POST /encuestas/:id/preguntas - Agregar pregunta (solo admin)
router.post('/:id/preguntas', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden crear preguntas' });
    }

    const { id } = req.params;
    const { pregunta } = req.body;

    if (!pregunta) {
      return res.status(400).json({ error: 'Falta pregunta' });
    }

    const [encuesta] = await connection.query('SELECT * FROM Encuesta WHERE idEncuesta = ?', [id]);
    if (encuesta.length === 0) {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }

    const [result] = await connection.query('INSERT INTO Pregunta (idEncuesta, pregunta) VALUES (?, ?)', [id, pregunta]);

    res.status(201).json({
      mensaje: 'Pregunta añadida',
      pregunta: { idPregunta: result.insertId, idEncuesta: id, pregunta }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// GET /encuestas - Obtener todas las encuestas
router.get('/', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [encuestas] = await connection.query('SELECT * FROM Encuesta');
    const [preguntas] = await connection.query('SELECT * FROM Pregunta');

    const resultado = encuestas.map(e => ({
      ...e,
      preguntas: preguntas.filter(p => p.idEncuesta === e.idEncuesta)
    }));

    res.json({ encuestas: resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// GET /encuestas/:id - Obtener encuesta específica
router.get('/:id', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;

    const [encuesta] = await connection.query('SELECT * FROM Encuesta WHERE idEncuesta = ?', [id]);
    if (encuesta.length === 0) {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }

    const [preguntas] = await connection.query('SELECT * FROM Pregunta WHERE idEncuesta = ?', [id]);

    res.json({
      encuesta: { ...encuesta[0], preguntas }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
