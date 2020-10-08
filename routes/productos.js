const { response } = require('express');
var express = require('express');
const { registerVersion } = require('firebase');
var router = express.Router();
const admin = require('firebase-admin')



const db =admin.database()

router.post('/new', (req, res) => {
  const { precio, nombre, descripcion } = req.body
  const newProduct = {
     precio,
     nombre,
     descripcion,
     id: Math.floor(Math.random() * (1 - 100000000)) + 1,
  }
  db.ref("productos").push(newProduct)
  res.send('Creado')
})
router.get('/get', (req, res) => {
     db.ref("productos").equalTo()
    .once('value', (snapshot) => {
        var productos = snapshot.val()
        console.log(productos)
        
    })
    res.send('Creado')
  })


module.exports = router;
