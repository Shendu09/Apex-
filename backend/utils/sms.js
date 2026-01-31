const twilio = require('twilio');

// Initialize Twilio client only if credentials are properly configured
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  try {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } catch (error) {
    console.warn('⚠️ Twilio initialization failed - running in demo mode');
  }
}

// Send OTP via SMS
exports.sendOTP = async (phoneNumber, otp) => {
  try {
    // In development or if Twilio not configured, just log the OTP
    if (process.env.NODE_ENV === 'development' || !client) {
      console.log(`📱 OTP for ${phoneNumber}: ${otp}`);
      return { success: true, message: 'OTP logged (development mode)' };
    }

    // Format phone number with country code
    const formattedNumber = phoneNumber.startsWith('+91') 
      ? phoneNumber 
      : `+91${phoneNumber}`;

    const message = await client.messages.create({
      body: `Your Farm Bridge OTP is: ${otp}. Valid for 10 minutes. Do not share with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber
    });

    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('SMS Error:', error);
    throw new Error('Failed to send OTP');
  }
};

// Send order notification
exports.sendOrderNotification = async (phoneNumber, orderId, status) => {
  try {
    if (process.env.NODE_ENV === 'development' || !client) {
      console.log(`📱 Order ${orderId} notification: ${status}`);
      return { success: true };
    }

    const formattedNumber = phoneNumber.startsWith('+91') 
      ? phoneNumber 
      : `+91${phoneNumber}`;

    await client.messages.create({
      body: `Farm Bridge: Your order ${orderId} is now ${status}.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber
    });

    return { success: true };
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, error: error.message };
  }
};

// Send delivery notification
exports.sendDeliveryNotification = async (phoneNumber, orderId, eta) => {
  try {
    if (process.env.NODE_ENV === 'development' || !client) {
      console.log(`📱 Delivery notification for order ${orderId}, ETA: ${eta}`);
      return { success: true };
    }

    const formattedNumber = phoneNumber.startsWith('+91') 
      ? phoneNumber 
      : `+91${phoneNumber}`;

    await client.messages.create({
      body: `Farm Bridge: Your order ${orderId} is out for delivery. ETA: ${eta} minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber
    });

    return { success: true };
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, error: error.message };
  }
};
