const express = require("express");
const session = require("express-session");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const db = require("../db");

dotenv.config({path: "./.env"});

const sendEmail = schedule.scheduleJob("0 */2 * * *", () => {
    db.query("SELECT DISTINCT email FROM todos", (err, email) => {
        if(err){
            return console.log(err)
        } else {
            email.map(todo => {
                return db.query("SELECT email, todo FROM todos WHERE email = ?", [todo.email], (err, item) => {
                    if(err){
                        return console.log(err);
                    } else {
                        const transporter = nodemailer.createTransport({
                            service: "gmail", 
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.PASS
                            }
                        })
            
                        const items = item.map(todo => {
                            return `<li>${todo.todo}</li>`
                        })
            
                        const html = `
                            <h1>Outstanding Todos:</h1>
                            <ul>
                                ${items.join("")}
                            </ul>
                        `
                        
                        const options = {
                            from: process.env.EMAIL,
                            to: todo.email,
                            subject: "TODO LIST ALERT", 
                            html,
                        };
            
                        transporter.sendMail(options, (err, info) => {
                            if(err){
                                return console.log(err);
                            } else {
                                console.log("sent: " + info.response);
                            }
                        })
                    }
                })
            })            
        }   
    })
})