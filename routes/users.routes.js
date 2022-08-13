// ! Ruta: /api/users

// objeto de rutas
const { Router } = require('express');
// importamos del validator el paquete check para validar request
const { check } = require('express-validator');
// importamos el middleware personalizado
const { validatorUserFields } = require('../middleware/validator-user-fields'); 
const { validatorJWT } = require('../middleware/validator-jwt');

// obtenemos los controladores de cada ruta
const { 
    getListUsers, 
    createUser, 
    updateUser, 
    deleteUser 
} = require('../controllers/users.controller');

// el objeto manager de rutas
const routes = Router();

// Lista de usuario
routes.get('/', validatorJWT, getListUsers );

// Crear un usuario
// agregamos un middleware (personalizado "validatorUserFields") para validar request
routes.post('/', 
    [
        check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
        check( 'password', 'La clave es obligatoria' ).not().isEmpty(),
        check( 'email', 'El email es obligatorio' ).isEmail(),
        validatorUserFields
    ], 
    createUser 
);

// Actualizamos un usuario
// agregamos un middleware (personalizado "validatorUserFields") para validar request
routes.put('/:uid', 
    [
        validatorJWT,
        check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
        check( 'email', 'El email es obligatorio' ).isEmail(),
        check( 'role', 'El rol es obligatorio' ).not().isEmpty(),
        validatorUserFields
    ], 
    updateUser 
);

// Eliminamos un usuario
routes.delete('/:uid', validatorJWT, deleteUser );

module.exports = routes;