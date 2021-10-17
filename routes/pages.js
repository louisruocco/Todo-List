const e = require("connect-flash");
const express = require("express");
const session = require("express-session");
const db = require("../db");
const router = express.Router();

const redirectLanding = (req, res, next) => {
    if(!req.session.userId){
        return res.redirect("/");
    } else {
        next();
    }
}

const redirectHome = (req, res, next) => {
    if(req.session.userId){
        return res.redirect("/home");
    } else {
        next();
    }
}

router.get("/", redirectHome, (req, res) => {
    const { userId } = req.session;
    res.render("landing");
});

router.get("/login", redirectHome, (req, res) => {
    res.render("login");
})

router.get("/register", redirectHome, (req, res) => {
    res.render("register", {userexists : req.flash("userexists") });
});

router.get("/home", redirectLanding, (req, res) => {
    db.query("SELECT name, email FROM users WHERE id = ?", [req.session.userId], (err, details) => {
        if(err){
            return console.log(err);
        }

        db.query("SELECT todo FROM todos WHERE id = ?", [req.session.userId], (err, todos) => {
            if(err){
                return console.log(err);
            } else {
                res.render("home", {details, todos});
            }
        })
    })
})
module.exports = router;