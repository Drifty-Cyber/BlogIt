const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    // this.firstName = user.name.split(' ')[0];
    this.firstName = user.username;
    this.url = url;
    this.from = `Raphael Fadimu <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send email for google drive
  gmailTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async sendGmail(template, subject) {
    const html = pug.renderFile(
      // `${__dirname}/../../views/emails/${template}.pug`,
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.gmailTransport().sendMail(mailOptions);
  }

  async sendPasswordResetGmail() {
    await this.sendGmail(
      'passwordReset',
      'Your password reset token (Valid for only 10 minutes)'
    );
  }

  // SENDING DEVELOPMENT MAILS
  // Send the actual Email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2) Define Email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // 3) Create a transport and send Email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to BlogIt');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (Valid for only 10 minutes)'
    );
  }
};

// const sendEmail = async (options) => {
//   // 1) Create transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   // 2) Define email options
//   const mailOptions = {
//     from: 'Raphael Fadimu <raphael@BlogIt.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   // 3) Send email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
