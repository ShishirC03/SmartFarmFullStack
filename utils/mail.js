const nodemailer = require("nodemailer") 
exports.generateOTP = () =>{
    let otp = ''
    for(let i=0;i<=5;i++){
        const randVal = Math.round(Math.random()*9)
        otp =otp+randVal

    }
    return otp;
}

exports.transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "farmguardhelp@gmail.com",
    pass: "fguyjrkaitwvgphu",
  },
  },
);

exports.generateOtpEmailTemplate = code => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FarmGuard OTP Login</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f7f9;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background: #2e7d32;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 25px;
        text-align: center;
      }
      .content h2 {
        font-size: 22px;
        margin-bottom: 15px;
        color: #2e7d32;
      }
      .otp-box {
        display: inline-block;
        font-size: 28px;
        letter-spacing: 8px;
        padding: 15px 25px;
        background: #e8f5e9;
        border: 2px dashed #2e7d32;
        border-radius: 6px;
        margin: 20px 0;
        font-weight: bold;
        color: #1b5e20;
      }
      .footer {
        background: #f1f1f1;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #666;
      }
      @media only screen and (max-width: 620px) {
        .container {
          width: 90%;
        }
        .otp-box {
          font-size: 22px;
          letter-spacing: 5px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>FarmGuard</h1>
      </div>
      <div class="content">
        <h2>Your One-Time Password (OTP)</h2>
        <p>Use the OTP below to securely log in to your AgroProtector account.</p>
        <div class="otp-box">${code}</div>
        <p>This OTP is valid for the next <strong>15 minutes</strong>. Do not share it with anyone.</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} AgroProtector. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
