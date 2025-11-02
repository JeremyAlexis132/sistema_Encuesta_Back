const express = require('express');
const crypto = require('crypto');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST /firma-ciega/obtener-clave-publica - Obtener clave pública del usuario
router.post('/obtener-clave-publica', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    if (req.user.tipo !== 'usuario') {
      return res.status(403).json({ error: 'Solo usuarios pueden obtener clave pública' });
    }

    const [usuario] = await connection.query('SELECT privateKey FROM Usuario WHERE idUsuario = ?', [req.user.idUsuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Generar clave pública a partir de privada
    const clavePublica = crypto
      .createHash('sha256')
      .update(usuario[0].privateKey + 'publica')
      .digest('hex');

    res.json({
      idUsuario: req.user.idUsuario,
      clavePublica
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// POST /firma-ciega/generar-firma - Generar firma ciega
router.post('/generar-firma', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    if (req.user.tipo !== 'usuario') {
      return res.status(403).json({ error: 'Solo usuarios pueden solicitar firmas' });
    }

    const { idEncuesta, mensajeCegado } = req.body;

    if (!idEncuesta || !mensajeCegado) {
      return res.status(400).json({ error: 'Falta idEncuesta o mensajeCegado' });
    }

    const [usuario] = await connection.query('SELECT privateKey FROM Usuario WHERE idUsuario = ?', [req.user.idUsuario]);
    const [encuesta] = await connection.query('SELECT * FROM Encuesta WHERE idEncuesta = ?', [idEncuesta]);

    if (usuario.length === 0 || encuesta.length === 0) {
      return res.status(404).json({ error: 'Usuario o encuesta no encontrado' });
    }

    // Firma ciega: combinar clavePrivada + mensajeCegado
    const firmaBlind = crypto
      .createHash('sha256')
      .update(usuario[0].privateKey + mensajeCegado)
      .digest('hex');

    res.json({
      mensaje: 'Firma ciega generada',
      idEncuesta,
      firmaBlind,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// POST /firma-ciega/verificar-firma - Verificar firma ciega
router.post('/verificar-firma', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { idUsuario, mensajeCegado, firmaBlind } = req.body;

    if (!idUsuario || !mensajeCegado || !firmaBlind) {
      return res.status(400).json({ error: 'Falta idUsuario, mensajeCegado o firmaBlind' });
    }

    const [usuario] = await connection.query('SELECT privateKey FROM Usuario WHERE idUsuario = ?', [idUsuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar: regenerar firma
    const firmaRecalculada = crypto
      .createHash('sha256')
      .update(usuario[0].privateKey + mensajeCegado)
      .digest('hex');

    const esValida = firmaRecalculada === firmaBlind;

    res.json({
      esValida,
      mensajeVerificacion: esValida ? 'Firma válida' : 'Firma inválida'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
