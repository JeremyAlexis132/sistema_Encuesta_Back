const {Router} = require('express');
const { /*obtenerClavePublica,*/ generarFirma,/* verificarFirma*/ } = require('../controllers/firmaciega');
const { verifyToken } = require('../middleware/auth');

const router = Router();

// router.post('/obtener-clave-publica',verifyToken, obtenerClavePublica);
router.post('/generar-firma',verifyToken, generarFirma);
// router.post('/verificar-firma', verificarFirma);

module.exports = router;