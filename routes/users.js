const { response } = require('express');
var express = require('express');
const { registerVersion } = require('firebase');
var router = express.Router();


const admin = require('firebase-admin')

const db = admin.database()

router.post('/new', (req, res) => {
  const { email, pass } = req.body
  const newUser = {
    email: email,
    password: pass,
    rol: "usuario",
  }
  db.ref("usuarios").push(newUser)

  res.send(newUser)
})

router.get('/', (req, res) => {
  db.ref("usuarios").once('value', (snapshot) => {
    var usuarios = snapshot.val()
    console.log(usuarios)

    res.render("usuarios", { usuarios })

  })

})
router.post('/login',async (req, res) => {
  const { email, pass } = req.body
  var usuario = await getUsuarioByEmail(email)
      if (usuario) {
        if (usuario.password == pass) {
          res.send(usuario, 201)
        } else {
          res.send("Contrasena incorrecta", 402)
        }
      } else {
        res.send("eMail incorrecto", 401)
      }
    })

    router.post('/addProduct/:idProducto/:emailUsuario', async(req, res) => {
      const {idProducto,emailUsuario} = req.params
      var usuario = await getUsuarioByEmail(emailUsuario)
          if (usuario) {
            if(usuario.productos){
              usuario.productos.push(idProducto)
            }else{
              usuario.productos=[
                idProducto
              ]
            }
            
             db.ref("usuarios/"+usuario.id).update(usuario)
            }
            res.send(usuario)
        })






  async function getUsuarioByEmail (email) {
  var usuarioTemplateRespuesta = {
    password: null,
    email: null,
    rol: null,
    id: null,
    productos: null
  }
  await db.ref("usuarios").orderByChild("email").equalTo(email)
    .once('value', (snapshot) => {
      var usuarios = snapshot.val()
      resultado = []
        for (var i in usuarios){
            usuarioTemplateRespuesta = {
            id:i,
            password: usuarios[i].password,
            email: usuarios[i].email,
            rol: usuarios[i].rol,
            productos: usuarios[i].productos
          }
        }
          
    })
    return usuarioTemplateRespuesta;
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
            id: productos[i].id
          }
        }
          
    })
    return usuarioTemplateRespuesta;
}


module.exports = router;
