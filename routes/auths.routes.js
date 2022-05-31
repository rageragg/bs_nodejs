// Ruta: /api/login

// objeto de rutas
const { Router } = require('express');
// importamos del validator el paquete check para validar request
const { check } = require('express-validator');
// importamos el middleware personalizado
const { validatorUserFields } = require('../middleware/validator-user-fields'); 
// el objeto manager de rutas
const routes = Router();

// importamos el controlador
const { loginAuth } = require('../controllers/auths.controller');

// login
// agregamos un middleware (personalizado "validatorUserFields") para validar request
routes.post('/', 
    [
        check( 'email', 'El email es obligatorio' ).isEmail(),
        check( 'password', 'La clave es obligatoria' ).not().isEmpty(),
        validatorUserFields
    ], 
    loginAuth
);

module.exports = routes;