const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require('./database/database')

const categoriesController = require("./categories/categoriesController")
const articlesController = require("./articles/ArticlesController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")

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

  //articles 1
  app.get("/", (req, res) => { 
    Article.findAll({
      order:[
        ['id','DESC']
      ]
    }).then(articles => {
       Category.findAll().then(categories => {
        res.render("index", {articles: articles, categories: categories})//{articles: articles} Serve para mandar os dados para o front nesse caso index
       })
   })
})

app.use("/", categoriesController)
app.use("/", articlesController)

app.get("/:slug", (req, res) => {
  let slug = req.params.slug
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if (article != undefined) {
      Category.findAll().then(categories => {
        res.render("index", {article: article, categories: categories})//{articles: articles} Serve para mandar os dados para o front nesse caso index //Article passa para article a var article 
       })
    } else {
      res.redirect("/")
    }
  }).catch(err => {
    res.redirect("/")
  })
})

 app.listen(8080, () => {
    console.log("O servidor está rodando!")
 })

  