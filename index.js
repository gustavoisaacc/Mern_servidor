const express = require('express');
const conectDB = require('./config/db');
const cors = require('cors')

//crerar server
const app = express();

//concectamos a la base de datos
conectDB()

//habilitar cors
app.use(cors())

//habilitar express.json
app.use(express.json({extended: true}))

//puerto de la app
const PORT = process.env.PORT || 4000;

//importa rutas
app.use('/api/usuario', require('./routes/usuario'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))
app.use('/api/tareas', require('./routes/tareas'))

//arancar la app
app.listen(PORT, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})