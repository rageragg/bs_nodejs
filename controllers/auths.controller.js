// importamos el objeto response de expresa para ayudar a autocompletar
const { request, response } = require('express');
// importamos el encriptador
const bcrypt = require('bcryptjs');
// importamos el modelo de usuario y de token
const User = require('../models/user.model');
const Token = require('../models/token.model');

const { generateJWT } = require('../helpers/jwt');

// login
const loginAuth = async( req, res ) => {
   
    try {

        // extraemos los datos del cuerpo de la peticion
        const { email, password } = req.body;
        // validamos que el email exista
        const existUser = await User.findOne({ email });
        if( !existUser ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email o clave no encontrado!'
            });
        } 

        // validamos la clave
        const validCredencials = bcrypt.compareSync( password, existUser?.password );
        if( !validCredencials ) {
            return res.status(400).json({
                ok: false,
                msg: 'Email o clave no encontrado!'
            });
        }

        // generar JWT
        const jwtString = await generateJWT( existUser?.id, existUser?.role );

        // creamos un token de BD
        const token = new Token( 
            {  
                user_id: existUser?.id,
                token: jwtString
            });
        // registramos el token en la BD    
        await token.save();

        res.status(200).json(
            {
                ok: true,
                msg: 'Token Creado!',
                token: jwtString,
                user: existUser
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

// renew token
const renewToken = async( req, res ) => {
    // obtenemos el token
    const tokenRequest = req.header('x-token');

    // obtenemos las credenciales del usuario ya logeado
    const credentials = req.credentials;

    try {
        
        // generar JWT
        const jwtString = await generateJWT( credentials?.uid, credentials?.role );
        // creamos un token de BD
        const token = new Token( 
            {  
                user_id: credentials?.uid,
                token: jwtString
            });
        // registramos el token en la BD    
        await token.save();

        // buscamos el usuario propietario
        const user = await User.findById( credentials?.uid );

        // retornamos el resultado
        res.status(200).json(
            {
                ok: true,
                msg: 'Token Renovado!',
                token: jwtString,
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

// renew token
const validateToken = async( req, res ) => {
    // obtenemos el token
    const tokenRequest = req.header('x-token');
    // obtenemos las credenciales del usuario ya logeado
    const credentials = req.credentials;
    // buscamos el usuario
    const existUser = await User.findById( credentials?.uid );

    // retornamos el resultado
    res.status(200).json(
        {
            ok: true,
            msg: 'Token validado!',
            token: tokenRequest,
            user: existUser
        }
    );
}

module.exports = {
    loginAuth,
    renewToken,
    validateToken
}