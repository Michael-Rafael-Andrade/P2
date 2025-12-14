var express = require('express');
var router = express.Router();

// Importa o Controller que irá lidar com a lógica
var indexController = require('../controller/index');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* GET home page. */
// A rota raiz (/) chama o método "index" do controller
router.get('/', indexController.index);

module.exports = router;
