const customExpress = require('./config/customExpress')

const conexao = require('./infraestrutura/conexao')
conexao.connect(err => {
    if(err) {
        console.log(err)
    }
    else {
        console.log('Conectado ao DB MySql com Sucesso')
        
        const app = customExpress()
        app.listen(3000, () => console.log('Server iniciado. Rodando na porta 3000'))
        app.get('/', (req, res) => res.send('Servidor Rodando!! '))
    }
})

