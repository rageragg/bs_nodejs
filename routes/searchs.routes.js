// Ruta: /api/search

// objeto de rutas
const { Router } = require('express');
// importamos el middleware personalizado
const { validatorJWT } = require('../middleware/validator-jwt');

// obtenemos los controladores de cada ruta
const { getSearch } = require('../controllers/searchs.controller');

// el objeto manager de rutas
const routes = Router();

// busqueda
routes.get('/', validatorJWT, getSearch );

module.exports = routes;