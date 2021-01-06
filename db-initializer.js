const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "yourpassword@root",
  });

let sql = "CREATE DATABASE url_shortener_db";
con.query(sql, (err, result, fields)=>{
    if(err) throw err;
    console.log("Database is created!")
})
con.end();