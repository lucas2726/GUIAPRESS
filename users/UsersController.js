const express = require("express") 
const router = express.Router()
const User = require("./User")
const bcrypt = require("bcryptjs")

router.get("/admin/users", (req, res) => { //Para criar uma rota
    
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users}) //Para enviar os dados para o html para poder usar eles lá
    })
}) // com  "/" = //Para criar uma rota sem "/" = //Para adicionar um arquivo 

router.get("/admin/users/create", (req, res) => { //Para criar uma rota
    res.render("admin/users/create") //Para adicionar um arquivo 
})

router.post("/users/create", (req, res) => {
    let email = req.body.email //Para pegar o "name="email"" de create.js
    let password = req.body.password //Para pegar o "name="password"" de create.js 

   User.findOne({where:{email: email}}).then(user => {
    if (user == undefined) { //Se não existe um usuario com esse email
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
   }) /*res.json({email, password})// Para mostrar se está chegando as informações*/
    
})

router.get("/login", (req, res) => {
    res.render("admin/users/login")
})

router.post("/authenticate", (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({where:{email: email}}).then(user => {
        if (user != undefined) { //Se existe um usuario com esse email
             //Para validar senha
            let correct = bcrypt.compareSync(password, user.password)

        if (correct) {
            req.session.user = {
                id: user.id,
                email: user.email
            }
            res.redirect("/admin/articles")
        } else {
            res.redirect("/login")
        }
    } else {
        res.redirect("/login")
    } 
    })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router