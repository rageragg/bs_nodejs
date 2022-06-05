const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Creamos el schema de datos para el modelo Doctor
const doctorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    hospital: { 
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: new Date()
    }
},
{
    collection: 'doctors'
});

// sobrecargamos el metodo toJSON para personalizarlo
doctorSchema.method('toJSON', function() {
    // extraemos las propiedades que no queremos mostrar
    const { __v, _id, ...object } = this.toObject();
    // transformamos el _id por uid para visualizarlos mejor
    object.uid = _id;
    return object;
});

// Exportamos el modelo
module.exports = model('Doctor', doctorSchema );