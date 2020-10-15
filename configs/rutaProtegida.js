const clave = require('./index')
var express = require('express');

const rutasProtegidas = express.Router();

rutasProtegidas.use((req, res, next) => {
    const token = req.headers['access-token'];
 
    if (token) {
      jwt.verify(token, clave.llave, (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválido' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token vacio.' 
      });
    }
 }); 
 module.exports ={
     getRutaProtegida: () => rutasProtegidas
 }