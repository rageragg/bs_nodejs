// Ruta: /api/hospitals

// objeto de rutas
const { Router } = require('express');
// importamos del validator el paquete check para validar request
const { check } = require('express-validator');
// importamos el middleware personalizado
const { validatorUserFields } = require('../middleware/validator-user-fields'); 
const { validatorJWT } = require('../middleware/validator-jwt');

// obtenemos los controladores de cada ruta
const { 
    getListHospitals, 
    createHospital, 
    updateHospital, 
    deleteHospital 
} = require('../controllers/hospitals.controller');

// el objeto manager de rutas
const routes = Router();

// Lista de hospitales
routes.get('/', 
    [
        validatorJWT
    ], getListHospitals 
);

// Crear un hospital
routes.post('/', 
    [
        validatorJWT,
        check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
        validatorUserFields
    ], 
    createHospital 
);

// Actualizamos un hospital
routes.put('/:uid', 
    [
        validatorJWT,
        check( 'name', 'El nombre es obligatorio' ).not().isEmpty()
    ], 
    updateHospital 
);

// Eliminamos un hospital
routes.delete('/:uid', validatorJWT, deleteHospital );


module.exports = routes;