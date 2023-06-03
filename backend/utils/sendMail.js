const nodeMailer = require("nodemailer");
module.exports.SendMail = async (options) => {
  const transporter = await nodeMailer.createTransport({
    PORT: process.env.SMPT_PORT,
    host: process.env.SMPT_HOST,
    service: process.env.SMPT_SERVICE,
    secure: true,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.mailMessage,
  };
  await transporter.sendMail(mailOptions);
};
