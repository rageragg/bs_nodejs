// Ruta: /api/upload/images/:model/:id

// objeto de rutas
const { Router } = require('express');
const fileUpload = require('express-fileupload');

// importamos el middleware personalizado
const { validatorJWT } = require('../middleware/validator-jwt');

// obtenemos los controladores de cada ruta
const { putUploadImages, getImages } = require('../controllers/uploads.controller');

// el objeto manager de rutas
const routes = Router();

// aplicamos el middleware de cargar archivo
routes.use(fileUpload());

// cargar y obtener imagenes
routes.put('/images/:model/:id', [validatorJWT], putUploadImages );
routes.get('/images/:model/:img', getImages );

module.exports = routes;