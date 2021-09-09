'use strict'

var jwt = require('jwt-simple'); //Decodificar el token
var moment = require('moment'); //Obtener la fecha actual y fehca de expiracion del token
var secret = 'rubenP'; //clave para decodificar el token

//Seguridad para los tokens en el postman con middlewares
exports.auth = function(req, res , next) {

    if(!req.headers.authorization){
        return res.status(403).send({message: "NoHeadersError"});
    }

    var token = req.headers.authorization.replace(/['"]+/g,'')

    var segment = token.split('.');

    if(segment.length != 3){
        return res.status(403).send({message: "InvalidToken"});
    }else{
        try{
            var payload = jwt.decode(token,secret);           
            //Validando expiracion del token
            if(payload.exp <= moment().unix()){
                return res.status(403).send({message: "TokenExpirado"});
            }
        } catch (error){
            return res.status(403).send({message: "InvalidToken"});
        }
    }
    req.user = payload;

    next();
}

