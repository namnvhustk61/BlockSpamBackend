var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var blockphoneRouter = require('./routes/blockphone.controller');
var login = require('./routes/login.js');

var mid_check_jwt_token = require('./routes/middleware/mid_check_jwt_token.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/login', login);

app.use(function (req, res, next) {
    if(ERR){
      res.send(ERR);
    }
  next();
});
app.use(mid_check_jwt_token);

app.use('/', indexRouter);
app.use('/blockphone', blockphoneRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*
 * 
 * 
 * 
 * 
 */

/////  ---- CONNECT TO DB ---------
var mysql      = require('mysql');

/*  https://client.123host.vn/  */
// var db_config = {
//   host     : '103.97.125.254',
//   user     : 'blockspq_admin',
//   password : 'vietnam999999999',
//   database : 'blockspq_PhoneSpam'
// }

var db_config = {
  host     : 'us-cdbr-east-03.cleardb.com',
  user     : 'bd1afe430caaca',
  password : '0e16a215',
  database : 'heroku_962c345ae8a3819'
}

var ERR ;

var connectionMysqlDb;

function handleDisconnect() {
    connectionMysqlDb = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.

    connectionMysqlDb.connect(function(err) {              // The server is either down
      if(err) {   
        ERR = err.toString()                                  // or restarting (takes a while sometimes).
        // console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 5000); // We introduce a delay before attempting to reconnect,
        console.log("____NOT  CONNECTED MYSQL DB____");
        console.log( ERR);
      }else{
        ERR = null;
        console.log("____CONNECTED MYSQL DB____");
      }
                                           // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connectionMysqlDb.on('error', function(err) {
      // console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        // throw err;                                  // server variable configures this)
      }
    });
}

handleDisconnect();

//--------- END___CONNECT TO DB ---------






// --------- Exports -----------------------//
module.exports = {
  app: app,
  conDB: function(){
    return connectionMysqlDb;
  },
};
