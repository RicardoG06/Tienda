'use strict'

var Cliente = require('../models/cliente'); //Nuestro modelo cliente va a estar inicializado en esta variable cliente
var bcrypt = require('bcrypt-nodejs'); //Llamamos al paquete instalado al inicio para encriptar contraseñas
var jwt = require('../Helpers/jwt'); //Para el token de cada usuario

var Direccion = require('../models/direccion');

const registro_cliente = async function (req,res) {
    //
    var data =req.body; //Toda la data enviada estara en el cuerpo del request
    
    //Verificar si un correo en la bd ya esta registrado
    var clientes_arr = []; 

    clientes_arr = await Cliente.find({email:data.email});

    //Si el arreglo esta vacio , significa que no hay correos iguales , entonces se procedera a registrar el usuario
    if(clientes_arr.length == 0){
        //Si hay una contraseña:
        if(data.password){
            bcrypt.hash(data.password, null, null , async function(err,hash ){
                //Si hash contiene la contraseña encriptada
                if(hash){
                    //Actualizo la contraseña
                    data.password = hash;
                    //Registro del usuario
                    var reg = await Cliente.create(data);
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

const login_cliente = async function (req, res){
    var data = req.body;
    var cliente_arr = [];

    //Busca el correo del cliente en toda la data para ver si el usuario existe
    cliente_arr = await Cliente.find({email:data.email});
    if(cliente_arr.length == 0){
        res.status(200).send({message: 'No se encontro el correo', data:undefined});
    }else{
        //Usuario dentro de la base de datos
        let user = cliente_arr[0];
        
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

const listar_clientes_filtro_admin = async function (req,res){
    console.log(req.user);
    if(req.user){
        if(req.user.role == 'admin'){
            //Realizar el filtro de clientes
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];

            console.log(tipo);

            if(tipo == null || tipo == 'null'){
            let reg = await Cliente.find();
            res.status(200).send({data:reg});
            }
            else{
                if(tipo == 'apellidos'){
                    let reg = await Cliente.find({apellidos:new RegExp(filtro,'i')});
                    res.status(200).send({data:reg});
                }else if(tipo == 'correo'){
                    let reg = await Cliente.find({email:new RegExp(filtro,'i')});
                    res.status(200).send({data:reg});
                }
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const registro_cliente_admin = async function (req, res){
    if(req.user){
        if(req.user.role == 'admin'){
            var data = req.body;
            //Dandole una contraseña por defecto al cliente
            bcrypt.hash('123456789',null, null, async function(err,hash){
                if(hash){
                    data.password = hash;
                    let reg = await Cliente.create(data);
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message: 'Hubo un error en el servidor', data:undefined});
                }
            })

        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}
//Debemos exportar lo que tiene el controlador registro cliente , para ello:

const obtener_cliente_admin = async function (req, res){
    if(req.user){
        if(req.user.role == 'admin'){
            var id = req.params['id'];
            //si el id tiene el formato correcto te envia el registro , sino de envia undefined
           try{
                var reg = await Cliente.findById({_id:id});
                res.status(200).send({data:reg});
                console.log(reg)
           }catch{
                res.status(200).send({data:undefined});
           }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const actualizar_cliente_admin = async function (req, res){
    if(req.user){
        if(req.user.role == 'admin'){

            var id = req.params['id'];
            var data = req.body;

            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres : data.nombres,
                apellidos : data.apellidos,
                email : data.email,
                telefono  :data.telefono,
                f_nacimiento : data.f_nacimiento,
                dni : data.dni,
                genero : data.genero
            });
            res.status(200).send({data:reg})
            
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_cliente_admin = async function (req, res){
    if(req.user){
        if(req.user.role == 'admin'){

            var id = req.params['id'];

            let reg = await Cliente.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg})
            
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_cliente_guest = async function (req, res){
    if(req.user){
        
            var id = req.params['id'];
            //si el id tiene el formato correcto te envia el registro , sino de envia undefined
           try{
                var reg = await Cliente.findById({_id:id});
                res.status(200).send({data:reg});
                console.log(reg)
           }catch{
                res.status(200).send({data:undefined});
           }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
    
}

const actualizar_perfil_cliente_guest = async function (req, res){
    if(req.user){
        
            var id = req.params['id'];
            var data = req.body;

            console.log(data.password)
            
            if(data.password){
                bcrypt.hash(data.password,null,null,async function (err,hash){
                    var reg = await Cliente.findByIdAndUpdate({_id:id},{
                        nombres : data.nombres,
                        apellidos : data.apellidos,
                        email : data.email,
                        telefono : data.telefono,
                        f_nacimiento : data.f_nacimiento,
                        dni : data.dni,
                        genero : data.genero,
                        pais : data.pais,
                        password: hash,
                    });
                    res.status(200).send({data:reg});
                });
                
            }else{
                var reg = await Cliente.findByIdAndUpdate({_id:id},{
                    nombres : data.nombres,
                    apellidos : data.apellidos,
                    email : data.email,
                    telefono : data.telefono,
                    f_nacimiento : data.f_nacimiento,
                    dni : data.dni,
                    genero : data.genero,
                    pais : data.pais,
                });
                res.status(200).send({data:reg});
            }
           
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
    
}

// ****************************************************** 
//Direcciones

const registro_direccion_cliente = async function (req, res){
    if(req.user){
        var data = req.body;

        if(data.principal){
            let direcciones = await Direccion.find({cliente:data.cliente});
            direcciones.forEach(async element=>{
                await Direccion.findByIdAndUpdate({_id:element._id},{principal:false})
            });
        }

        let reg = await Direccion.create(data);
            res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_direccion_todos_cliente = async function (req, res){
    if(req.user){
        var id = req.params['id'];

        let direcciones = await Direccion.find({cliente:id}).populate('cliente').sort({createdAt: -1});

        res.status(200).send({data:direcciones});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const cambiar_direccion_principal_cliente = async function (req, res){
    if(req.user){
        var id = req.params['id'];
        var cliente = req.params['cliente'];

        let direcciones = await Direccion.find({cliente:cliente});
        direcciones.forEach(async element=>{
            await Direccion.findByIdAndUpdate({_id:element._id},{principal:false})
        });
        
        await Direccion.findByIdAndUpdate({_id:id},{principal:true});
        res.status(200).send({data:true});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_direccion_principal_cliente = async function (req, res){
    if(req.user){
        var id = req.params['id'];
        var direccion = undefined;
        
        direccion = await Direccion.findOne({cliente:id,principal:true});

        if(direccion == undefined){
            res.status(200).send({data:undefined});
        }else{
            res.status(200).send({data:direccion});
        }
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest,
    registro_direccion_cliente,
    obtener_direccion_todos_cliente,
    cambiar_direccion_principal_cliente,
    obtener_direccion_principal_cliente
}