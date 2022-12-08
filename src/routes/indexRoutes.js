const router = require('express').Router()

router.get('/', (req, res) => {
    res.send({
        'versao': '1.0',
        'titulo': 'projeto-final-ensinaElas',
        'descricao': 'Este projeto reúne um banco de dados com iniciativas sobre educação sexual que foram criadas por mulheres ou instituições que realizam oficinas, palestras ou  artigos sobre a saúde, psicologia e orientações sobre o corpo feminino, despertando de forma positiva, com o objetivo de democratizar e facilitar o acesso de crianças e jovens a terem conhecimento sobre o seu corpo e seu pertencimento dentro de uma sociedade mais acolhedora.'
    })
})

module.exports = router