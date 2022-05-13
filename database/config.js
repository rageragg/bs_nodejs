const mongoose = require('mongoose');

// MongoDB: rageragg:beYlrlrFLLfEFF18
// Cadena de Conexion: mongodb+srv://rageragg:beYlrlrFLLfEFF18@cluster0.56mki.mongodb.net/test
const DB_CNN = process.env.DB_CNN;

// funcion de conexion a la BD
const dbConnection = async() => {

    try {
        await mongoose.connect(DB_CNN);
        console.info('Base de Datos en linea..!');
    } catch (error) {
        console.warn(error);
        throw Error('Error al Intentar Conectar a la Base de Datos!');
    }

}

module.exports = {
    dbConnection
}