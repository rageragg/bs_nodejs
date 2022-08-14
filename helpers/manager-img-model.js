const fs = require('fs');

const User = require('../models/user.model');
const Hospital = require('../models/hospital.model');
const Doctor = require('../models/doctor.model');

const checkFileExist = async(  fileName ) => {

    if( fs.existsSync(fileName) ) {
        return true;
    } else {
        return false;
    }
}

const removeFileExist = async( fileName ) => {

    let ok = false;

    try {
        
        if( fs.existsSync(fileName)) {
            fs.unlinkSync( fileName );
            ok = true;
        }

    } catch (error) {
       ok = false; 
    }

    return ok;
}


const updateImgModel = async( model, id, path, fileName ) => {

    let result = false;
    
    switch (model) {
        
        case 'user':
            
            try {
                
                let oldPath;
                const user = await User.findById(id);
                if(!user) {
                    result = false;
                } else {

                    // eliminamos la vieja imagen
                    oldPath = `./uploads/users/${ user.img }`;
                    if( fs.existsSync(oldPath)) {
                        fs.unlinkSync( oldPath );
                    }
                    
                    // asignamos la nueva image``
                    if( fs.existsSync(path) ) {
                        user.img = fileName;
                        await user.save();
                    }
                    
                    result = true;
                }

            } catch (error) {
                console.log(error);
                result = false;
            }
            
            break;

        case 'hospital':

            try {
                
                let oldPath;
                const hospital = await Hospital.findById(id);
                if(!hospital) {
                    result = false;
                } {

                    
                    // eliminamos la vieja imagen
                    oldPath = `./uploads/hospitals/${ hospital.img }`;
                    if( fs.existsSync(oldPath)) {
                        fs.unlinkSync( oldPath );
                    }
                    
                    // asignamos la nueva image``
                    if( fs.existsSync(path) ) {
                        hospital.img = fileName;
                        await hospital.save();
                    }

                    result = true;
                }

            } catch (error) {
                console.log(error);
                result = false;
            }

            break;

        case 'doctor':
    
            try {
                
                let oldPath;
                const doctor = await Doctor.findById(id);
                if(!doctor) {
                    result = false;
                } else {

                    
                    // eliminamos la vieja imagen
                    oldPath = `./uploads/doctors/${ doctor.img }`;
                    if( fs.existsSync(oldPath)) {
                        fs.unlinkSync( oldPath );
                    }
                    
                    // asignamos la nueva image``
                    if( fs.existsSync(path) ) {
                        doctor.img = fileName;
                        await doctor.save();
                    }

                    result = true;
                }

            } catch (error) {
                console.log(error);
                result = false;
            }

            break;

        default:
            break;
    }

    return result;
}


module.exports = {
    checkFileExist,
    removeFileExist,
    updateImgModel
}