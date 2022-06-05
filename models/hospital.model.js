const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Creamos el schema de datos para el modelo Hospital
const hospitalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    collection: 'hospitals'
});

// sobrecargamos el metodo toJSON para personalizarlo
hospitalSchema.method('toJSON', function() {
    // extraemos las propiedades que no queremos mostrar
    const { __v, _id, ...object } = this.toObject();
    // transformamos el _id por uid para visualizarlos mejor
    object.uid = _id;
    return object;
});

// Exportamos el modelo
module.exports = model('Hospital', hospitalSchema );