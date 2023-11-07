const express = require('express')
const router = express.Router()
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")

router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles})
    })  
})

router.get("/admin/articles/new", (req,res) => {
    Category.findAll().then(categories => {
       res.render("admin/articles/new", {categories: categories})
    })
   
})

/*router.post("/articles/save", (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

   Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category
   }).then(() => {
    res.redirect("/admin/articles")
   })
})
*/

router.post('/admin/articles/save', (req, res) => {
  const slug = slugify(req.body.title, { lower: true, strict: true });
  const { title, body, category } = req.body;
  Article.create({
    title, slug, body, categoryId: category,
  }).then(() => {
    res.redirect('/admin/articles');
  })
})

router.post("/articles/delete", (req,res) => {
    let id = req.body.id
      if(id != undefined) { //Se não estiver vazio
        if(!isNaN(id)) { //Significa não é um número
  
         Article.destroy ({//Para deletar um artigo
            where: {
              id:id
            }
          }).then(() => {
             res.redirect("/admin/articles")
          })
        }else { //Se não for um número
          res.redirect("/admin/articles")
      }
      }else { //Se for Null
          res.redirect("/admin/articles")
      }
  })
  
 router.get("/admin/articles/edit/:id", (req, res) => {
    let id = req.params.id
    Article.findByPk(id).then(article => { //Para pesquisar pelo id
      if (article != undefined) {
        Category.findAll().then(categories => {
          res.render("admin/articles/edit", {article: article, categories: categories})
        }) 
      } else {
        res.redirect("/")
      }
    }).catch(err => {
      res.redirect("/")
    })
  })

 router.post("/articles/update", (req, res) => {
  let id= req.body.id
  let title = req.body.title
  let body = req.body.body
  let categoru = req.body.category

  Article.update({title: title, body: body, categoryId: category, slug:slugify(title)}, {
    where: {
      id: id
    }
  }).then(() => {
    res.redirect("/admin/articles")
  }).catch(err => {
    res.redirect("/")
  })
 })

 router.get("/articles/page/:num", (req, res) => {
  let page = req.params.num

  if (isNaN(page) || page == 1) {
    offset = 0
  } else {
    offset = (parseInt(page) - 1) * 4
  }
  Article.findAndCountAll({
    limit:4,
    offset: offset,
    order: [
      ['id', 'DESC']
    ]
  }).then(articles => {
  let next
  if(offset + 4 >= articles.count) {
    next = false
  } else {
    next = true 
  }

  let result = {
    page: parseInt(page),
    next: next,
    articles: articles
  }

  Category.findAll().then(categories => {
    res.render("admin/articles/page", {result: result, categories: categories})
  })

  })
 })
 //Retorna todos os elementos da tabela e mostra a quantidade

module.exports = router