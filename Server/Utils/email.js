import nodemailer from 'nodemailer';

const sendEmail = async ({ sender, email, subject, message }) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: process.env.EMAIL_PORT == 465, 
  });

  // Define email options
  const mailOptions = {
    from: sender,
    to: email,
    subject: subject,
    html: message,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
