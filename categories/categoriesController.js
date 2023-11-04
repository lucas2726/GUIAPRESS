const express = require('express')
const router = express.Router()
const Category = require("./Category")
const slugify = require("slugify")

router.get("/admin/categories/new", (req,res) => {
    res.render("admin/categories/new") //Nome da pasta ejs
})

router.post("/categories/save", (req, res) => {
    let title = req.body.title
    if(title != undefined) { 

       Category.create({
        title: title,
        slug:slugify(title) //"Computação e informatica" => "computacao-e-informatica"(Transforma em url)
       }).then(() => {
         res.redirect("/admin/categories")
       })
    } else {
        res.redirect("/admin/categories/new")
    }
})

router.get("/admin/categories", (req, res) => {

    Category.findAll().then(categories => {
      res.render("admin/categories/index", {categories: categories})
    })
})

router.post("/categories/delete", (req,res) => {
  let id = req.body.id
    if(id != undefined) { //Se não estiver vazio
      if(!isNaN(id)) { //Significa não é um número

        Category.destroy ({//Para deletar uma categoria
          where: {
            id:id
          }
        }).then(() => {
           res.redirect("/admin/categories")
        })

      }else { //Se não for um número
        res.redirect("/admin/categories")
    }
    }else { //Se for Null
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories/edit/:id", (req, res) => {
  let id = req.params.id

    if (isNaN(id)) {
      res.redirect("/admin/categories")
    }

  Category.findByPk(id).then(category => {//Para pesquisar no BD pelo id da categoria
    if(category != undefined) {
      res.render("admin/categories/edit",{category: category})//Para passar os dados da categoria
    } else {
      res.redirect("/admin/categories")
    }
  }).catch(erro => {
      res.redirect("/admin/categories")
  }) 
})

module.exports = router