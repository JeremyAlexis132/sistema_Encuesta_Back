const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pool = require('../config/database');
const { JWT_SECRET, BCRYPT_ROUNDS, JWT_EXPIRATION } = require('../config/constants');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST /admin/login - Login de administrador
router.post('/login', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Falta username o password' });
    }

    const [admins] = await connection.query('SELECT * FROM Administrador WHERE username = ?', [username]);
    
    if (admins.length === 0) {
      return res.status(401).json({ error: 'Administrador o contraseña incorrectos' });
    }

    const admin = admins[0];
    const esValida = await bcrypt.compare(password, admin.password);
    
    if (!esValida) {
      return res.status(401).json({ error: 'Administrador o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { idAministrador: admin.idAministrador, username: admin.username, tipo: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({
      token,
      admin: { idAministrador: admin.idAministrador, username: admin.username, correo: admin.correo }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// POST /admin/crear-usuario - Crear usuario (solo admin)
router.post('/crear-usuario', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { numeroCuenta, correo, password } = req.body;

    if (!numeroCuenta || !correo || !password) {
      return res.status(400).json({ error: 'Falta numeroCuenta, correo o password' });
    }

    const [existente] = await connection.query('SELECT * FROM Usuario WHERE numeroCuenta = ? OR correo = ?', [numeroCuenta, correo]);
    if (existente.length > 0) {
      return res.status(400).json({ error: 'El número de cuenta o correo ya existe' });
    }

    const privateKey = crypto.randomBytes(32).toString('hex');
    const publicKey = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await connection.query(
      'INSERT INTO Usuario (numeroCuenta, correo, password, privateKey) VALUES (?, ?, ?, ?)',
      [numeroCuenta, correo, passwordHash, privateKey]
    );

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: { numeroCuenta, correo },
      publicKey
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// POST /admin/crear-admin - Crear administrador (solo admin)
router.post('/crear-admin', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { username, password, correo } = req.body;

    if (!username || !password || !correo) {
      return res.status(400).json({ error: 'Falta username, password o correo' });
    }

    const [existente] = await connection.query('SELECT * FROM Administrador WHERE username = ?', [username]);
    if (existente.length > 0) {
      return res.status(400).json({ error: 'El username ya existe' });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await connection.query(
      'INSERT INTO Administrador (username, password, correo) VALUES (?, ?, ?)',
      [username, passwordHash, correo]
    );

    res.status(201).json({
      mensaje: 'Administrador creado exitosamente',
      admin: { username, correo }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// POST /admin/editar-usuario - Editar usuario (solo admin)
router.post('/editar-usuario', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { idUsuario, correo, password } = req.body;

    const [usuario] = await connection.query('SELECT * FROM Usuario WHERE idUsuario = ?', [idUsuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (correo || password) {
      let query = 'UPDATE Usuario SET ';
      let params = [];

      if (correo) {
        query += 'correo = ?';
        params.push(correo);
      }

      if (password) {
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        if (correo) query += ', ';
        query += 'password = ?';
        params.push(passwordHash);
      }

      query += ' WHERE idUsuario = ?';
      params.push(idUsuario);

      await connection.query(query, params);
    }

    res.json({ mensaje: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// POST /admin/editar-admin - Editar administrador (solo admin)
router.post('/editar-admin', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { idAministrador, correo, password } = req.body;

    const [admin] = await connection.query('SELECT * FROM Administrador WHERE idAministrador = ?', [idAministrador]);
    if (admin.length === 0) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    if (correo || password) {
      let query = 'UPDATE Administrador SET ';
      let params = [];

      if (correo) {
        query += 'correo = ?';
        params.push(correo);
      }

      if (password) {
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        if (correo) query += ', ';
        query += 'password = ?';
        params.push(passwordHash);
      }

      query += ' WHERE idAministrador = ?';
      params.push(idAministrador);

      await connection.query(query, params);
    }

    res.json({ mensaje: 'Administrador actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// GET /admin/usuarios - Obtener usuarios (solo admin)
router.get('/usuarios', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const [usuarios] = await connection.query('SELECT idUsuario, numeroCuenta, correo FROM Usuario');

    res.json({ usuarios });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// GET /admin/administradores - Obtener administradores (solo admin)
router.get('/administradores', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const [administradores] = await connection.query('SELECT idAministrador, username, correo FROM Administrador');

    res.json({ administradores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
