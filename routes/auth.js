const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Usuario } = require('../models');
const { JWT_SECRET, BCRYPT_ROUNDS, JWT_EXPIRATION } = require('../config/constants');

const router = express.Router();

// POST /auth/registro - Registro de usuario
router.post('/registro', async (req, res) => {
  try {
    const { numeroCuenta, correo, password } = req.body;

    if (!numeroCuenta || !correo || !password) {
      return res.status(400).json({ error: 'Falta numeroCuenta, correo o password' });
    }

    // Verificar duplicidad
    const existente = await Usuario.findOne({
      where: { numeroCuenta }
    });
    if (existente) {
      return res.status(400).json({ error: 'El número de cuenta ya existe' });
    }

    const existenteCorrco = await Usuario.findOne({
      where: { correo }
    });
    if (existenteCorrco) {
      return res.status(400).json({ error: 'El correo ya existe' });
    }

    // Generar claves
    const privateKey = crypto.randomBytes(32).toString('hex');
    const publicKey = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Guardar usuario
    await Usuario.create({
      numeroCuenta,
      correo,
      password: passwordHash,
      privateKey
    });

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: { numeroCuenta, correo },
      publicKey
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /auth/login - Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { numeroCuenta, password } = req.body;

    if (!numeroCuenta || !password) {
      return res.status(400).json({ error: 'Falta numeroCuenta o password' });
    }

    const usuario = await Usuario.findOne({ where: { numeroCuenta } });
    
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    
    if (!esValida) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { idUsuario: usuario.idUsuario, numeroCuenta: usuario.numeroCuenta, tipo: 'usuario' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({
      token,
      usuario: { idUsuario: usuario.idUsuario, numeroCuenta: usuario.numeroCuenta, correo: usuario.correo }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
