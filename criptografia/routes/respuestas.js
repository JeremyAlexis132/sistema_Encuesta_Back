const {Router} = require('express');
const { crearRespuesta, obtenerEncuesta, /*obtenerPregunta*/ } = require('../controllers/respuestas');
const { verifyToken } = require('../middleware/auth');

const router = Router();

router.post('/',verifyToken, crearRespuesta);
router.post('/obtener-encuesta',verifyToken, obtenerEncuesta);
// router.post('/obtener-pregunta',verifyToken, obtenerPregunta);

module.exports = router;