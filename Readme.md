This is an Api server, connecting to a postgres database

To Setup For running: 
    create a file in the top level directory named secrets.json containing

    module.exports = {  jwt: "secret" , dbstring : 'postgres://username:password@localhost:5432/dbname' }
    
    Make sure you have a postgres instance running.

To Run:
    npm start

Liscense MIT