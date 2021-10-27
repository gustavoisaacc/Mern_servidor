const Proyecto = require('../Model/Proyecto')
const {validationResult} = require('express-validator')

exports.crearProyecto = async (req, res) => {
    //revisar si  hay errores
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()})
    }

    try {
        const proyecto = new Proyecto(req.body)
        
        //guardar el usuario 
        proyecto.creador = req.usuario.id

        //guardamos el proecto
        proyecto.save()
        res.json(proyecto)

    } catch (error) {
        console.log(error)
    }
}

//obtener todos los proyectos del usuario actual

exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1})
        res.json({proyectos})
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error')
    }
}

//actualizar proyecto
exports.actualizarProyecto = async (req, res) =>{
     //revisar si  hay errores
     const error = validationResult(req)
     if(!error.isEmpty()){
         return res.status(400).json({error: error.array()})
     }
     //extraer proyecto
     const {nombre} = req.body;
    
     const nuevoProyecto = {};

     if(nombre){
         nuevoProyecto.nombre = nombre
     }

     try {
         //validar id
         let project = await Proyecto.findById(req.params.id)

         //verificar si el proyecto exite
         if(!project){
             return res.status(404).json({msg: 'Proyecto no encontrado'})
         }

         //verifivar el usuario
         if(project.creador.toString() !== req.usuario.id){
             return res.status(401).json({msg: 'No Autorizado'})
         }

         //actualizar
         project = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set : nuevoProyecto}, {new : true})

         res.json({project})
         
     } catch (error) {
         console.log(error)
         res.status(500).send('error en el servidor')
     }
}

//eliminar un proyecto
exports.eliminarProyecto = async (req, res) => {

    try {
         //validar id
         let project = await Proyecto.findById(req.params.id)

         //verificar si el proyecto exite
         if(!project){
             return res.status(404).json({msg: 'Proyecto no encontrado'})
         }

         //verifivar el usuario
         if(project.creador.toString() !== req.usuario.id){
             return res.status(401).json({msg: 'No Autorizado'})
         }

         //eliminar el proyectp
         await Proyecto.findOneAndDelete({_id: req.params.id})
         res.json({msg: 'Proyecto eliminado'})

    } catch (error) {
        console.log(error)
        res.status(500).send('error en el servidor')
    }
}