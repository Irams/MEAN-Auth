const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

//Crear el servidor/aplicación de express
const app = express();

//Base de Datos
dbConnection();

//Directorio público
app.use(express.static('public'));

//CORS
app.use( cors() );

//Lectura y parseo del body
app.use( express.json() );

//Rutas
app.use( '/api/auth', require('./routes/auth') )

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`Servidor corriendo en puerto ${ port }`);
});