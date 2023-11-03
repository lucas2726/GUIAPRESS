const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const ejs = require('ejs')
const connection = require('./database/database')

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.json)
app.use(bodyParser.urlencoded({extended: false}))

app.get("/", (req, res) => {
    res.render("index")
})

app.listen(8081, () => {
    console.log("O servidor está rodando!")
})

  