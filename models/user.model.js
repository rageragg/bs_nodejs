const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Creamos el schema de datos para el modelo user
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }
}, 
{
    collection: 'users'
});

// sobrecargamos el metodo toJSON para personalizarlo
userSchema.method('toJSON', function() {
    // extraemos las propiedades que no queremos mostrar
    const { __v, _id, password, ...object } = this.toObject();
    // transformamos el _id por uid para visualizarlos mejor
    object.uid = _id;
    return object;
});

// Exportamos el modelo
module.exports = model('User', userSchema );