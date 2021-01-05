const express = require('express');
const mysql = require('mysql');
const dns = require('dns');

const app = express();
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "youoma0711",
    database: "url-shortener-db"
  });

const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

//Showing the main page
app.get('/', (req,res)=> {
    res.sendFile(__dirname+'/views/index.html')
})

//When new URL is posted
// app.post('/api/shorturl/new', (req,res, next)=>{
//     let host = "";
//     res.locals.original = req.body.url;
//     try{    
//         let requestURL = new URL(res.locals.original);
//         host = requestURL.host;
//     }
//     catch{
//         res.send({error: "Invalid URL"});
//         return;
//     }
//     dns.lookup(host, (err,adresses)=>{
//         if (err) {
//             res.send({error: "Invalid URL"});
//             return;
//         }
//     })
//     next();
// }, (req,res,next)=>{
//     let shortVal = 1;
//     con.connect((err)=>{
//         if (err) throw err;
//         let sql = "SELECT COALESCE(MAX(short),0) FROM urls";
//         con.query(sql, function (err, result, fields) {
//             if (err) throw err;
//             let resutlObj = Object.assign({}, result[0]);
//             shortVal = resutlObj['COALESCE(MAX(short),0)']+1;
//         });
//         sql = "INSERT INTO urls (original, short) VALUES (? , ?)"
//         con.query(sql, [res.locals.original, shortVal], function (err, result) {
//             if (err) throw err;
//         });
//     });
//     res.locals.short = shortVal;
//     next();
// }, (req,res)=>{
//     res.send({original_url: res.locals.original, short_url: res.locals.short})
// })


app.get("/api/shorturl/:short_url?", (req,res, next)=>{
    let urlString = ""
    con.connect((err)=>{
        if(err) throw err;
        let sql = "SELECT * FROM urls WHERE short=?";
        con.query(sql, [req.params.short_url], (err, result, fields)=>{
            if(err) throw err;
            if(result){
                let resultObj = Object.assign({}, result[0]);
                urlString = resultObj.original;
            }
        })
        console.log(urlString);
    })
    res.locals.original = urlString;
    next();
}, (req,res)=>{
    console.log(res.locals.original);
    res.redirect(res.locals.original);
})

app.listen(port, ()=>{
    console.log('Server running at http://'+ hostname + ':' + port + '/');
})