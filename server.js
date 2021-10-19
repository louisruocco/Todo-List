const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const db = require("./db");
const schd = require("./schd/schedule");
const MySQLStore = require("express-mysql-session");
const ejs = require("ejs");
const flash = require("connect-flash");
const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () =>  console.log("Listening at " + port));

dotenv.config({path: "./.env"});

const options = {
    host: process.env.HOST, 
    user: process.env.USER, 
    password: process.env.PASSWORD, 
    database: process.env.DATABASE
}

const sessionStore = new MySQLStore(options);

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.set("view engine", "ejs");
app.use(session({
    name: process.env.SESS_NAME, 
    secret: process.env.SESS_SECRET, 
    store: sessionStore, 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        maxAge: 1000 * 60 * 60 * 1
    }
}));

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));