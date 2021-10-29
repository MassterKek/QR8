var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');
require('express-validator')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// API routes
var apiQueryRouter = require('./database/routes/db.query.routes');
var apiEventsRouter = require('./database/routes/db.events.routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({
  layoutsDir: path.join(__dirname, '/views/layouts'),
  defaultLayout: "index",
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Front End Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Internal API Routes
app.use('/api/v1/query', apiQueryRouter);
app.use('/api/v1/event', apiEventsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  const message = err.message;
  const error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {message, error});
});

module.exports = app;
