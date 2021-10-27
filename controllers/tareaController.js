const Tarea = require('../Model/Tarea');
const Proyecto = require('../Model/Proyecto')
const {validationResult} = require('express-validator')

exports.crearTarea = async (req, res) =>{
    //revisar si  hay errores
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()})
    }

    //estraer el proyecto
    const {proyecto} = req.body;

    try {
        const exiteProyecto = await Proyecto.findById(proyecto)
        if(!exiteProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //revisar si el proyecto actual pertenese al usuario autenticado
        if(exiteProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //crear la tarea
        const tarea = new Tarea(req.body)
        await tarea.save()

        res.json({tarea})
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error')
    }
}

//obtener tareas por proyecto
exports.obtenerTareas = async  (req, res) =>{
    try {
        //extraemos proyecto
        const {proyecto} = req.query
        const exiteProyecto = await Proyecto.findById(proyecto);
        if(!exiteProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //revisar si el proyecto actual pertenese al usuario autenticado
        if(exiteProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //obtener las tareas popr proyeto
        const tareas = await Tarea.find({proyecto})
        res.json({tareas})


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }

}

//actualizar tareas
exports.actualizarTarea = async (req, res) =>{
    try {
        //extrare proyecto y tarea
        const {proyecto, nombre, estado} = req.body;

        //revisar si la tarea exite
        let exiteTare = await Tarea.findById(req.params.id)
        if(!exiteTare) {
            return res.status(404).json({msg: 'Tarea no encontrado'})
        }

        const exiteProyecto = await Proyecto.findById(proyecto)

        //validamos si el proyecto pertenece al usuario autenticado
        if(exiteProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //crear un obteto con la nueva ifo 
        const nuevaTarea = {}

        nuevaTarea.nombre = nombre
        nuevaTarea.estado = estado


        //guardar tarea
        exiteTare = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true})

        res.json({exiteTare})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

exports.eliminarTarea = async (req, res) =>{
    try {
         //extrare proyecto y tarea
         const {proyecto} = req.query;
         //revisar si la tarea exite
         let exiteTare = await Tarea.findById(req.params.id)
         if(!exiteTare) {
             return res.status(404).json({msg: 'Tarea no encontrado'})
         }
 
         const exiteProyecto = await Proyecto.findById(proyecto)
 
         //validamos si el proyecto pertenece al usuario autenticado
         if(exiteProyecto.creador.toString() !== req.usuario.id){
             return res.status(401).json({msg: 'No Autorizado'})
         }

         //eliminar tarea
         await Tarea.findOneAndDelete({_id: req.params.id})
         res.json({msg: 'Tarea eliminada'})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}