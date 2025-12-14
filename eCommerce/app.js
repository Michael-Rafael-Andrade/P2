// C:\Dev\Desenvolvimento Back-End-I\P2\eCommerce\app.js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs'); // 🛠️ CORREÇÃO 1: Importação do HBS

// importações
const { sequelize } = require('./model/server.js');

// importar as rotas
// var indexRouter = require('./routes/index');
var rotasEcommerce = require('./routes/rotasEcommerce');
var produtoRouter = require('./routes/produto'); // 🛠️ CORREÇÃO 2: Importação de produtoRouter
var usersRouter = require('./routes/users');
var utilidadesRouter = require('./routes/utilidades');


// ************ REGISTRO DE HELPERS HBS ************
// Helper 'eq' para comparação de igualdade
hbs.registerHelper('eq', function (arg1, arg2) {
  return (arg1 == arg2);
});

// Helper para acessar propriedades de um objeto Misto/JSON (como o 'detalhes' do Produto)
hbs.registerHelper('objectKeys', function (obj) {
  return Object.keys(obj);
});
// ************ FIM REGISTRO DE HELPERS ************

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Sincronização do Sequelize (Cria as tabelas se não existirem)
// OBS: Use force: true apenas para desenvolvimento, pois apaga os dados existentes.
sequelize.sync().then(() => {
  console.log(' Tabelas do banco de dados Relacional sincronizadas.');
}).catch((error) => {
  console.error(' Erro ao sincronizar as tabelas:', error);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// rotas da aplicação --
app.use('/', rotasEcommerce);
app.use('/produto', produtoRouter); // Usa a rota agora importada
app.use('/utilidades', utilidadesRouter);

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;