const {response} = require('express');
const Usuario = require('../models/Usuario');

const crearUsuario = async (req, res=response) =>{

    const {name, email, password} = req.body;

    try {
        //Verificar que no exista el email
        const usuario = await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya ha sido registrado'
            });
        }

        //Crear usuario con el modelo
        const dbUser = new Usuario(req.body);
    
        //Hashear la contraseña
    
        //Generar JsonWebToken

        //Crear usuario en la BD
        await dbUser.save();
    
        //Generar respuesta exitosa
        return res.status(201).json({
            oks: true,
            uid: dbUser.id,
            name
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: "Contacta al administrador del sistema"
        });
    }
    
}

const loginUsuario = (req, res=response)  =>{

    const {email, password} = req.body;
    // console.log(email, password);

    return res.json({
        ok: true,
        msg: "Login de usuario/"
    });
}

const revalidarToken = (req, res= response)  =>{
    return res.json({
        ok: true,
        msg: "Renew"
    });
}

module.exports={
    crearUsuario,
    loginUsuario,
    revalidarToken
}