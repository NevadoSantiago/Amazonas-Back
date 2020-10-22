
var express = require('express');
var router = express.Router();

jwt = require('jsonwebtoken');
const admin = require('firebase-admin')
const db = admin.database()

const SECRET = require('../configs/rutaProtegida').getSecret();
const rutaProtegida = require('../configs/rutaProtegida').getRutaProtegida()



router.post('/new',async (req, res) => {
  const { email, password,rol } = req.body
  const newUser = {
    email: email,
    password: password,
    rol:rol,
  }
  var usuario = await getUsuarioByEmail(email)
  if(usuario.email){
    res.send("Usuario existente",409)
  }else{
    db.ref("usuarios").push(newUser)
    res.send(newUser)
  }

})


router.post('/login',async (req, res) => {
  const { email, pass } = req.body
  var usuario = await getUsuarioByEmail(email)
      if (usuario) {
        if (usuario.password == pass) {
          const payload = {
            usuario: usuario.email
           };
           const token = jwt.sign(payload,SECRET,{
             expiresIn:3600 //EN SEGUNDOS --> (1hora)
           });
           usuario.password = null //PARA QUE NO SE ENVIE LA PASSWORD AL FRONT
           usuario.token = token;
          res.send(usuario, 201)
        } else {
          res.send("Contrasena incorrecta", 402)
        }
      } else {
        res.send("eMail incorrecto", 401)
      }
    })

    router.post('/addProduct/:idProducto/:emailUsuario/:cantidad', async(req, res) => {
      const {idProducto,emailUsuario,cantidad} = req.params
      console.log(idProducto)
      console.log(emailUsuario)
      console.log(cantidad)
      var idProductoInt = parseInt(idProducto,10)
      var cantidadInt = parseInt(cantidad,10)
      var usuario = await getUsuarioByEmail(emailUsuario)
          if (usuario) {
            if(usuario.productos){
              for(var i=0;i<cantidadInt; i++){
                usuario.productos.push(idProductoInt)
              }           
            }else{
              usuario.productos = []
              for(var i=0;i<cantidadInt; i++){
                usuario.productos.push(idProductoInt)
              }   
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
