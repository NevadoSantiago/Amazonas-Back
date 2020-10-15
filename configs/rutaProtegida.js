
var express = require('express');
const dotenv = require('dotenv').config()

const SECRET = process.env.SECRET

const rutasProtegidas = express.Router();

rutasProtegidas.use((req, res, next) => {
    const token = req.headers['access-token'];
 
    if (token) {
      jwt.verify(token, SECRET, (err, decoded) => {      
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
     getRutaProtegida: () => rutasProtegidas,
     getSecret:()=>SECRET
 }