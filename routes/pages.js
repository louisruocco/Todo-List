const express = require("express");
const session = require("express-session");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
    const { userId } = req.session;
    res.render("landing");
});

router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/register", (req, res) => {
    res.render("register", {userexists : req.flash("userexists") });
});

module.exports = router;