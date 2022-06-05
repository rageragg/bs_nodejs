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
    
    switch (model) {
        
        case 'user':
            
            try {
                
                let oldPath;
                const user = await User.findById(id);
                if(!user) {
                    return false;
                }
    
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

            } catch (error) {
                console.log(error);
                return false;
            }
            
            break;

        case 'hospital':

            try {
                
                let oldPath;
                const hospital = await Hospital.findById(id);
                if(!hospital) {
                    return false;
                }
    
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

            } catch (error) {
                console.log(error);
                return false;
            }

            break;

        case 'doctor':
    
            try {
                
                let oldPath;
                const doctor = await Doctor.findById(id);
                if(!doctor) {
                    return false;
                }
    
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

            } catch (error) {
                console.log(error);
                return false;
            }

        default:
            break;
    }

    return true;
}


module.exports = {
    checkFileExist,
    removeFileExist,
    updateImgModel
}