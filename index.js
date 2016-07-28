var koa = require('koa')
var app = koa()
var router = require('koa-router')()
var jwt = require('koa-jwt')
var userroutes = require('./routes/user')
var fishcatchroutes = require('./routes/fishcatch')
var lakeroutes = require('./routes/lake')
var secret = require('./secrets').jwt
var cors = require('kcors')
var koaPg = require('koa-pg')
var postgresConn = require('./secrets').dbstring

app.use(koaPg(postgresConn))
app.use(function* (next) {
  try {
    this.set("Access-Control-Allow-Origin", "*");
    this.set("Access-Control-Allow-Credentials", "true");
    this.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT");
    this.set("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept");
    this.set("Content-Type","application/json");
    if (this.method === 'OPTIONS') {
      this.status = 204;
    } else {
      yield next;
    }
  } catch(err) {
    this.set( "Access-Control-Allow-Origin", "*");
    this.set("Access-Control-Allow-Credentials", "true");
    this.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT");
    this.set("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept");
    this.status = err.status || 500;
    this.body = err.message;
    this.set("Content-Type","application/json");
  }
 

});



app.use(jwt({ secret: secret, key: 'user' }).unless({ path: [/^\/public/] }))


app
  .use(fishcatchroutes.routes())
  .use(fishcatchroutes.allowedMethods())

app
  .use(userroutes.routes())
  .use(userroutes.allowedMethods())

app
  .use(lakeroutes.routes())
  .use(lakeroutes.allowedMethods())

app.listen(3005);

console.log('the app is listening on port 3000');
