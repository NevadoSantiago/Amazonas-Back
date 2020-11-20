const { response } = require('express');
var express = require('express');
const { registerVersion } = require('firebase');
var router = express.Router();
const admin = require('firebase-admin')

const db =admin.database()

router.post('/new', (req, res,next) => {
  console.log(req)
  const { precio, nombre, descripcion, categoria,url } = req.body
    var precioInt = parseInt(precio)
    var existencia = true
  const newProduct = {
     precio:precioInt,
     nombre,
     descripcion,
     existencia,
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

router.get('/getTotalProductos',async (req, res) => {
  const productos = await getTotalProductos()

  res.send(productos)
})

router.put('/updateExistencia', async(req,res) => {
  const {key, existencia} = req.body
  var producto = getProductoByKey(key)
  producto.existencia = existencia

  db.ref("productos/"+key).update(producto)
  res.send('Actualizado')
})


/*ESTE GET CREO QUE PODRIA DESAPARECER

router.get('/get', (req, res) => {
     db.ref("productos").orderByChild("existencia").equalTo("true")
    .once('value', (snapshot) => {
        var productos = snapshot.val()
        console.log(productos)
        
    })
    res.send('Creado')
  })
  
  */


  
router.post('/getByIds',async (req,res) =>{
  const {idProductos} = req.body
  console.log(req)
  let productos = []

  for (const id of idProductos) {
    productos.push( await getProductoById(id))
  }
    res.send(productos)  
})

router.delete('/deleteByKey', async(req,res)=>{
  const {key} = req.body
  await db.ref("productos").child(key).remove()
  res.send('Borrado')
})

async function getProductos () {
  var productoTemplateRespuesta = {
    key: null,
    nombre: null,
    precio: null,
    existencia: null,
    descripcion: null,
    id: null
  }

  await db.ref("productos")
  .once('value', (snapshot) => {
    var productos = snapshot.val()
    resultado = []
      for (var i in productos){
        productoTemplateRespuesta = {
          key: i,
          nombre: productos[i].nombre,
          precio: productos[i].precio,
          descripcion: productos[i].descripcion,
          existencia: productos[i].existencia,
          id: productos[i].id,
          url:productos[i].url,
          categoria:productos[i].categoria
        }
        resultado.push(productoTemplateRespuesta)
      }
        
  })
  return resultado
}


async function getTotalProductos () {
  var productoTemplateRespuesta = {
    key: null,
    nombre: null,
    precio: null,
    existencia: null,
    descripcion: null,
    id: null
  }

  await db.ref("productos").orderByChild("existencia").equalTo("true")
  .once('value', (snapshot) => {
    var productos = snapshot.val()
    resultado = []
      for (var i in productos){
        productoTemplateRespuesta = {
          key: i,
          nombre: productos[i].nombre,
          precio: productos[i].precio,
          descripcion: productos[i].descripcion,
          existencia: productos[i].existencia,
          id: productos[i].id,
          url:productos[i].url,
          categoria:productos[i].categoria
        }
        resultado.push(productoTemplateRespuesta)
      }
        
  })
  return resultado
}


async function getProductoByKey (key) {
  var productoTemplateRespuesta = {
    nombre: null,
    precio: null,
    descripcion: null,
    existencia: null,
    id: null
  }
  await db.ref("productos/"+key)
    .once('value', (snapshot) => {
      var productos = snapshot.val()
      resultado = []
        for (var i in productos){
          productoTemplateRespuesta = {
            nombre: productos[i].nombre,
            precio: productos[i].precio,
            descripcion: productos[i].descripcion,
            existencia: productos[i].existencia,
            id: productos[i].id,
            url:productos[i].url
          }
        }
          
    })
    return productoTemplateRespuesta;
}

async function getProductoById (id) {
  var productoTemplateRespuesta = {
    nombre: null,
    precio: null,
    descripcion: null,
    existencia: null,
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
            existencia: productos[i].existencia,
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
    existencia: null,
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
            existencia: productos[i].existencia,
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
