import { Request, Response } from "express";
import { smsService } from "../../services/sms.service";

export async function sendSms(req: Request, res: Response): Promise<Response> {
  try {
    const { message, to, sender } = req.body;

    if (!message || !to) {
      return res.status(400).json({
        status: "error",
        message: "Message and recipient phone number(s) are required"
      });
    }

    // Ensure 'to' is an array
    const recipients = Array.isArray(to) ? to : [to];

    const payload = {
      message,
      to: recipients,
      sender: sender || 'MealSync'
    };

    const result = await smsService.sendSms(payload);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: "SMS sent successfully",
        data: result.response
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Failed to send SMS",
        error: result.error
      });
    }
  } catch (error: any) {
    console.error("Error in sendSms controller:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
}

export async function sendWelcomeSms(req: Request, res: Response): Promise<Response> {
  try {
    const { phoneNumber, userName } = req.body;

    if (!phoneNumber || !userName) {
      return res.status(400).json({
        status: "error",
        message: "Phone number and user name are required"
      });
    }

    const success = await smsService.sendWelcomeSms(phoneNumber, userName);

    if (success) {
      return res.status(200).json({
        status: "success",
        message: "Welcome SMS sent successfully"
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Failed to send welcome SMS"
      });
    }
  } catch (error: any) {
    console.error("Error in sendWelcomeSms controller:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
}

export async function sendMealConfirmationSms(req: Request, res: Response): Promise<Response> {
  try {
    const { phoneNumber, userName, mealName, date } = req.body;

    if (!phoneNumber || !userName || !mealName || !date) {
      return res.status(400).json({
        status: "error",
        message: "Phone number, user name, meal name, and date are required"
      });
    }

    const success = await smsService.sendMealConfirmationSms(phoneNumber, userName, mealName, date);

    if (success) {
      return res.status(200).json({
        status: "success",
        message: "Meal confirmation SMS sent successfully"
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Failed to send meal confirmation SMS"
      });
    }
  } catch (error: any) {
    console.error("Error in sendMealConfirmationSms controller:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
}

export async function sendReminderSms(req: Request, res: Response): Promise<Response> {
  try {
    const { phoneNumber, userName } = req.body;

    if (!phoneNumber || !userName) {
      return res.status(400).json({
        status: "error",
        message: "Phone number and user name are required"
      });
    }

    const success = await smsService.sendReminderSms(phoneNumber, userName);

    if (success) {
      return res.status(200).json({
        status: "success",
        message: "Reminder SMS sent successfully"
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Failed to send reminder SMS"
      });
    }
  } catch (error: any) {
    console.error("Error in sendReminderSms controller:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
}

export async function sendTestSms(_req: Request, res: Response): Promise<Response> {
  try {
    const testPhoneNumber = "+255686477074";
    const testMessage = "🍽️ Test SMS from MealSync! Your meal management system is working perfectly. API integration successful! ✅";

    const payload = {
      message: testMessage,
      to: [testPhoneNumber],
      sender: 'MealSync'
    };

    const result = await smsService.sendSms(payload);

    if (result.success) {
      return res.status(200).json({
        status: "success",
        message: `Test SMS sent successfully to ${testPhoneNumber}`,
        data: {
          phoneNumber: testPhoneNumber,
          message: testMessage,
          response: result.response
        }
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Failed to send test SMS",
        error: result.error,
        phoneNumber: testPhoneNumber
      });
    }
  } catch (error: any) {
    console.error("Error in sendTestSms controller:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
}
