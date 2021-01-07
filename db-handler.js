const dns = require('dns');
module.exports = {
    //Returns Promice that verifies URL
    verifyURL: (req,res)=>{
        return new Promise((resolve, reject)=>{
            let host = "";
            res.locals.original = req.body.url;
            try{    
                let requestURL = new URL(res.locals.original);
                host = requestURL.host;
            }
            catch{
                res.send({error: "Invalid URL"});
                reject("URL is Invalid");
            }
            dns.lookup(host, (err,adresses)=>{
                if (err) {
                    res.send({error: "Invalid URL"});
                    reject("URL is Invalid");
                }
                resolve("URL is Valid")
            })
        })
    },


    // Returns Promise that gets the short_url from DB
    getShortURL: (con)=>{
        return new Promise((resolve,reject)=>{
            let sql = "SELECT MAX(short) FROM urls";
            con.query(sql, function (err, result, fields) {
                if (err) reject("Error SELECTING from Database");
                let resutlObj = Object.assign({}, result[0]);
                if(resutlObj['MAX(short)']) resolve(resutlObj['MAX(short)']+1);
                else resolve(1);
            }); 
        })
    },


    // Returns Promise that inserts the {original, short} data to DB
    insertDataToDB: (res, con, shortVal)=>{
        return new Promise((resolve,reject)=>{
            sql = "INSERT INTO urls (original, short) VALUES (? , ?)"
            con.query(sql, [res.locals.original, shortVal], function (err, result) {
                if (err) reject("Error Inserting data to db");
                console.log("URL saved to database successfully")
                res.send({original_url: res.locals.original, short_url: shortVal});
                resolve("Data saved successfully");
            });
        })
    }
}