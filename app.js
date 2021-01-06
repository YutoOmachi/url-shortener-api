const express = require('express');
const mysql = require('mysql');
const dns = require('dns');
const { Console } = require('console');

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

//CallBack get url short version
function getShortURL(req,res,cb){
    let sql = "SELECT MAX(short) FROM urls";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        let resutlObj = Object.assign({}, result[0]);
        let shortVal = 1;
        if(resutlObj['MAX(short)']) shortVal = resutlObj['MAX(short)']+1;    
        cb(shortVal)
    });
}

//Evaluates if the given string is valid url
function verifyURL(req,res, next){
    let host = "";
    res.locals.original = req.body.url;
    try{    
        let requestURL = new URL(res.locals.original);
        host = requestURL.host;
    }
    catch{
        res.send({error: "Invalid URL"});
        return;
    }
    dns.lookup(host, (err,adresses)=>{
        if (err) {
            res.send({error: "Invalid URL"});
        }
        else{
            next();
        }
    })
}

//When new URL is posted
app.post('/api/shorturl/new', 
    (req,res,next)=>{
        verifyURL(req,res,next);
    },
    (req,res)=>{
        getShortURL(req,res,(shortVal)=>{
            sql = "INSERT INTO urls (original, short) VALUES (? , ?)"
            con.query(sql, [res.locals.original, shortVal], function (err, result) {
                if (err) throw err;
                console.log("URL saved to database successfully")
                res.send({original_url: res.locals.original, short_url: shortVal});
                return;
            });
        })
})


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