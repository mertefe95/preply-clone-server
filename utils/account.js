const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
require('dotenv').config({
  path: `${__dirname}/../.env`
})

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY
  })
)

const sendForgotPassword = (user, forgotT) => {
  const url = `http://localhost:3000/change-password/${forgotT}`

  transport.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: `<${user.email}`,
    subject: 'Forgot password email',
    html: `Please click the link to change your password. <a href=${url}> ${url} </a>`
  })
}


const sendWelcomeEmail = (user) => {
  
  transport.sendMail({
    from: process.env.EMAIL,
    to: `<${user.email}`,
    subject: "",
    html: ""
  })
}


const sendVerificationEmail = (user) => {
  const url = `http://localhost:3000/user-activated/${user.activationKey}`

  transport.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: `<${user.email}`,
    subject: "Verification Email",
    html: `Please click the link to verify your email. <a href=${url}> ${url}</a>`
  })
}


module.exports = {
  sendForgotPassword,
  sendWelcomeEmail,
  sendVerificationEmail
}