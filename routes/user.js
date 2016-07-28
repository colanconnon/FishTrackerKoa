var router = require("koa-router");
var parse = require("co-body");

var router = require('koa-router')();
var bcrypt = require('co-bcrypt');
var jwt = require('koa-jwt');
var secret = require('../secrets').jwt;

router.post('/public/api/user/login', function* (next) {
    var user = yield parse(this);
    if (!user.username || !user.password) {
        this.throw(401, JSON.stringify({ error: 'Incorrect username or password' }));
        return yield next;
    }
    var users = yield this.pg.db.client.query_(`Select username, hash, id from "users" where "username" = ($1)`, [user.username]);
    users = users.rows;
    if (users.length === 0) {
        this.throw(401, JSON.stringify({ error: 'Incorrect username or password' }));
        return yield next;
    } else {
        if (yield bcrypt.compare(user.password, users[0].hash)) {
            var token = jwt.sign({ "user": users[0].username, id: users[0].id }, secret);
            users[0].token = token;
            delete users[0].hash;
            this.body = users[0];
            this.status = 200;
            return yield next;
        } else {
            this.throw(401, JSON.stringify({ error: 'Incorrect username or password' }));
            return yield next;
        }
    }
});

router.post('/public/api/user/signup', function* (next) {
    var user = yield parse(this);
    if (!user.username) {
        this.throw(400, JSON.stringify({ error: 'Username is required' }));
        return yield next;
    }
    if (!user.password || !(user.confirmpassword === user.password)) {
        this.throw(400, JSON.stringify({ error: 'You must provide a password, and they must match' }));
        return yield next;
    }
    //TODO: Need to check for duplicate usernames;


    //need to hash the password here
    var salt = yield bcrypt.genSalt(10);
    var hash = yield bcrypt.hash(user.password, salt);

    var result = yield this.pg.db.client.query_('INSERT INTO users(username, hash) values($1, $2) RETURNING Id', [user.username, hash])
    //remove the password before returning the response to the view
    user.id = result.rows[0].id;
    delete user.password;
    delete user.confirmpassword;
    this.body = user;
    this.status = 201;
    return yield next;
});

module.exports = router;