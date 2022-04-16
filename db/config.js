const mongoose = require("mongoose");

const dbConnection = async() =>{
    try {
        await mongoose.connect( process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('BD online');   
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar la base de datos');  
    }
}
module.exports = {
    dbConnection
}