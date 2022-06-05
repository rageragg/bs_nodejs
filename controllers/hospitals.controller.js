// importamos el objeto response de expresa para ayudar a autocompletar
const { request, response } = require('express');

// importamos el modelo de hospital
const Hospital = require('../models/hospital.model');

const getListHospitals = async( req = request, res = response ) => {

    // tomamos la parte del query del URL 
    const frm = Number(req.query?.frm) || 0; // host:3000/api/hospitals?frm=3
    const lmt = Number(req.query?.lmt) || 5; // host:3000/api/hospitals?lmt=10

    // optimizar la respuesta
    const [ hospitales, counts ] = 
            await Promise.all([
                Hospital.find()
                        .skip(frm)
                        .limit(lmt)
                        .populate('user', 'name'),
                Hospital.count()        
            ]);                              

    res.json(
        {
            ok: true,
            msg: 'Lista de Hospitales',
            hospitals: hospitales,
            counts: counts 
        }
    );
}

// el objeto res = response, es el establecimiento del valor por defecto
const createHospital = async( req, res = response ) => {

    // obtenemos el cuerpo de la peticion
    const { name  } = req.body;
    const credentials = req.credentials;
    
    // inicio de validaciones
    try {

        // verificamos si existe el name en la BD
        const existName = await Hospital.findOne({ name });
        if( existName ) {
            return res.status(400).json({
                ok: false,
                msg: 'El Nombre ya esta resgistadro!'
            });
        }
        
        // creamos el modelo Hospital
        const hospital = new Hospital( { user: credentials.uid, ...req.body } );
        // salvamos los datos en la coleccion
        await hospital.save();

        // realizamos la respuesta
        res.status(200).json(
            {
                ok: true,
                msg: 'Hospital Creado!',
                hospital: hospital
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

const updateHospital = async( req = request, res = response ) => {

    try {
        // obtenemos el parametro
        const uid = req.params.uid;
        // verificamos si existe el uid en la BD
        const existHospital = await Hospital.findById(uid);
        if( !existHospital ) {
            return res.status(400).json({
                ok: false,
                msg: 'El hospital NO esta resgistadro!'
            });
        }

        // obtenemos los campos de la peticion
        // quitamos propiedades que no deben ser modificadas
        const { fields } = req.body;

        // validamos si el email es correcto para actualizar
        if( existHospital.name !== fields.name ) {
            // verificamos si existe el email en la BD
            const existHospital = await Hospital.findOne({ name: fields.name  });
            if( existHospital ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El Nombre ya esta resgistadro!'
                });
            }

        }
        
        fields.name = fields.name;

        // actualizamos los datos en la BD
        const hospitalUpdated = await Hospital.findByIdAndUpdate( uid, fields, { new: true } );

        res.status(200).json(
            {
                ok: true,
                msg: 'Hospital Actualizado!',
                hospital: hospitalUpdated
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

const deleteHospital = async( req = request, res = response ) => {

    try {
        // obtenemos el parametro
        const uid = req.params.uid;
        // verificamos si existe el uid en la BD
        const existHospital = await Hospital.findById(uid);
        // validamos que exista
        if( !existHospital ) {
            return res.status(400).json({
                ok: false,
                msg: 'Hospital No existe'
            });
        }

        // actualizamos los datos en la BD
        const hospitalDeleted = await Hospital.findByIdAndDelete( uid );

        res.status(200).json({
            ok: true,
            msg: 'Hospital Eliminado',
            hospital: hospitalDeleted
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
    getListHospitals,
    createHospital,
    updateHospital,
    deleteHospital
}