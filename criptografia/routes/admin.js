const {Router} = require('express');
const { verifyToken } = require('../middleware/auth');
const { login, crearUsuario, crearAdmin, editarAdmin, editarUsuario, usuarios, administradores} = require('../controllers/admin');

const router = Router();

router.post('/login',login);
router.post('/crear-usuario',verifyToken, crearUsuario);
router.post('/crear-admin',verifyToken, crearAdmin);
router.post('/editar-usuario',verifyToken, editarUsuario);
router.post('/editar-admin',verifyToken, editarAdmin);
router.get('/usuarios',verifyToken, usuarios);
router.get('/administradores',verifyToken, administradores);

module.exports = router;