require('dotenv').config();
const express = require('express');
const { PORT } = require('./config/constants');
const sequelize = require('./config/sequelize');

// Importar modelos y sus relaciones
require('./models/index');

// Importar rutas
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const encuestasRoutes = require('./routes/encuestas');
const respuestasRoutes = require('./routes/respuestas');
const firmaciegaRoutes = require('./routes/firmaciega');

const app = express();

// Middleware
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/encuestas', encuestasRoutes);
app.use('/respuestas', respuestasRoutes);
app.use('/firma-ciega', firmaciegaRoutes);

// Endpoint raíz
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Sincronizar Sequelize e iniciar servidor
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor ejecutando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al sincronizar base de datos:', err);
    process.exit(1);
  });
