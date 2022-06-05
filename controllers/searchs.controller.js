// importamos el objeto response de expresa para ayudar a autocompletar
const { request, response } = require('express');

// modelos
const Hospital = require('../models/hospital.model');
const Doctor = require('../models/doctor.model');

const getSearch = async( req = request, res = response ) => {

    // tomamos la parte del query del URL 
    const srch = req.query?.srch || ''; // host:3000/api/search?srch=3
    let searchs = [];

    try {

        if( srch ) {
            // creamos una expresion regular para la busqueda
            const regex = new RegExp( srch, 'i' );

            // buscamos hospital y doctores
            const [ hospitals, doctors ] = await Promise.all([
                 Hospital.find({ name: regex }),
                 Doctor.find({ name: regex })
            ]);    

            if(hospitals) {
                // incluimos en la respuesta
                searchs.push( 
                    { 
                        model: 'Hospital', 
                        data: hospitals
                    });
            }

            if(doctors) {
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
                msg: 'Buscando...! a ' + srch ,
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

module.exports = {
    getSearch
}