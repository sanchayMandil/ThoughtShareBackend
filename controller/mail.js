require('dotenv').config(); // Load environment variables
const users = require("../models/users");
const axios = require('axios');
async function verifyemial(req, res) {
  const Uemail = req.body.email;
  const query = { email: Uemail };

  try {
    const existingUser = await users.findOne(query); // Use findOne, not find

    if (existingUser) {
      console.log("User already exists:", existingUser.username);
      return res.json({ allow: false }); // User exists, don't send email
    } else {
      console.log("User not found, sending email with OTP");
      
      const response = await axios.post(process.env.MAIL_SERVICE_URL, { email: Uemail , appName:"ThoughtShare"});
      console.log("Email service response:", response.data);
      return res.json({ allow: response.data.allow , otp: response.data.opt }); // User doesn't exist, email sent
     
    }
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).send("Internal server error"); // Handle errors gracefully
  }
}

module.exports = verifyemial;
