const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "youoma0711",
    database: "url-shortener-db"
  });


function createDatabase(){
    let sql = "CREATE DATABASE url-shortener-db";
    con.query(sql, (err, result, fields)=>{
        if(err) throw err;
    })
}

function createTable(connection){
    let sql = "CREATE TABLE urls"+
        "(id INT AUTO_INCREMENT PRIMARY KEY, original varchar(255) NOT NULL, short int NOT NULL)";
    connection.query(sql, (err, result, fields)=>{
        if(err) throw err;
    })
}
