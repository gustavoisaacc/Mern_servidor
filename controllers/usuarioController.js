const Usuario = require('../Model/Usuario')
const bcryptjs = require('bcryptjs')
const {validationResult} = require('express-validator')

const jwt = require('jsonwebtoken')


exports.crearUsuario = async (req, res)=>{
    //revisari si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    //validar usuario
    const {email, password} = req.body;

    try {
        //revisar que el usuario sea unico
        let usuario = await Usuario.findOne({email})

        if(usuario){
            return res.status(400).json({msg: 'El usuario ya existe'})
        } 

        //crear usuario
        usuario = new Usuario(req.body)

        //hasher el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt)
        
        //guardar usuario
        await usuario.save();

        //crear y firmar jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        }


        //firmar el jwt
        jwt.sign(payload, process.env.SESSION, {
            expiresIn: 3600 //1 hora
        }, (error, token)=>{
            if(error) throw error;

            //msj  
            res.json({token})
        })

    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un error')
    }

}