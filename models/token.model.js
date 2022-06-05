const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Creamos el schema de datos para el modelo tokens
const tokenSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: new Date()
    }
},
{
    collection: 'tokens'
});

// sobrecargamos el metodo toJSON para personalizarlo
tokenSchema.method('toJSON', function() {
    // extraemos las propiedades que no queremos mostrar
    const { __v, _id, ...object } = this.toObject();
    // transformamos el _id por uid para visualizarlos mejor
    object.uid = _id;
    return object;
});

// Exportamos el modelo
module.exports = model('Token', tokenSchema );