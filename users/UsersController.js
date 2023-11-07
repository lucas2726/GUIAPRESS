const express = require("express") 
const router = express.Router()
const User = require("./User")
const bcrypt = require("bcryptjs")

router.get("/admin/users", (req, res) => { //Para criar uma rota
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users}) //Para enviar os dados para o html para poder usar eles lá
    })
})

// com  "/" = //Para criar uma rota sem "/" = //Para adicionar um arquivo 

router.get("/admin/users/create", (req, res) => { //Para criar uma rota
    res.render("admin/users/create") //Para adicionar um arquivo 
})

router.post("/users/create", (req, res) => {
    let email = req.body.email //Para pegar o "name="email"" de create.js
    let password = req.body.password //Para pegar o "name="password"" de create.js 

   User.findOne({where:{email: email}}).then(user => {
    if (user == undefined) { //Para verificar se o email já está cadastrado
    let salt = bcrypt.genSaltSync(10) //hash
    let hash = bcrypt.hashSync(password, salt) //hash
    User.create({
        email: email, //Para mandar para o BD
        password: hash
    }).then(() => {
        res.redirect('/')
    }).catch((err) => {
        res.redirect('/')
    })
    } else {
        res.redirect('/admin/users/create')
    }
   })
    /*res.json({email, password})// Para mostrar se está chegando as informações*/
})

module.exports = router