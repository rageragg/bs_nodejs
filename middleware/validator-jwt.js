const { request, response } = require('express');
const jwt = require('jsonwebtoken');

// importamos el modelo del token
const Token = require('../models/token.model');

const validatorJWT = async( req = request, res =  response, next ) => {
    
    try {
        
        // obtenemos el token
        const token = req.header('x-token');

        console.log(`Validando token: ${ token } `);

        // validamos el valor del token
        if ( !token ) {
            return res.status(401).json({
                ok: false,
                msg: 'Token Invalido'
            });
        }

        // verificamos que el token este registrado
        const existToken = await Token.findOne({ token });
        if( !existToken ) {
            return res.status(404).json({
                ok: false,
                msg: 'Token No registrado!'
            });
        } 
    
        // destructuramos los datos del payload del token
        const { uid, role } = jwt.verify( token, process.env.JWT_SECRET_KEY );
        // establecemos los valores en el request para compartir datos
        req.credentials = { uid, role };
    
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token Invalido'
        });
        
    }
}

module.exports = {
    validatorJWT
}