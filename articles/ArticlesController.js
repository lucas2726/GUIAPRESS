const express = require('express')
const router = express.Router()

router.get("/articles", (req, res) => {
    res.send("NOTA DE CATEGORIES!")
})

router.get("/admin/articles/new", (req,res) => {
    res.send("NOTA PARA CRIAR UMA NOVA CATEGORIA!")
})

module.exports = router