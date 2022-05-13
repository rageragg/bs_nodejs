// importamos la libreria express
const express = require('express');

// CORS
const cors = require('cors');

// leemos la variables de entorno de los archivos .env
require('dotenv').config();

// importamos la funcion de conecion a la base de datos Mongo DB en la nube
const { dbConnection } = require('./database/config');

// constante del pruerto del servidor
const portListen = process.env.PORT;

// se crea la instancia del servidor
const app = express();

// configuramos CORS, (use Middleware )
app.use( cors() );

// hacemos la conexion a la BD
dbConnection();

// rutas
app.get('/', ( req, res) => {
    res.json({
        ok: true,
        msg:"Hola Mundo!"
    });
});

// iniciamos el servido
app.listen( portListen, () => {
    console.info('Servidor Inicializado en el puerto: ' + portListen );
});
