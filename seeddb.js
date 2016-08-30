var postgresConn = require('./secrets').dbstring;
const fs = require('fs');
var pg = require('pg');

var sql = fs.readFileSync('createtables.sql').toString();
pg.connect(postgresConn, function(err, client, done){
    if(err){
        console.log('error: ', err);
        process.exit(1);
    }
    client.query(sql, function(err, result){
        done();
        if(err){
            console.log('error: ', err);
            process.exit(1);
        }
        process.exit(0);
    });
});