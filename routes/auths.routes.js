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
const { loginAuth, renewToken, validateToken } = require('../controllers/auths.controller');
const { validatorJWT } = require('../middleware/validator-jwt');

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

routes.get('/renew', 
    [
        validatorJWT
    ],
    renewToken
);

routes.get('/validate', 
    [
        validatorJWT
    ],
    validateToken
);

module.exports = routes;