const mysql = require('mysql');


var pool = mysql.createPool({
    "user" : process.env.MYSQL_USER,//"root",
    "password": process.env.MYSQL_PASSWORD,//"root",
    "database" : process.env.MYSQL_DATABASE,
    "host" : process.env.MYSQL_HOST,//"localhost",
    "port" : process.env.MYSQL_PORT//3306
});
exports.pool = pool;