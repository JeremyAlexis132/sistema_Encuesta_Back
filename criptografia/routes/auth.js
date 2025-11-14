const {Router} = require('express');
const { login, registro } = require('../controllers/auth');

const router = Router();

router.post('/login',login);
router.post('/registro', registro);

module.exports = router;