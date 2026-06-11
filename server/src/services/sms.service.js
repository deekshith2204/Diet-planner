const twilio = require("twilio");
const env = require("../config/env");

function getTwilioClient() {
  if (!env.twilioAccountSid || !env.twilioAuthToken || !env.twilioPhoneNumber) {
    const error = new Error("SMS service is not configured");
    error.statusCode = 503;
    throw error;
  }

  return twilio(env.twilioAccountSid, env.twilioAuthToken);
}

async function sendSmsOtp({ phone, otp }) {
  const client = getTwilioClient();

  await client.messages.create({
    body: `Your NutriAI login code is ${otp}. It expires in 5 minutes.`,
    from: env.twilioPhoneNumber,
    to: phone,
  });
}

module.exports = {
  sendSmsOtp,
};
