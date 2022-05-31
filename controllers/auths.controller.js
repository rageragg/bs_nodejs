// importamos el objeto response de expresa para ayudar a autocompletar
const { request, response } = require('express');
// importamos el encriptador
const bcrypt = require('bcryptjs');
// importamos el modelo de usuario y de token
const User = require('../models/users.model');
const Token = require('../models/tokens.model');

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

        res.json(
            {
                ok: true,
                token: jwtString
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

module.exports = {
    loginAuth
}