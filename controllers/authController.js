const Usuario = require('../Model/Usuario')
const bcryptjs = require('bcryptjs')
const {validationResult} = require('express-validator')

const jwt = require('jsonwebtoken')

exports.autenticarUsuario = async (req, res) =>{
       //revisari si hay errores
       const errores = validationResult(req);

        if(!errores.isEmpty()){
           return res.status(400).json({errores: errores.array()})
        }

        // extrare email y passw
        const {email, password} = req.body

        try {
           let usuario = await Usuario.findOne({email});
           if(!usuario){
               return res.status(400).json({msg: 'El usuario no exite'})
           }

           //revisar el passw
           const passCorrecto = await bcryptjs.compare(password, usuario.password);

           if(!passCorrecto){
               return res.status(400).json({msg: 'El password es incorrecto'}) 
           }

           // si todo es correcto crear y firmar web token
             //crear y firmar jwt
            const payload = {
            usuario: {
                id: usuario.id
                }
            }

            console.log(process.env.SESSION)

            //firmar el jwt
            jwt.sign(payload, process.env.SESSION, {
            expiresIn: 3600 //1 hora
                }   , (error, token)=>{
            if(error) throw error;

            //msj  
            res.json({token})
            })
           
            } catch (error) {
           console.log(error)
        }
}

//obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Hubo un error'})
    }
}