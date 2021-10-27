const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    //leer el token del header
    const token  = req.header('x-auth-token');

    // revisar si no ha token
    if(!token){
        return res.status(401).json({msg: 'Permiso no valido, no hay token'})
    }
    //validar token

    try {
        const cifrado = jwt.verify(token, process.env.SESSION)
        req.usuario = cifrado.usuario;
        next() 
    } catch (error) {
        res.status(401).json({msg: 'token no valido'})
    }

}