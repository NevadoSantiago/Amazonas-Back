const { response } = require('express');
var express = require('express');
const { registerVersion } = require('firebase');
var router = express.Router();
const admin = require('firebase-admin')

const db =admin.database()

router.post('/new', (req, res) => {
  console.log(req)
  const { precio, nombre, descripcion } = req.body
  const newProduct = {
     precio,
     nombre,
     descripcion,
     id: Math.floor(Math.random() * (1 - 100000000)) + 1,
  }
  console.log(newProduct)
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

router.post('/getByIds',async (req,res) =>{
  const {idProductos} = req.body
  console.log(req)
  let productos = []

  for (const id of idProductos) {
    productos.push( await getProductoById(id))
  }
    res.send(productos)  
})


async function getProductoById (id) {
  var productoTemplateRespuesta = {
    nombre: null,
    precio: null,
    descripcion: null,
    id: null
  }
  await db.ref("productos").orderByChild("id").equalTo(id)
    .once('value', (snapshot) => {
      var productos = snapshot.val()
      resultado = []
        for (var i in productos){
          productoTemplateRespuesta = {
            nombre: productos[i].nombre,
            precio: productos[i].precio,
            descripcion: productos[i].descripcion,
            id: productos[i].id,
            url:productos[i].url
          }
        }
          
    })
    return productoTemplateRespuesta;
}


module.exports = router;
