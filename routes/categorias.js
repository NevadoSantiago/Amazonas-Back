const { response } = require('express');
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin')

const db =admin.database()

router.post('/new', (req, res) => {
  const { nombre,descripcion } = req.body
  const newCategoria = {
     nombre,
     descripcion,
     id: Math.floor(Math.random() * (1 - 100000000)) + 1,
  }
  console.log(newCategoria)
  db.ref("categorias").push(newCategoria)
  res.send('Creado')
})

router.get('/',async (req, res) => {
    const categorias = await getCategorias()

    res.send(categorias)
  })

  async function getCategorias () {
    categoriaTemplateRespuesta = {
        nombre:null,
        descripcion:null,
        id:null
    }

    await db.ref("categorias")
    .once('value', (snapshot) => {
      var categorias = snapshot.val()
      resultado = []
        for (var i in categorias){
            categoriaTemplateRespuesta = {
            nombre: categorias[i].nombre,
            descripcion: categorias[i].descripcion,
            id: categorias[i].id,
          }
          resultado.push(categoriaTemplateRespuesta)
        }
          
    })
    return resultado
  }
module.exports = router;
