const jwt = require('jsonwebtoken');

const generarJWT = (data, secretePrivateKey) => {
  return new Promise((resolve, reject) => {
    const payload = data;

    jwt.sign(payload, secretePrivateKey, {
      expiresIn: '24h'
    }, (err, token) => {
      if (err) {
        reject('No se pudo generar el token');
      }else{
        resolve(token);
      }
    });
  })
}

module.exports = {
  generarJWT,
}