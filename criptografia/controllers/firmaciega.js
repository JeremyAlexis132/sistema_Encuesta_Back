const crypto = require('crypto');
const { Usuario, Encuesta } = require('../models');

// POST /firma-ciega/obtener-clave-publica - Obtener clave pública del usuario
const obtenerClavePublica = async (req, res) => {
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
};

// POST /firma-ciega/generar-firma - Generar firma ciega
const generarFirma = async (req, res) => {
  try {
    if (req.user.tipo !== 'usuario') {
      return res.status(403).json({ error: 'Solo usuarios pueden solicitar firmas' });
    }

    const { publicKey, data } = req.body;

    if (!publicKey || !data) {
      return res.status(400).json({ error: 'Falta publicKey o data (respuestas)' });
    }

    const usuario = await Usuario.findByPk(req.user.idUsuario);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear el mensaje a firmar: combinar publicKey + datos
    const mensaje = publicKey + JSON.stringify(data);
    
    // Firmar con RSA usando la clave privada del usuario
    const sign = crypto.createSign('SHA256');
    sign.update(mensaje);
    sign.end();
    const firmaBlind = sign.sign(usuario.privateKey, 'base64');

    res.json({
      mensaje: 'Firma ciega generada exitosamente',
      firma: firmaBlind,
      publicKey,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /firma-ciega/verificar-firma - Verificar firma ciega
const verificarFirma = async (req, res) => {
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
};

module.exports = {
  obtenerClavePublica,
  generarFirma,
  verificarFirma
};