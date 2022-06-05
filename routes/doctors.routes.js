// Ruta: /api/doctors

// objeto de rutas
const { Router } = require('express');
// importamos del validator el paquete check para validar request
const { check } = require('express-validator');
// importamos el middleware personalizado
const { validatorUserFields } = require('../middleware/validator-user-fields'); 
const { validatorJWT } = require('../middleware/validator-jwt');

// obtenemos los controladores de cada ruta
const { 
    getListDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
} = require('../controllers/doctors.controller');

// el objeto manager de rutas
const routes = Router();

// Lista de doctores
routes.get('/', 
    [
        validatorJWT
    ], getListDoctors 
);

// Crear un doctor
routes.post('/', 
    [
        validatorJWT,
        check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
        check( 'hospital', 'El id del hospital debe ser valido' ).isMongoId(),
        validatorUserFields
    ], 
    createDoctor 
);

// Actualizamos un doctor
routes.put('/:uid', 
    [
        validatorJWT,
        check( 'name', 'El nombre es obligatorio' ).not().isEmpty()
    ], 
    updateDoctor 
);

// Eliminamos un doctor
routes.delete('/:uid', validatorJWT, deleteDoctor );


module.exports = routes;