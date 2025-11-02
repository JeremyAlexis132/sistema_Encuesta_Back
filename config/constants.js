module.exports = {
  PORT: process.env.PORT || 3002,
  JWT_SECRET: process.env.SECRET_KEY || 'secret_key_default',
  BCRYPT_ROUNDS: 10,
  JWT_EXPIRATION: '24h'
};
