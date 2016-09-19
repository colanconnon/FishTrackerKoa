'use strict';
var koa = require("koa");

var app = koa();

var router = require("koa-router");
var parse = require("co-body");

var router = require('koa-router')();
var bcrypt = require('co-bcrypt');
var jwt = require('koa-jwt');

router.get('/api/fishcatch/', function* (next) {
  var user = this.state.user;
  var sql = `
    SELECT fishcatch.id, latitude, date_caught, longitude, details, temperature, lake_id, fishcatch.user_id, users.username, lake.lakeName
    FROM fishcatch
    inner join lake on lake.id = lake_id
    inner join users on users.id = fishcatch.user_id
    where fishcatch.user_id = $1;
  `;
  var result = yield this.pg.db.client.query_(sql, [this.state.user.id]);
  this.body = {
    fishCatches: result.rows
  };
  this.status = 200;
  return yield next;
});

router.get('/api/fishcatch/:id', function* (next) {
  var id = this.params.id;
  var sql = `
  SELECT fishcatch.id, latitude, date_caught, longitude, details, temperature, lake_id, fishcatch.user_id, users.username, lake.lakeName
  FROM fishcatch
  inner join lake on lake.id = lake_id
  inner join users on users.id = fishcatch.user_id
  where fishcatch.id = $1 and fishcatch.user_id = $2;
  `;
  var result = yield this.pg.db.client.query_(sql, [id, this.state.user.id]);
  if (result.rows[0]) {
    this.body = result.rows[0];
    this.status = 200;
    return yield next;
  }
  else {
    this.throw(400, { error: "Results don't exist" });
    return yield next;
  }

});


router.post('/api/fishcatch/', function* (next) {
  try {
    var fishCatch = yield parse(this);
    if (typeof fishCatch === 'string') {
      fishCatch = JSON.parse(fishCatch);
    }
    if (!fishCatch.lake_id || !fishCatch.latitude || !fishCatch.longitude) {
      this.throw(400, { error: "Check required fields and try again." });
      return yield next;
    }
    var sql = `
    INSERT INTO public.fishcatch(
     latitude, longitude, details, temperature, lake_id, user_id,date_caught)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING Id;
  `;
    var result = yield this.pg.db.client.query_(sql, [fishCatch.latitude, fishCatch.longitude, fishCatch.details,
      fishCatch.temperature, fishCatch.lake_id, this.state.user.id, fishCatch.date]);
    fishCatch.id = result.rows[0].id;
    this.body = fishCatch;
    this.status = 200;
    return yield next;
  } catch (e) {
    this.throw(400, { error: "Error inserting fish catch into the database, please check all fields and try again!" });
    return yield next;
  }
});

router.put('/api/fishcatch/', function* (next) {
  var fishCatch = yield parse(this);
  if (typeof fishCatch === 'string') {
    fishCatch = JSON.parse(fishCatch);
  }
  var sql = `
      UPDATE fishcatch
        SET latitude=$1, longitude=$2, details=$3, temperature=$4, lake_id=$5
      WHERE id = $6 and user_id = $7;
    `;
  var result = yield this.pg.db.client.query_(sql, [fishCatch.latitude, fishCatch.longitude, fishCatch.details,
    fishCatch.temperature, fishCatch.lake_id, fishCatch.id, this.state.user.id]);
  if (result.rowCount === 1) {
    this.body = fishCatch;
    this.status = 201;
    return yield next;
  } else {
    this.throw(400, { error: "You don't have the permissions to update this object" });
    return yield next;
  }
});

module.exports = router;
