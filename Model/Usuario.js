const mongoose = require('mongoose')

const mongooseShema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    reguistro: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Usuario', mongooseShema)