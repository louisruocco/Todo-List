const express = require("express");
const session = require("express-session");
const db = require("../db");
const bcrypt = require("bcrypt")
const flash = require("connect-flash");
const router = express.Router();

router.post("/register", (req, res) => {
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
})

module.exports = router;