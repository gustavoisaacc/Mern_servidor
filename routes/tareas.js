const express = require('express');
const router = express.Router();

const tareaController = require('../controllers/tareaController')
const auth = require('../middleware/auth')
const {check} = require('express-validator')

//crear tarea
//api/tareas
router.post('/', 
    auth,
    [
        [
            check('nombre', 'El campo nombre es obligatorio').not().isEmpty(),
            check('proyecto', 'El campo proyecto es obligatorio').not().isEmpty()            
        ],
    ],
    tareaController.crearTarea
)
router.get('/',
    auth,
    tareaController.obtenerTareas
)
router.put('/:id',
    auth,
    [
        check('nombre', 'El campo nombre es obligatorio').not().isEmpty()
    ],
    tareaController.actualizarTarea
)
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;