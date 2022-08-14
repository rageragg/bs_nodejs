// importamos el objeto response de expresa para ayudar a autocompletar
const path  = require('path');
const fs = require('fs');
const { request, response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateImgModel } = require('../helpers/manager-img-model');

// carga imagen al servidor y asigna al modelo
const putUploadImages = async( req = request, res = response ) => {

    try {

        const model = req.params.model;
        const id = req.params.id;
        const modelsValid = [ 'user', 'doctor', 'hospital' ];
        const extFileValid = [ 'png', 'jpg', 'jpeg', 'gif' ];
        
        let sampleFile;
        let uploadPath;
        let cutName;
        let extFile;
        let FileName;

        // validamos que el modelo sea valido
        if( !modelsValid.includes(model)) {
            return res.status(400).json({
                ok: false,
                msg: "No hay modelos compatibles para procesar, ['user', 'hospital', 'doctor']"
            }); 
        }

        // validamos que exista un archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: "No hay Archivos que procesar!"
            });
        }
        
        sampleFile = req.files.imagen;
        cutName  = sampleFile.name.split('.');
        extFile    = cutName[ cutName.length - 1];
        // validamos la extencion
        if(!extFileValid.includes(extFile)) {
            return res.status(400).json({
                ok: false,
                msg: "No es una extencion valida, ['png', 'jpg', 'jpeg', 'gif' ]"
            }); 
        }

        // creamos el archivo
        FileName = `${  uuidv4() }.${extFile}`;
        // creamos el path
        uploadPath = `./uploads/${ model }s/${ FileName }`;

        // colocamos el archivo en el servidor
        sampleFile.mv(uploadPath, function(error) {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Ha ocurrido un error',
                    file: FileName,
                    error:  error
                });
            }

            // asignamos la imagen al modelo
            updateImgModel( model, id, uploadPath, FileName )
                .then( resp => {
                    if( resp ) {
                        res.status(200).json({
                            ok: true,
                            msg: "Archivo Cargado y Asignado al modelo "  + model + "!",
                            file_name: FileName
                        });
                    } else {
                        res.status(400).json({
                            ok: false,
                            msg: "Archivo no asignado al modelo " + model + "!",
                            file_name: ''
                        });
                    }
                });

        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg:  error
        });
    }
}

// retorna imagen desde el servidor segun el modelo
const getImages = async( req = request, res = response ) => {

    try {

        const model = req.params.model;
        const img = req.params.img;

        let pathImg = path.join(__dirname, `../uploads/${ model }s/${ img }`);

        // verificamos si la imagen existe
        if( fs.existsSync(pathImg) )  {
            res.sendFile( pathImg );
        } else {
            pathImg = path.join(__dirname, `../uploads/no-image-icon.jpg`);
            res.sendFile( pathImg );
        }

        
    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg:  error
        });
    }

}

module.exports = {
    putUploadImages,
    getImages
}