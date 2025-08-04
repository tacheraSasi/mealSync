import axios from 'axios';

interface SmsPayload {
  message: string;
  to: string[];
  channel?: string;
  sender?: string;
}

interface SmsResponse {
  status: string;
  message: string;
  data?: any;
}

/**
 * Send SMS using the notify.africa API
 * @param payload - SMS payload containing message, recipients, and optional sender
 * @returns Promise with success status and response/error
 */
export async function sendSms(payload: SmsPayload): Promise<{ success: boolean; response?: SmsResponse; error?: string }> {
  const apiKey = process.env.SMS_APIKEY;
  const baseUrl = process.env.BASEURL || 'https://api.notify.africa/v2';
  
  if (!apiKey) {
    return { 
      success: false, 
      error: 'SMS_APIKEY environment variable is not set' 
    };
  }

  if (!baseUrl) {
    return { 
      success: false, 
      error: 'BASEURL environment variable is not set' 
    };
  }

  try {
    const response = await axios.post(
      `${baseUrl}/send-sms`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    console.log(`SMS sent successfully. Status: ${response.status}`);
    console.log('Response:', response.data);

    return {
      success: true,
      response: response.data
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
    console.error('Failed to send SMS:', errorMessage);
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Send a welcome SMS to a new user
 * @param phoneNumber - Recipient's phone number
 * @param userName - User's name for personalization
 * @returns Promise<boolean> indicating success
 */
export async function sendWelcomeSms(phoneNumber: string, userName: string): Promise<boolean> {
  const message = `Welcome to MealSync, ${userName}! You can now browse menus, make meal selections, and plan your weekly meals. Visit our platform to get started.`;
  
  const payload: SmsPayload = {
    message,
    to: [phoneNumber],
    sender: 'MealSync'
  };

  const result = await sendSms(payload);
  return result.success;
}

/**
 * Send a meal confirmation SMS
 * @param phoneNumber - Recipient's phone number
 * @param userName - User's name for personalization
 * @param mealName - Name of the selected meal
 * @param date - Date of the meal
 * @returns Promise<boolean> indicating success
 */
export async function sendMealConfirmationSms(phoneNumber: string, userName: string, mealName: string, date: string): Promise<boolean> {
  const message = `Hi ${userName}, your meal selection is confirmed! Meal: ${mealName} for ${date}. You can update your selection anytime on MealSync.`;
  
  const payload: SmsPayload = {
    message,
    to: [phoneNumber],
    sender: 'MealSync'
  };

  const result = await sendSms(payload);
  return result.success;
}

/**
 * Send a reminder SMS
 * @param phoneNumber - Recipient's phone number
 * @param userName - User's name for personalization
 * @returns Promise<boolean> indicating success
 */
export async function sendReminderSms(phoneNumber: string, userName: string): Promise<boolean> {
  const message = `Hi ${userName}, don't forget to select your meals for next week on MealSync! The deadline is Friday evening.`;
  
  const payload: SmsPayload = {
    message,
    to: [phoneNumber],
    sender: 'MealSync'
  };

  const result = await sendSms(payload);
  return result.success;
}

/**
 * Send bulk SMS to multiple recipients
 * @param phoneNumbers - Array of recipient phone numbers
 * @param message - Message to send
 * @param sender - Optional sender name
 * @returns Promise with results for each recipient
 */
export async function sendBulkSms(phoneNumbers: string[], message: string, sender?: string): Promise<{ success: boolean; results: any }> {
  const payload: SmsPayload = {
    message,
    to: phoneNumbers,
    sender: sender || 'MealSync'
  };

  const result = await sendSms(payload);
  return {
    success: result.success,
    results: result.response || result.error
  };
}

export { SmsPayload, SmsResponse };
