const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJwt } = require('../helpers/jwt');

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
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);
    
        //Generar JsonWebToken
        const token = await generarJwt(dbUser.id, dbUser.name);
        //Crear usuario en la BD
        await dbUser.save();
        //Generar respuesta exitosa
        return res.status(201).json({
            oks: true,
            uid: dbUser.id,
            name,
            token
        });     
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: "Contacta al administrador del sistema"
        });
    } 
}

const loginUsuario = async (req, res=response)  =>{
    const {email, password} = req.body;
    // console.log(email, password);
    try {
        const dbUser = await Usuario.findOne({email});
        if(!dbUser){
            return res.status(400).json({
                ok: false,
                msg: 'El email no existe'
            });
        }
        //Confirmar password
        const validPass = bcrypt.compareSync(password, dbUser.password);
        if(!validPass){
            return res.status(400).json({
                ok: false,
                msg: 'El password no es correcto'
            });
        }
        //Generar JsonWebToken
        const token = await generarJwt(dbUser.id, dbUser.name);
        //Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        })     
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg:'Hable con el Herberth'
        });
    }
}

const revalidarToken = async (req, res= response)  =>{
    const { uid, name } = req;
    const token = await generarJwt(uid,name);
    return res.json({
        ok: true,
        uid,
        name, 
        token
    });
}

module.exports={
    crearUsuario,
    loginUsuario,
    revalidarToken
}