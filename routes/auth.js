const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {check} = require('express-validator')

const authController = require('../controllers/authController')

//crea  usuario
//api/auth

router.post('/', 
    authController.autenticarUsuario
);
router.get('/',
    auth,
    authController.usuarioAutenticado
)

module.exports = router;