'use strict';
var koa = require("koa");
var app = koa();
var router = require("koa-router");
var parse = require("co-body");

var r = require('rethinkdb');
var router = require('koa-router')();

router.get('/', function*(){
    this.body = "test123";
    this.status = 200;    
});

router.get('/api/lake/:id', function*() {
   var id = this.params.id;
  
   var sql = 'select lake.id as id,user_id, lakename,username from lake inner join users on user_id = users.id where user_id = $1 and lake.id = $2';
   var lake = yield this.pg.db.client.query_(sql,[this.state.user.id, id]);
   lake = lake.rows[0];
   if(lake) {
       this.body = lake;
       this.status = 200;
   } else {
       this.throw(400, "You don't have permissions to view this object");
   }
});

router.post('/api/lakes/newlake', function* () {
    var lake = yield parse(this);
    if(typeof lake === 'string') {
        lake = JSON.parse(lake);
    }
    var user = this.state.user.id;
    lake.username = user;
   
    if(!lake.name){
        this.throw(400, "Lake name must be filled out!");
    }
    var sql = 'INSERT INTO lake(lakeName, user_id) values($1, $2) RETURNING Id';
    var data = yield this.pg.db.client.query_(sql, [lake.name, user]);
    lake.id = data.rows[0].id;
    lake.userId = user;
    this.status = 201;
    this.body = lake;
});

router.get('/api/lakes/getlakes', function *(){ 
    var user = this.state.user;
    var sql = 'select lake.id as id,user_id, lakename,username from lake inner join users on user_id = users.id where user_id = $1';
    var lakes = yield this.pg.db.client.query_(sql,[this.state.user.id]);
    lakes = lakes.rows;
    this.body = {
        lakes: lakes
    };
    this.status = 200;
});

router.put('/api/lakes/update', function* () {
   var lake = yield parse(this);
   var user = this.state.user;
   if(typeof lake === 'string') {
       lake = JSON.parse(lake);
   }
   var sql = 'update lake set (lakeName) = ($1) where id = $2 and user_id = $3';
   var result = yield this.pg.db.client.query_(sql, [lake.name, lake.id, this.state.user.id]);
   console.log(result);
   if(result.rowCount !== 0) {
        this.body = lake;
        this.status = 201;
   }
   else {
       this.throw(400, "Error updating a record in the database");
   }
  
  
});

module.exports = router;