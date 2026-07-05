const nodemailer = require("nodemailer");
const env = require("../config/env");

function getTransporter() {
  if (!env.gmailUser || !env.gmailAppPassword) {
    const error = new Error("Email service is not configured");
    error.statusCode = 503;
    throw error;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    auth: {
      user: env.gmailUser,
      pass: env.gmailAppPassword,
    },
  });
}

async function sendEmailOtp({ email, name, otp }) {
  const transporter = getTransporter();

  try {
    await transporter.sendMail({
      from: `"NutriAI" <${env.gmailUser}>`,
      to: email,
      subject: "Verify your NutriAI email",
      text: `Hi ${name}, your NutriAI verification code is ${otp}. It expires in 5 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
          <h2>Verify your NutriAI email</h2>
          <p>Hi ${name}, use this code to finish creating your account:</p>
          <p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p>
          <p>This code expires in 5 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });

    return { delivered: true };
  } catch (error) {
    if (env.nodeEnv === "development") {
      console.warn("Email delivery failed. Development OTP fallback enabled.");
      console.warn(`NutriAI OTP for ${email}: ${otp}`);
      return { delivered: false, fallback: "console" };
    }

    const deliveryError = new Error(
      "Email delivery failed. Check the Gmail address and app password in Render environment variables."
    );
    deliveryError.statusCode = 502;
    throw deliveryError;
  }
}

module.exports = {
  sendEmailOtp,
};
