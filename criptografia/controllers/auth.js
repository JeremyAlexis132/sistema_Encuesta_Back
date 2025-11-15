const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Usuario } = require('../models');
const fs = require('fs');
const path = require('path');

const DEFAULT_BCRYPT_ROUNDS = 10;
const _envRounds = Number.parseInt(process.env.BCRYPT_ROUNDS, 10);
const BCRYPT_ROUNDS = Number.isInteger(_envRounds) ? _envRounds : DEFAULT_BCRYPT_ROUNDS;

// POST /auth/registro - Registro de usuario
const registro = async (req, res) => {
  try {
    const { numeroCuenta, correo, password } = req.body;
    
    if (!numeroCuenta || !correo || !password) {
      console.log('Falta numeroCuenta, correo o password');
      return res.status(400).json({ error: 'Falta numeroCuenta, correo o password' });
    }

    const existente = await Usuario.findOne({ 
      where: { numeroCuenta } 
    });
    if (existente) {
      console.log('El número de cuenta ya existe');
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
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// POST /auth/login - Login de usuario
const login = async (req, res) => {
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
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({
      token,
      usuario: { idUsuario: usuario.idUsuario, numeroCuenta: usuario.numeroCuenta, correo: usuario.correo }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  login,
  registro
};