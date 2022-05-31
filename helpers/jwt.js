const jwt = require('jsonwebtoken');


// devuelve una  promesa
const generateJWT = (uid, role) => {

    return new Promise( ( resolve, reject ) => {

        const date = new Date().toDateString();
    
        const payload = {
            uid,
            date,
            role
        }
        
        jwt.sign( payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '12h'
        }, ( err, token ) => {
    
            if(err) {
                console.log(err);
                reject('No se puede generar el JWT!');
            } else {
                resolve( token );
            }

        } );

    });

}

module.exports = {
    generateJWT
}