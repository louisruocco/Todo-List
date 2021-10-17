const express = require("express");
const session = require("express-session");
const db = require("../db");
const bcrypt = require("bcrypt")
const flash = require("connect-flash");
const router = express.Router();

const redirectHome = (req, res, next) => {
    if(req.session.userId){
        return res.redirect("/home");
    } else {
        next();
    }
}

router.post("/register", redirectHome, (req, res) => {
    const { username, email, password } = req.body;
    db.query("SELECT email FROM users WHERE email = ?", [email], async (err, user) => {
        if(err){
            return console.log(err);
        }

        if(user.length > 0){
            req.flash("userexists", "User Already Exists");
            return res.redirect("/register");
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        db.query("INSERT INTO users SET ?", {name: username, email: email, password: hashedPassword}, (err) => {
            if(err){
                return console.log(err)
            } else {
                res.send("User Successfully Registered");
            }
        })
    })
});

router.post("/login", redirectHome, (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE name = ?", [username], async (err, user) => {
        if(err){
            return console.log(err);
        }

        if(user[0] === undefined){
            req.flash("usernotfound", "User Not Found");
            return res.redirect("/login");
        }

        if(!user || !(await bcrypt.compare(password, user[0].password))){
            return res.send("User Not Found");
        } else {
            const id = user[0].id;
            req.session.userId = id;
            res.redirect("/home");
        }
    })
})

module.exports = router;