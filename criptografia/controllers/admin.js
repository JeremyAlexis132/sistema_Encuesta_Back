const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { Administrador, Usuario } = require('../models');

// Configuración de rounds para bcrypt: convertir la variable de entorno a número
const DEFAULT_BCRYPT_ROUNDS = 10;
const _envRounds = Number.parseInt(process.env.BCRYPT_ROUNDS, 10);
const BCRYPT_ROUNDS = Number.isInteger(_envRounds) ? _envRounds : DEFAULT_BCRYPT_ROUNDS;

// POST /admin/login - Login de administrador
const login  = async (req, res) => {
  console.log('Login admin request body:', req.body);
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
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({
      token,
      admin: { idAdministrador: admin.idAdministrador, username: admin.username, correo: admin.correo }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /admin/crear-usuario - Crear usuario (solo admin)
const crearUsuario = async (req, res) => {
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
    
    // Generar par de claves RSA (privateKey y publicKey están matemáticamente relacionadas)
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    
    const usuario = await Usuario.create({
      numeroCuenta,
      correo,
      password: passwordHash,
      privateKey  // Guardar la clave privada en formato PEM
    });
    
    // Crear directorio para claves públicas si no existe
    const keysDir = path.join(__dirname, '../../public/keys');
    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir, { recursive: true });
    }
    
    // Generar nombre único para el archivo de clave pública
    const filename = `publickey_${usuario.idUsuario}_${numeroCuenta}.pem`;
    const filePath = path.join(keysDir, filename);
    
    // Guardar clave pública en archivo
    fs.writeFileSync(filePath, publicKey);
    
    // URL para descargar la clave pública
    const publicKeyUrl = `/keys/${filename}`;
    
    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: { numeroCuenta, correo },
      publicKeyUrl,  // URL para descargar el archivo
      publicKeyFile: filename  // Nombre del archivo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /admin/crear-admin - Crear administrador (solo admin)
const crearAdmin = async (req, res) => {
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
};

// POST /admin/editar-usuario - Editar usuario (solo admin)
const editarUsuario = async (req, res) => {
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
};

// POST /admin/editar-admin - Editar administrador (solo admin)
const editarAdmin = async (req, res) => {
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
};

// GET /admin/usuarios - Obtener usuarios (solo admin)
const usuarios = async (req, res) => {
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
};

// GET /admin/administradores - Obtener administradores (solo admin)
const administradores = async (req, res) => {
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
};

module.exports = {
  login,
  crearUsuario,
  crearAdmin,
  editarUsuario,
  editarAdmin,
  usuarios,
  administradores
};