const Sequelize = require('sequelize')

const connection = new Sequelize ('guiapress', 'root', 'root' ,{
host: 'localhost',
dialect: 'mysql'
})

connection.authenticate()
  .then(() => {
    console.log("Conexão estabelecida com sucesso!")
  }).catch((err) => {
    console.log("Erro ao conectar ao banco de dados", err)
  })

  module.exports = connection