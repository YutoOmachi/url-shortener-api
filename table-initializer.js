const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "yourpassword@root",
    database: "url_shortener_db"
  });

let sql = "CREATE TABLE urls"+
    "(id INT AUTO_INCREMENT PRIMARY KEY, original varchar(255) NOT NULL, short int NOT NULL)";
con.query(sql, (err, result)=>{
    if(err) throw err;
    console.log("Table is created!")
})
con.end();