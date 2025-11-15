const {Router} = require('express');
const { crear, agregarPregunta, obtenerEncuestas, obtenerEncuesta, asignarEncuesta, obtenerEncuestaAsignada } = require('../controllers/encuestas');
const { verifyToken } = require('../middleware/auth');

const router = Router();

router.post('/crear',verifyToken, crear);
router.post('/agregar-pregunta',verifyToken, agregarPregunta);
router.get('/',verifyToken, obtenerEncuestas);
router.post('/obtener',verifyToken, obtenerEncuesta);
router.post('/asignar',verifyToken, asignarEncuesta);
router.post('/obtener-asignada',verifyToken, obtenerEncuestaAsignada);

module.exports = router;