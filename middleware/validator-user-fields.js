// importamos el objeto response de expresa para ayudar a autocompletar
const { response } = require('express');
const { validationResult } = require('express-validator');

const validatorUserFields = ( req, res = response, next ) => {

    // obtenemos el resultado de la validacion del middleware
    const errors = validationResult(req);
    if( !errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    next();
}

module.exports = {
    validatorUserFields
}