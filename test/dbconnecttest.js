var mysql = require('mysql');

var connection = mysql.createConnection(process.env.MYSQL_URL);

connection.connect(function(err){
if(err) console.log('connection error:', err);
});
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();
