var mysql = require('mysql2');
var connection = mysql.createConnection({
 host:'localhost',
 user:'root',
 password:'root',
 database:'cwp'
});
connection.connect(function(error){
 if(!!error) {
  console.log(error);
 } else {
  console.log('Database Connected Successfully..!!');
 }
});

module.exports = connection;
