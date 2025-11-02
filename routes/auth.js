const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pool = require('../config/database');
const { JWT_SECRET, BCRYPT_ROUNDS, JWT_EXPIRATION } = require('../config/constants');

const router = express.Router();

// POST /auth/registro - Registro de usuario
router.post('/registro', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { numeroCuenta, correo, password } = req.body;

    if (!numeroCuenta || !correo || !password) {
      return res.status(400).json({ error: 'Falta numeroCuenta, correo o password' });
    }

    // Verificar duplicidad
    const [existente] = await connection.query('SELECT * FROM Usuario WHERE numeroCuenta = ? OR correo = ?', [numeroCuenta, correo]);
    if (existente.length > 0) {
      return res.status(400).json({ error: 'El número de cuenta o correo ya existe' });
    }

    // Generar claves
    const privateKey = crypto.randomBytes(32).toString('hex');
    const publicKey = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Guardar usuario
    await connection.query(
      'INSERT INTO Usuario (numeroCuenta, correo, password, privateKey) VALUES (?, ?, ?, ?)',
      [numeroCuenta, correo, passwordHash, privateKey]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: { numeroCuenta, correo },
      publicKey
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// POST /auth/login - Login de usuario
router.post('/login', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { numeroCuenta, password } = req.body;

    if (!numeroCuenta || !password) {
      return res.status(400).json({ error: 'Falta numeroCuenta o password' });
    }

    const [usuarios] = await connection.query('SELECT * FROM Usuario WHERE numeroCuenta = ?', [numeroCuenta]);
    
    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const usuario = usuarios[0];
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
  } finally {
    connection.release();
  }
});

module.exports = router;
