// routes/utilidades.js

var express = require('express');
var router = express.Router();
var utilidadesController = require('../controller/utilidades');

/* GET /utilidades/seed - Executa o povoamento inicial */
router.get('/seed', utilidadesController.seed);

module.exports = router;