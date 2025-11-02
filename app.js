require('dotenv').config();
const express = require('express');
const { PORT } = require('./config/constants');

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutando en http://localhost:${PORT}`);
});
