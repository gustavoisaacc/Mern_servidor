const mongoose = require('mongoose')

const TareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    creada: {
        type: Date,
        default: Date.now()
    },
    estado: {
        type: Boolean,
        default: false
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto'
    }
})

module.exports = mongoose.model('Tarea', TareaSchema)