// importamos el objeto response de expresa para ayudar a autocompletar
const { request, response } = require('express');

// importamos el modelo de doctor y de hospita
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');

const getListDoctors = async( req = request, res = response ) => {

    const doctors = await Doctor.find()
                                .populate('hospital', 'name')
                                .populate('user', 'name');

    res.json(
        {
            ok: true,
            msg: 'Lista de Doctores',
            hospitals: doctors
        }
    );
}

// el objeto res = response, es el establecimiento del valor por defecto
const createDoctor = async( req, res = response ) => {

    // obtenemos el cuerpo de la peticion
    const { name, hospital  } = req.body;
    const credentials = req.credentials;

    // inicio de validaciones
    try {

        // verificamos si existe el name en la BD
        const existName = await Doctor.findOne({ name });
        if( existName ) {
            return res.status(400).json({
                ok: false,
                msg: 'El Nombre ya esta resgistadro!'
            });
        }

        // comprobamos que el hospital exista
        const existHospital = await Hospital.findById(hospital);
        if( !existHospital ) {
            return res.status(400).json({
                ok: false,
                msg: 'El hospital NO esta resgistadro!'
            });
        }
        
        // creamos el modelo Doctor
        const doctor = new Doctor( { user: credentials.uid, ...req.body } );
        // salvamos los datos en la coleccion
        await doctor.save();

        // realizamos la respuesta
        res.status(200).json(
            {
                ok: true,
                msg: 'Doctor Creado!',
                doctor: doctor
            }
        );

    } catch (error) {
        console.warn(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!'
        });
        
    }
}

const updateDoctor = async( req = request, res = response ) => {

    //
    // obtenemos el parametro
    const uid = req.params.uid;
    const credentials = req.credentials;

    try {

        // verificamos si existe el uid en la BD
        const existDoctor = await Doctor.findById(uid);
        if( !existDoctor ) {
            return res.status(400).json({
                ok: false,
                msg: 'El Doctor NO esta resgistadro!'
            });
        }

        // obtenemos los campos de la peticion
        // quitamos propiedades que no deben ser modificadas
        const fields = {
         ...req.body,
         user: credentials.uid
        }

        // verificamos si existe el uid del hospital en la BD
        const existHospital = await Hospital.findById(fields.hospital);
        if( !existHospital ) {
            return res.status(400).json({
                ok: false,
                msg: 'El hospital NO esta resgistadro!'
            });
        }

        // validamos si el nombre es correcto para actualizar
        if( existDoctor.name !== fields.name ) {
            // verificamos si existe el email en la BD
            const existDoctor = await Hospital.findOne({ name: fields.name });
            if( existDoctor ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El Nombre ya esta resgistadro!'
                });
            }

        }
        // actualizamos los datos en la BD
        const doctorUpdated = await Doctor.findByIdAndUpdate( uid, 
            { 
                name: fields.name,
                hospital: fields.hospital, 
                user: credentials.uid 
            }, 
            { new: true } 
        );

        res.status(200).json(
            {
                ok: true,
                msg: 'Doctor Actualizado!',
                doctor: doctorUpdated
            }
        )
        
    } catch (error) {
        console.warn(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!'
        });
    }
}

const deleteDoctor = async( req = request, res = response ) => {

    try {
        // obtenemos el parametro
        const uid = req.params.uid;
        // verificamos si existe el uid en la BD
        const existDoctor = await Doctor.findById(uid);
        // validamos que exista
        if( !existDoctor ) {
            return res.status(400).json({
                ok: false,
                msg: 'Doctor No existe'
            });
        }
        
        // actualizamos los datos en la BD
        const doctorDeleted = await Doctor.findByIdAndDelete( uid );

        res.status(200).json({
            ok: true,
            msg: 'Doctor Eliminado',
            hospital: doctorDeleted
        });

    } catch (error) {
        console.warn(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!'
        });
    }

}

module.exports = {
    getListDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
}