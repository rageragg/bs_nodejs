// importamos el objeto response de expresa para ayudar a autocompletar
const { request, response } = require('express');
// importamos el encriptador
const bcrypt = require('bcryptjs');

// importamos el modelo de usuario
const User = require('../models/user.model');

const getListUsers = async( req = request, res = response ) => {

    const from = Number(req.query.from) || 0;

    const [ users, total ] = await Promise.all([
        User
            .find({}, 'nombre email name role google img')
            .skip( from )
            .limit( 5 ),

            User.countDocuments()
        ]);
        
        
        res.json({
            ok: true,
            users,
            total
        });
        
}

// el objeto res = response, es el establecimiento del valor por defecto
const createUser = async( req, res = response ) => {

    // obtenemos el cuerpo de la peticion
    const { name, password, email } = req.body;
    
    // inicio de validaciones
    try {

        // verificamos si existe el email en la BD
        const existEmail = await User.findOne({ email });
        if( existEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya esta resgistadro!'
            });
        }
        
        // creamos el modelo User
        const user = new User( req.body );
        // encriptamos la clave
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
        // salvamos los datos en la coleccion
        await user.save();

        // realizamos la respuesta
        res.json(
            {
                ok: true,
                user: user
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

const updateUser = async( req = request, res = response ) => {

    try {
        // obtenemos el parametro
        const uid = req.params.uid;
        // verificamos si existe el uid en la BD
        const existUser = await User.findById(uid);

        if( !existUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario NO esta resgistadro!'
            });
        }

        // obtenemos los campos de la peticion
        // quitamos propiedades que no deben ser modificadas
        const { password, google, email, ...fields } = req.body;

        // validamos si el email es correcto para actualizar
        if( existUser.email !== fields.email ) {
            // verificamos si existe el email en la BD
            const existEmail = await User.findOne({ email: fields.email  });
            if( existEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El email ya esta resgistadro!'
                });
            }

        }
        
        fields.email = email;

        // actualizamos los datos en la BD
        const userUpdated = await User.findByIdAndUpdate( uid, fields, { new: true } );

        res.json(
            {
                ok: true,
                user: userUpdated
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

const deleteUser = async( req = request, res = response ) => {

    try {
        // obtenemos el parametro
        const uid = req.params.uid;
        // verificamos si existe el uid en la BD
        const existUser = await User.findById(uid);
        // validamos que exista
        if( !existUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario No existe'
            });
        }

        // actualizamos los datos en la BD
        const userDeleted = await User.findByIdAndDelete( uid );

        res.status(200).json({
            ok: true,
            msg: 'Usuario Eliminado',
            user: userDeleted
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
    getListUsers,
    createUser,
    updateUser,
    deleteUser
}