const bodyParser = require("body-parser")
const express = require("express")
const ejs = require('ejs')
const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.json)
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.render("index")
})

app.listen(8080, () => {
    console.log("O servidor está rodando!")
})