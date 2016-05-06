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

app.use(cors())



app.use(jwt({secret: secret, key: 'user'}).unless({path: [/^\/public/]}))


app
  .use(fishcatchroutes.routes())
  .use(fishcatchroutes.allowedMethods())

app
  .use(userroutes.routes())
  .use(userroutes.allowedMethods())

app
  .use(lakeroutes.routes())
  .use(lakeroutes.allowedMethods())

app.listen(3000);

console.log('the app is listening on port 3000')
console.log(secret)