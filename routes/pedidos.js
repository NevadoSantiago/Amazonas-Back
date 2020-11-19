const { response } = require('express');
var express = require('express');
var router = express.Router();
const admin = require('firebase-admin')

const db =admin.database()


router.post('/new', (req, res,next) => {
    console.log(req)
    const { apellido, nombre, direccion,email,estado,precioTotal,productos } = req.body
      var precioInt = parseInt(precioTotal)
    const newPedido = {
       precioTotal:precioInt,
       nombre,
       apellido,
       direccion,
       email,
       estado,
       productos,
       id: Math.floor(Math.random() * (1 - 100000000)) + 1,
    }
    console.log(newPedido)
    db.ref("pedidos").push(newPedido)
    res.send('Creado')
  })

router.get('/',async (req, res) => {
    const pedidos = await getPedidos()

    res.send(pedidos)
  })

  async function getPedidos () {
    pedidoTemplateRespuesta = {
        apellido:null,
        direccion:null,
        id:null,
        email:null,
        estado:null,
        nombre:null,
        precioTotal:null,
        productos:null
    }

    await db.ref("pedidos")
    .once('value', (snapshot) => {
      var pedidos = snapshot.val()
      resultado = []
        for (var i in pedidos){
            pedidoTemplateRespuesta = {
            apellido: pedidos[i].apellido,
            direccion: pedidos[i].direccion,
            id: pedidos[i].id,
            email: pedidos[i].email,
            estado: pedidos[i].estado,
            nombre: pedidos[i].nombre,
            precioTotal: pedidos[i].precioTotal,
            productos: pedidos[i].productos
          }
          resultado.push(pedidoTemplateRespuesta)
        }
          
    })
    return resultado
  }


module.exports = router;