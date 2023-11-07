const Sequelize = require("sequelize")
const connection = require("../database/database")

const User = connection.define("users",/* Será usado para chamar no index e html */ {
 email:{
    type: Sequelize.STRING, /*Campos que vai ter na tabela e o tipo deles*/
    allowNull: false
},password:{
    type: Sequelize.STRING,
    allowNull: false
}
})

/*
force: false = Só cria a tabela se ela existe;
force: true = Criar a tabela do zero toda vez que for entrar 
*/

module.exports = User