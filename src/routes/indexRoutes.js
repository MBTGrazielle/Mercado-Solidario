const router = require("express").Router();

router.get("/", (request, response) => {
  response.send({
    versao: "1.0",
    titulo: "Mercado-Solidario",
    descricao:
      "O mercado solidário foi criado para ajudar as famílias que estão vivenciando situação de insegurança alimentar e nutricional, sendo a sua estrutura similar ao mercado convencional. Nesta iniciativa, a família poderá comprar produtos de acordo à sua escolha e necessidade, a partir da utilização de cartão-alimentação com valor máximo de 125 pontos mensais. Os produtos terão pontuações simbólicas e por isso possibilitará a compra equivalente ao dobro de produtos de uma cesta básica. Além do cartão-alimentação, a iniciativa buscará apoio do Centro de Referência de Assistência Social (CRAS), do respectivo município do mercado, para direcionar e ofertar serviços da Assistência Social no SUAS (Sistema Único de Assistência Social) enviando os cadastros das famílias. O Mercado Solidário contará com doações, em produtos, para abastecimento do estoque e será dividido em 4 bancos com rotas públicas e privadas. O primeiro banco será destinado ao cadastro de voluntários para implementação e manutenção do projeto. O segundo irá cadastrar as famílias beneficiárias à iniciativa, sendo a renda familiar per capita de até 1,5 salário mínimo, o terceiro as doações e o quarto será o mercado e o seu estoque.",
  });
});

module.exports = router;
