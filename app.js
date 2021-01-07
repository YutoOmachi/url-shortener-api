const express = require('express');
const mysql = require('mysql');
const dns = require('dns');
const { Console } = require('console');
const dbHandler = require('./db-handler');

const app = express();
const con = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "yourpassword@root",
    database: "url_shortener_db"
  });


const hostname = '127.0.0.1';;
const port = process.env.PORT || 3000;


app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));


//Showing the main page
app.get('/', (req,res)=> {
    res.sendFile(__dirname+'/views/index.html')
})


//When new URL is posted
app.post('/api/shorturl/new', 
    async (req,res,next)=>{
        try{
            await dbHandler.verifyURL(req,res);
            next();
        }
        catch(err){
            return console.log(err);
        }
    },
    async (req,res)=>{
        try{
            const shortVal = await dbHandler.getShortURL(con);
            dbHandler.insertDataToDB(res,con, shortVal);  
        }
        catch(err){
            return console.log(err)
        }
    }
)


//Handles redirection to the url that is in the database
app.get("/api/shorturl/:short_url?", (req,res)=>{
    let urlString = ""
    let sql = "SELECT * FROM urls WHERE short=?";
    con.query(sql, [req.params.short_url], (err, result, fields)=>{
        if(err) throw err;
        if(result){
            let resultObj = Object.assign({}, result[0]);
            urlString = resultObj.original;
        }
        res.redirect(urlString);
    })
})


//Shows the full list of short urls
app.get("/api/fulllist", (req,res)=>{
    let sql = "SELECT * FROM urls";
    let list = [];
    con.query(sql, [req.params.short_url], (err, result, fields)=>{
        if(err) throw err;
        res.send(result); 
    })
})


app.listen(port, ()=>{
    console.log('Server running at http://'+ hostname + ':' + port + '/');
})