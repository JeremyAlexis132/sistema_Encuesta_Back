const express = require('express');
const crypto = require('crypto');
const Usuario = require('../models/Usuario');
const Encuesta = require('../models/Encuesta');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST /firma-ciega/obtener-clave-publica - Obtener clave pública del usuario
router.post('/obtener-clave-publica', verifyToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'usuario') {
      return res.status(403).json({ error: 'Solo usuarios pueden obtener clave pública' });
    }

    const usuario = await Usuario.findByPk(req.user.idUsuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Generar clave pública a partir de privada
    const clavePublica = crypto
      .createHash('sha256')
      .update(usuario.privateKey + 'publica')
      .digest('hex');

    res.json({
      idUsuario: req.user.idUsuario,
      clavePublica
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /firma-ciega/generar-firma - Generar firma ciega
router.post('/generar-firma', verifyToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'usuario') {
      return res.status(403).json({ error: 'Solo usuarios pueden solicitar firmas' });
    }

    const { idEncuesta, mensajeCegado } = req.body;

    if (!idEncuesta || !mensajeCegado) {
      return res.status(400).json({ error: 'Falta idEncuesta o mensajeCegado' });
    }

    const usuario = await Usuario.findByPk(req.user.idUsuario);
    const encuesta = await Encuesta.findByPk(idEncuesta);

    if (!usuario || !encuesta) {
      return res.status(404).json({ error: 'Usuario o encuesta no encontrado' });
    }

    // Firma ciega: combinar clavePrivada + mensajeCegado
    const firmaBlind = crypto
      .createHash('sha256')
      .update(usuario.privateKey + mensajeCegado)
      .digest('hex');

    res.json({
      mensaje: 'Firma ciega generada',
      idEncuesta,
      firmaBlind,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /firma-ciega/verificar-firma - Verificar firma ciega
router.post('/verificar-firma', async (req, res) => {
  try {
    const { idUsuario, mensajeCegado, firmaBlind } = req.body;

    if (!idUsuario || !mensajeCegado || !firmaBlind) {
      return res.status(400).json({ error: 'Falta idUsuario, mensajeCegado o firmaBlind' });
    }

    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar: regenerar firma
    const firmaRecalculada = crypto
      .createHash('sha256')
      .update(usuario.privateKey + mensajeCegado)
      .digest('hex');

    const esValida = firmaRecalculada === firmaBlind;

    res.json({
      esValida,
      mensajeVerificacion: esValida ? 'Firma válida' : 'Firma inválida'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
