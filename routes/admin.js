const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Administrador = require('../models/Administrador');
const Usuario = require('../models/Usuario');
const { JWT_SECRET, BCRYPT_ROUNDS, JWT_EXPIRATION } = require('../config/constants');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST /admin/login - Login de administrador
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Falta username o password' });
    }

    const admin = await Administrador.findOne({ where: { username } });
    
    if (!admin) {
      return res.status(401).json({ error: 'Administrador o contraseña incorrectos' });
    }

    const esValida = await bcrypt.compare(password, admin.password);
    
    if (!esValida) {
      return res.status(401).json({ error: 'Administrador o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { idAdministrador: admin.idAdministrador, username: admin.username, tipo: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({
      token,
      admin: { idAdministrador: admin.idAdministrador, username: admin.username, correo: admin.correo }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/crear-usuario - Crear usuario (solo admin)
router.post('/crear-usuario', verifyToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { numeroCuenta, correo, password } = req.body;

    if (!numeroCuenta || !correo || !password) {
      return res.status(400).json({ error: 'Falta numeroCuenta, correo o password' });
    }

    const existente = await Usuario.findOne({ 
      where: { numeroCuenta } 
    });
    if (existente) {
      return res.status(400).json({ error: 'El número de cuenta ya existe' });
    }

    const privateKey = crypto.randomBytes(32).toString('hex');
    const publicKey = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await Usuario.create({
      numeroCuenta,
      correo,
      password: passwordHash,
      privateKey
    });

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: { numeroCuenta, correo },
      publicKey
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/crear-admin - Crear administrador (solo admin)
router.post('/crear-admin', verifyToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { username, password, correo } = req.body;

    if (!username || !password || !correo) {
      return res.status(400).json({ error: 'Falta username, password o correo' });
    }

    const existente = await Administrador.findOne({ where: { username } });
    if (existente) {
      return res.status(400).json({ error: 'El username ya existe' });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await Administrador.create({
      username,
      password: passwordHash,
      correo
    });

    res.status(201).json({
      mensaje: 'Administrador creado exitosamente',
      admin: { username, correo }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/editar-usuario - Editar usuario (solo admin)
router.post('/editar-usuario', verifyToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { idUsuario, correo, password } = req.body;

    if (!idUsuario) {
      return res.status(400).json({ error: 'idUsuario es requerido' });
    }

    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const actualizaciones = {};
    if (correo) actualizaciones.correo = correo;
    if (password) actualizaciones.password = await bcrypt.hash(password, BCRYPT_ROUNDS);

    if (Object.keys(actualizaciones).length > 0) {
      await usuario.update(actualizaciones);
    }

    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: { idUsuario: usuario.idUsuario, numeroCuenta: usuario.numeroCuenta, correo: usuario.correo }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/editar-admin - Editar administrador (solo admin)
router.post('/editar-admin', verifyToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { idAdministrador, correo, password } = req.body;

    if (!idAdministrador) {
      return res.status(400).json({ error: 'idAdministrador es requerido' });
    }

    const admin = await Administrador.findByPk(idAdministrador);
    if (!admin) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    const actualizaciones = {};
    if (correo) actualizaciones.correo = correo;
    if (password) actualizaciones.password = await bcrypt.hash(password, BCRYPT_ROUNDS);

    if (Object.keys(actualizaciones).length > 0) {
      await admin.update(actualizaciones);
    }

    res.json({
      mensaje: 'Administrador actualizado exitosamente',
      admin: { idAdministrador: admin.idAdministrador, username: admin.username, correo: admin.correo }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /admin/usuarios - Obtener usuarios (solo admin)
router.get('/usuarios', verifyToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const usuarios = await Usuario.findAll({
      attributes: ['idUsuario', 'numeroCuenta', 'correo']
    });

    res.json({ usuarios });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /admin/administradores - Obtener administradores (solo admin)
router.get('/administradores', verifyToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const administradores = await Administrador.findAll({
      attributes: ['idAdministrador', 'username', 'correo']
    });

    res.json({ administradores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
