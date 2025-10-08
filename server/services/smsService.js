const twilio = require("twilio");

// Initialize Twilio client
let twilioClient = null;

const initializeTwilio = () => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      console.warn(
        "Twilio credentials not configured. SMS notifications will be disabled."
      );
      return null;
    }

    twilioClient = twilio(accountSid, authToken);
    console.log("Twilio initialized successfully");
    return twilioClient;
  } catch (error) {
    console.error("Error initializing Twilio:", error.message);
    return null;
  }
};

/**
 * Send SMS notification to a helper (NGO or Volunteer)
 * @param {String} phoneNumber - Recipient's phone number
 * @param {Object} emergencyData - Emergency request details
 * @returns {Object} - Message delivery status
 */
const sendEmergencySMS = async (phoneNumber, emergencyData) => {
  if (!twilioClient) {
    twilioClient = initializeTwilio();
  }

  if (!twilioClient) {
    console.log("SMS simulation mode - Twilio not configured");
    return {
      success: false,
      simulated: true,
      message: "SMS not sent - Twilio not configured",
    };
  }

  try {
    const { userName, userPhone, emergencyType, description, location } =
      emergencyData;

    // Create Google Maps link for location
    const locationLink = `https://www.google.com/maps?q=${location.coordinates[1]},${location.coordinates[0]}`;

    // Compose SMS message
    const message = `
🚨 EMERGENCY ALERT 🚨

Person: ${userName}
Phone: ${userPhone}
Type: ${emergencyType.toUpperCase()}
Details: ${description}

Location: ${location.address || "Address not available"}
Map: ${locationLink}

Please respond immediately if you can help.
    `.trim();

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`SMS sent successfully to ${phoneNumber}. SID: ${result.sid}`);

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
      to: phoneNumber,
    };
  } catch (error) {
    console.error(`Error sending SMS to ${phoneNumber}:`, error.message);
    return {
      success: false,
      error: error.message,
      to: phoneNumber,
    };
  }
};

/**
 * Send SMS notifications to multiple helpers
 * @param {Array} helpers - Array of helpers (NGOs/Volunteers) with phone numbers
 * @param {Object} emergencyData - Emergency request details
 * @returns {Array} - Array of delivery statuses
 */
const sendBulkEmergencySMS = async (helpers, emergencyData) => {
  const promises = helpers.map((helper) => {
    const phoneNumber = helper.phone;
    return sendEmergencySMS(phoneNumber, emergencyData);
  });

  const results = await Promise.allSettled(promises);

  return results.map((result, index) => ({
    helperId: helpers[index]._id,
    helperName: helpers[index].name || helpers[index].organizationName,
    phone: helpers[index].phone,
    status:
      result.status === "fulfilled"
        ? result.value
        : { success: false, error: result.reason },
  }));
};

/**
 * Send status update SMS
 * @param {String} phoneNumber - Recipient's phone number
 * @param {String} status - Status message
 * @returns {Object} - Delivery status
 */
const sendStatusUpdateSMS = async (phoneNumber, status) => {
  if (!twilioClient) {
    twilioClient = initializeTwilio();
  }

  if (!twilioClient) {
    return { success: false, simulated: true };
  }

  try {
    const message = `Emergency Request Update: ${status}`;

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return {
      success: true,
      messageId: result.sid,
    };
  } catch (error) {
    console.error("Error sending status SMS:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  initializeTwilio,
  sendEmergencySMS,
  sendBulkEmergencySMS,
  sendStatusUpdateSMS,
};
