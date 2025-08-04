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

class SmsService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.SMS_APIKEY || '';
    this.baseUrl = process.env.BASEURL || 'https://api.notify.africa/v2';
    
    if (!this.apiKey) {
      console.warn('SMS_APIKEY environment variable is not set');
    }
    if (!this.baseUrl) {
      console.warn('BASEURL environment variable is not set');
    }
  }

  async sendSms(payload: SmsPayload): Promise<{ success: boolean; response?: SmsResponse; error?: string }> {
    if (!this.apiKey) {
      return { 
        success: false, 
        error: 'SMS_APIKEY environment variable is not set' 
      };
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/send-sms`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
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

  async sendWelcomeSms(phoneNumber: string, userName: string): Promise<boolean> {
    const message = `Welcome to MealSync, ${userName}! You can now browse menus, make meal selections, and plan your weekly meals. Visit our platform to get started.`;
    
    const payload: SmsPayload = {
      message,
      to: [phoneNumber],
      sender: '55'
    };

    const result = await this.sendSms(payload);
    return result.success;
  }

  async sendMealConfirmationSms(phoneNumber: string, userName: string, mealName: string, date: string): Promise<boolean> {
    const message = `Hi ${userName}, your meal selection is confirmed! Meal: ${mealName} for ${date}. You can update your selection anytime on MealSync.`;
    
    const payload: SmsPayload = {
      message,
      to: [phoneNumber],
      sender: '55'
    };

    const result = await this.sendSms(payload);
    return result.success;
  }

  async sendReminderSms(phoneNumber: string, userName: string): Promise<boolean> {
    const message = `Hi ${userName}, don't forget to select your meals for next week on MealSync! The deadline is Friday evening.`;
    
    const payload: SmsPayload = {
      message,
      to: [phoneNumber],
      sender: '55'
    };

    const result = await this.sendSms(payload);
    return result.success;
  }
}

export const smsService = new SmsService();
export { SmsPayload, SmsResponse };
