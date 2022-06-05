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

// (use Middlewares )
// configuramos CORS, 
app.use( cors() );
// lectura y parseo del body de cada peticion
app.use( express.json() ); 

// hacemos la conexion a la BD
dbConnection();

// establecemos las RUTAS
// Auth
app.use('/api/login', require('./routes/auths.routes'));
// usuarios CRUD
app.use('/api/users', require('./routes/users.routes'));
// hospitales CRUD
app.use('/api/hospitals', require('./routes/hospitals.routes'));
// doctores CRUD
app.use('/api/doctors', require('./routes/doctors.routes'));
// busqueda 
app.use('/api/search', require('./routes/searchs.routes'));
// upload
app.use('/api/upload', require('./routes/uploads.routes'));

// iniciamos el servido
app.listen( portListen, () => {
    console.info('Servidor Inicializado en el puerto: ' + portListen );
});
