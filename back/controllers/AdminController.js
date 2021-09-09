'use strict'

var Admin = require('../models/admin');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../Helpers/jwt')

const registro_admin = async function (req,res) {
    //
    var data =req.body; //Toda la data enviada estara en el cuerpo del request
    
    //Verificar si un correo en la bd ya esta registrado
    var admin_arr = []; 

    admin_arr = await Admin.find({email:data.email});

    //Si el arreglo esta vacio , significa que no hay correos iguales , entonces se procedera a registrar el usuario
    if(admin_arr.length == 0){
        //Si hay una contraseña:
        if(data.password){
            bcrypt.hash(data.password, null, null , async function(err,hash ){
                //Si hash contiene la contraseña encriptada
                if(hash){
                    //Actualizo la contraseña
                    data.password = hash;
                    //Registro del usuario
                    var reg = await Admin.create(data);
                    res.status(200).send({data: reg});
                }else{
                    res.status(200).send({message: 'ErrorServer', data:undefined});
                }
            })
        }else{
            res.status(200).send({message: 'No hay una contraseña', data:undefined});
        }

    }else{
        res.status(200).send({message: 'El correo ya existe en la base de datos', data:undefined});
    }
}

const login_admin = async function (req, res){
    var data = req.body;
    var admin_arr = [];

    //Busca el correo del cliente en toda la data para ver si el usuario existe
    admin_arr = await Admin.find({email:data.email});
    if(admin_arr.length == 0){
        res.status(200).send({message: 'No se encontro el correo', data:undefined});
    }else{
        //Usuario dentro de la base de datos
        let user = admin_arr[0];
        
        bcrypt.compare(data.password, user.password, async function (err,check){
            //Verificando la contraseña
            if(check){
                res.status(200).send({
                    data:user,
                    token: jwt.createToken(user)
                });
            }else{
                res.status(200).send({message: 'La contraseña es incorrecta', data:undefined})
                }
        });
    }
}

module.exports = {
    registro_admin,
    login_admin
}