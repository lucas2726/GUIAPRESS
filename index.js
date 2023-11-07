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
      ],
      limit: 4
    }).then(articles => {
       Category.findAll().then(categories => {
        res.render("index", {articles: articles, categories: categories})/* Aqui, o servidor está respondendo à requisição HTTP renderizando um template chamado "index" e passando dois objetos como dados para o frontend. O objeto articles contém os artigos recuperados da consulta à tabela Article, e o objeto categories contém as categorias recuperadas da consulta à tabela Category. Estes dados podem ser usados no frontend para exibir os artigos e categorias na página.*/
       })
   })
})


app.use("/", categoriesController)
app.use("/", articlesController)

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

  