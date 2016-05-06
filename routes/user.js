var router = require("koa-router");
var parse = require("co-body");

var r = require("rethinkdb");
var router = require('koa-router')();
var bcrypt = require('co-bcrypt');
var jwt = require('koa-jwt');
var secret = require('../secrets').jwt;

router.post('/public/api/user/login', function*(next) {
    var user = yield parse(this);
    
    if(!user.username || !user.password) {
        this.throw(401, 'Incorrect username or password');
        yield next;
    }
    var users = yield this.pg.db.client.query_('Select username, hash, id from users where username = ($1)', [user.username]);
    users = users.rows;
    console.log(users);
  
    if(users.length === 0){
       this.throw(400, 'Incorrect username or password');
    }
    
    if (yield bcrypt.compare(user.password, users[0].hash)) {
        var token = jwt.sign({"user" : users[0].username, id: users[0].id}, secret);
        users[0].token = token;
        delete users[0].hash;
        this.body = users[0];
        this.status = 200;
    } else {
        this.throw(400, 'Incorrect username or password');
    }
});

router.post('/public/api/user/signup', function* (next) {
    var user = yield parse(this);
    if(!user.username) {
        this.throw(400, 'You must provide a username');
    }
    if(!user.password || !(user.confirmpassword === user.password)) {
        this.throw(400, 'You must provide a password, and the passwords must match');
    }
    //need to hash the password here
    var salt = yield bcrypt.genSalt(10);
    var hash = yield bcrypt.hash(user.password, salt);
    
    var result = yield this.pg.db.client.query_('INSERT INTO users(username, hash) values($1, $2) RETURNING Id', [user.username, hash])
    console.log(result);
    //remove the password before returning the response to the view
    user.id = result.rows[0].id;
    delete user.password;
    delete user.confirmpassword;
    this.body = user;
    this.status = 201;
});

module.exports = router;