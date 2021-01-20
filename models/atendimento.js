const moment = require('moment')
const conexao = require ('../infraestrutura/conexao')

class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD hh:mm:ss')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD hh:mm:ss')

        const dataEhValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteEhValido = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: 'data',
                valido: dataEhValida,
                mensagem: 'Data deve ser igual ou superior a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteEhValido,
                mensagem: 'Nome do cliente deve possuir mais de cinco caracteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if(existemErros) {
            res.status(400).json(erros)
        } else {
            const atendimentoDatado = {...atendimento, dataCriacao, data}
        
            const sql = 'INSERT INTO Atendimentos SET ?'

            conexao.query(sql, atendimentoDatado, (err, resultados) => {
            if(err) {
                res.status(400).json(err)
            } else {
                res.status(201).json(atendimento)
            }
        })
        }
               
    }

    lista(res) {
        const sql = 'SELECT * FROM atendimentos'

        conexao.query(sql, (err, resultados) => {
            if(err) {
                res.status(400).json(err)
            } else (
                res.status(200).json(resultados)
            )
        })
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM atendimentos WHERE id=${id}`

        conexao.query(sql, (err, resultados) => {
            const atendimento = resultados[0]
            if(err){
                res.status(400).json(err)
            } else {
                res.status(200).json(atendimento)
            }
        }
        )
    }

    altera(id, valores, res){
        if(valores.data){
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD hh:mm:ss')
        }
        const sql = 'UPDATE atendimentos SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (err, resultados) => {
            if(err){
                res.status(400).json(err)
            } else {
                res.status(200).json({...valores, id})
            }
        })
    }

    deleta(id, res){
        const sql = 'DELETE FROM atendimentos WHERE id=?'

        conexao.query(sql, id, (err, resultados) => {
            if(err) {
                res.status(400).json(err)
            } else {
                res.status(200).json({id})
            }
        })
    }
}

module.exports = new Atendimento