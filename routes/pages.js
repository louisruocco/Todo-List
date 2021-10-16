const express = require("express");
const session = require("express-session");
const db = require("../db");
const flash = require("connect-flash");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/register", (req, res) => {
    res.render("register");
});

module.exports = router;