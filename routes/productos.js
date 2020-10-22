const { response } = require('express');
var express = require('express');
const { registerVersion } = require('firebase');
var router = express.Router();
const admin = require('firebase-admin')

const db =admin.database()

router.post('/new', (req, res,next) => {
  console.log(req)
  const { precio, nombre, descripcion,categoria,url } = req.body
  const newProduct = {
     precio,
     nombre,
     descripcion,
     categoria,
     url,
     id: Math.floor(Math.random() * (1 - 100000000)) + 1,
  }
  console.log(newProduct)
  db.ref("productos").push(newProduct)
  res.send('Creado')
})

router.get('/getProductos/:categoria', async (req, res) => {
  const {categoria} = req.params
     var productos = await getProductosByCategoria(categoria)
    res.send(productos)
})
router.get('/',async (req, res) => {
  const productos = await getProductos()

  res.send(productos)
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

async function getProductos () {
  var productoTemplateRespuesta = {
    nombre: null,
    precio: null,
    descripcion: null,
    id: null
  }

  await db.ref("productos")
  .once('value', (snapshot) => {
    var productos = snapshot.val()
    resultado = []
      for (var i in productos){
        productoTemplateRespuesta = {
          nombre: productos[i].nombre,
          precio: productos[i].precio,
          descripcion: productos[i].descripcion,
          id: productos[i].id,
          url:productos[i].url,
          categoria:productos[i].categoria
        }
        resultado.push(productoTemplateRespuesta)
      }
        
  })
  return resultado
}


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
async function getProductosByCategoria (categoria) {
  var productoTemplateRespuesta = {
    nombre: null,
    precio: null,
    descripcion: null,
    categoria: null,
    id: null,
    url: null
  }
  await db.ref("productos").orderByChild("categoria").equalTo(categoria)
    .once('value', (snapshot) => {
      var productos = snapshot.val()
      console.log(productos)
      resultado = []
        for (var i in productos){
          resultado.push(
          productoTemplateRespuesta = {
            nombre: productos[i].nombre,
            precio: productos[i].precio,
            descripcion: productos[i].descripcion,
            id: productos[i].id,
            url:productos[i].url,
            categoria:productos[i].categoria
          }
          )
        }
          
    })
    return resultado;
}


module.exports = router;
