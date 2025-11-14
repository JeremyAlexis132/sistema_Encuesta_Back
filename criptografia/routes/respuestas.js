const {Router} = require('express');
const { obtenerRespuestas, obtenerEncuesta, obtenerPregunta } = require('../controllers/respuestas');
const { verifyToken } = require('../middleware/auth');

const router = Router();

router.post('/',verifyToken, obtenerRespuestas);
router.post('/obtener-encuesta',verifyToken, obtenerEncuesta);
router.post('/obtener-pregunta',verifyToken, obtenerPregunta);

module.exports = router;