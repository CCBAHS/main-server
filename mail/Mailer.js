require('dotenv').config()
const nodemailer = require('nodemailer');

const sendCustomMail = (reciever, subject, htmlText)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAILER_ID,
          pass: process.env.MAILER_PASSWORD
        }
      });
      
      const mailOptions = {
        from: process.env.MAILER_ID,
        to: reciever,
        subject: subject,
        html: htmlText
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = {sendCustomMail};
