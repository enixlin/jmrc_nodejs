<<<<<<< HEAD
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var localStategy = require("passport-local").Strategy;
var session = require("express-session");
var authority = require("./service/AuthService");

var app = express();

// 启用session中间件
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    //将session的过期时间设定为一小时
    cookie: { maxAge: 60 * 60 * 1000 },
    saveUninitialized: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "public"));
//设置模板的后缀是html
app.engine("html", require("ejs").renderFile);
//指定总模板
app.set("view engine", "html");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public/front/jmrc_front")));
app.use(
  express.static(
    require("path").join(__dirname, "public/front/jmrc_front/dist")
  )
);

function checkAuth(req, res, next) {
  if (!req.session.userid) {
    res.send("你还没有登录,不允许访问!!--------<a href='/login'>登录</a>");
  } else {
    next();
  }
}

// 以下是请求的路由
app.use("/", require("./routes/LoginController"));
app.use("/users", require("./routes/UserController"));
app.use("/settlement", require("./routes/SettlementController"));
// app.use("/settlement", checkAuth, require("./routes/SettlementController"));
app.use("/login", require("./routes/LoginController"));
app.use("/file", require("./routes/file"));
app.use("/feature", checkAuth, require("./routes/feature"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
=======
var createError = require('http-errors');
var express = require('express');
var ejs = require('ejs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var controllerRouter = require('./routes/controller');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', controllerRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
>>>>>>> a7f99fdf883d027c56c6b883ff88ae64289028b3
});

// error handler
<<<<<<< HEAD
app.use(function (err, req, res, next) {
=======
app.use(function(err, req, res, next) {
<<<<<<< HEAD
>>>>>>> ff525cd7e5718d690accc446ec90e34341248e75
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  let error = res.locals.error;
  let message = res.locals.message;
  // render the error page
  res.status(err.status || 500);
  res.render("error", { message, error });
});

module.exports = app;
=======
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
>>>>>>> a7f99fdf883d027c56c6b883ff88ae64289028b3
