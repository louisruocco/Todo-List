const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({path: "./.env"});

const db = mysql.createConnection({
    host: process.env.HOST, 
    user: process.env.USER, 
    password: process.env.PASSWORD, 
    database: process.env.DATABASE
});

db.connect((err) => {
    if(err){
        return console.log(err);
    } else {
        console.log("DB Connected...");
    }
});

module.exports = db;