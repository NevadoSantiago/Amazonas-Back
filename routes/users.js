var express = require('express');
var router = express.Router();

const admin = require('firebase-admin')
var serviceAccount = require("../as-libre-firebase-adminsdk-tchz0-e2b0887bd4.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://as-libre.firebaseio.com/'
})

const db = admin.database()

router.post('/new',(req,res)=>{
  const newUser = {
    nombre: "Juan",
    apellido: "Pereyra",
    id:3
  }
  db.ref("usuario").push(newUser)
  res.send('Creado')
})

router.get('/',(req,res)=>{
  db.ref("usuario").once('value',(snapshot)=>{
     const usuarios = snapshot.val()
      console.log(usuarios)
      res.send(usuarios)

  })
  
})

module.exports = router;
