const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const db = require("../db");

dotenv.config({path: "./.env"});

const sendEmail = schedule.scheduleJob("0 */2 * * *", () => {
    db.query("SELECT * FROM todos", (err, email) => {
        if(err){
            return console.log(err)
        } else {
            const transporter = nodemailer.createTransport({
                service: "gmail", 
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS
                }
            })

            const options = {
                from: process.env.EMAIL,
                to: email.email,
                subject: `TODO ALERT: ${email.todo}`,
                html: `
                <h1>${email.todo} is outstanding</h1>

                <b>Make Sure to tick it off the list when completed!</b>
                `
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