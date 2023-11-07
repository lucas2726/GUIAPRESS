const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require('./database/database')

//Serve para adicionar o router
const categoriesController = require("./categories/categoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./users/UsersController") 

//Serve para adicionar o BD
const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")

//Para dizer para o js usar o ejs como sua view engine
app.set('view engine', 'ejs')

//Para criar os arquivos estáticos
app.use(express.static('public'))

//Para adicionar o body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//Para autenticar a conexão com o BD
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
      ],
      limit: 4
    }).then(articles => {
       Category.findAll().then(categories => {
        res.render("index", {articles: articles, categories: categories})/* Aqui, o servidor está respondendo à requisição HTTP renderizando um template chamado "index" e passando dois objetos como dados para o frontend. O objeto articles contém os artigos recuperados da consulta à tabela Article, e o objeto categories contém as categorias recuperadas da consulta à tabela Category. Estes dados podem ser usados no frontend para exibir os artigos e categorias na página.*/
       })
   })
})


//Para dizer que vamos ultilizar os Controller
app.use("/", categoriesController)
app.use("/", articlesController)
app.use("/", usersController)

app.get('/:slug',(req,res)=>{
  let slug = req.params.slug;
  Article.findOne({
      where:{
          slug:slug
      }
  }).then(article=>{
      if(article!= undefined){
          Category.findAll().then(categories =>{
              res.render('article', {article:article, categories:categories});
          }).catch(error=>{
              console.log(error)
          })
      }else{
          res.redirect('/');
      }
  }).catch(()=>{
      res.redirect('/');
  }).catch(error=>{
      console.log(error)
  })
  
})
app.get('/category/:slug',(req,res)=>{
  let slug = req.params.slug;
  Category.findOne({
      where:{
          slug:slug
      },
      include: [{model: Article}]
  }).then(category=>{
      if(category !=undefined){
          Category.findAll().then(categories =>{
              res.render('index',{articles:category.articles, categories:categories})
          })

      }else{
          res.redirect('/');
      }
  }).catch((error)=>{
      res.redirect('/');
      console.log('erro:' + error)
  })
})

 app.listen(8080, () => {
    console.log("O servidor está rodando!")
 })

  