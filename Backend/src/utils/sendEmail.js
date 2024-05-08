const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendEmail = async (userEmail, name, confirmationCode, subject = "Confirmation code", message = "") => {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  
  // Configurar el transporte para nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });

  // Personalizar el mensaje según el contexto
  const defaultText = `Tu código es ${confirmationCode}, gracias por confiar en nosotros ${name}`;
  const mailOptions = {
    from: email,
    to: userEmail,
    subject,
    text: message || defaultText,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;  // Indicar éxito en el envío
  } catch (error) {
    console.error("Error sending email:", error);
    return false;  // Indicar fallo en el envío
  }
};

module.exports = sendEmail;
