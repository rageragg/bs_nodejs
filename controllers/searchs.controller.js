// importamos el objeto response de expresa para ayudar a autocompletar
const { request, response } = require('express');

// modelos
const Hospital = require('../models/hospital.model');
const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');

async function getSearch(req = request, res = response) {

    // tomamos la parte del query del URL 
    const srch = req.query?.srch || ''; // host:3000/api/search?model=hospital
    let searchs = [];

    try {

        if (srch) {
            // creamos una expresion regular para la busqueda
            const regex = new RegExp(srch, 'i');

            // buscamos hospital y doctores
            const [hospitals, doctors] = await Promise.all([
                Hospital.find({ name: regex }),
                Doctor.find({ name: regex })
            ]);

            if (hospitals) {
                // incluimos en la respuesta
                searchs.push(
                    {
                        model: 'Hospital',
                        data: hospitals
                    });
            }

            if (doctors) {
                // incluimos en la respuesta
                searchs.push(
                    {
                        model: 'Doctor',
                        data: doctors
                    });
            }

            // devolucion
            res.status(200).json({
                ok: true,
                msg: 'Buscando...! a ' + srch,
                searchs: searchs
            });
        }

    } catch (error) {
        console.warn(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!'
        });
    }

}

// /search/colection/:model/:srch'
const getDocumentsCollection = async(req, res = response ) => {

    const model    = req.params.model;
    const srch = req.params.srch;
    const regex    = new RegExp( srch, 'i' );

    let data = [];

    switch ( model ) {
        case 'doctors':
            data = await Doctor.find({ name: regex })
                                .populate('user', 'name img')
                                .populate('hospital', 'name img');
        break;

        case 'hospitals':
            data = await Hospital.find({ name: regex })
                                    .populate('user', 'nombre img');
        break;

        case 'users':
            data = await User.find({ name: regex });
            
        break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'El Modelo tiene que ser users/doctors/hospitals'
            });
    }
    
    res.json({
        ok: true,
        data
    })

}

module.exports = {
    getSearch,
    getDocumentsCollection
}