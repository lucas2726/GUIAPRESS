const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require('./database/database')
const categoriesController = require("./categories/categoriesController")
const articlesController = require("./articles/ArticlesController")

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

connection.authenticate()
  .then(() => {
    console.log("Conexão estabelecida com sucesso!")
  }).catch((err) => {
    console.log("Erro ao conectar ao banco de dados", err)
  })

  app.use("/", categoriesController)

  app.use("/", articlesController)

 app.get("/", (req, res) => {
     res.render("index")
 })

 app.listen(8080, () => {
    console.log("O servidor está rodando!")
 })

  