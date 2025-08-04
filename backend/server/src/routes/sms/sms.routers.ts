import { Router } from "express";
import { 
  sendSms, 
  sendWelcomeSms, 
  sendMealConfirmationSms, 
  sendReminderSms,
  sendTestSms
} from "./sms.controller";

const smsRouter = Router();

// Send custom SMS
smsRouter.post("/send", sendSms);

// Send welcome SMS
smsRouter.post("/welcome", sendWelcomeSms);

// Send meal confirmation SMS
smsRouter.post("/meal-confirmation", sendMealConfirmationSms);

// Send reminder SMS
smsRouter.post("/reminder", sendReminderSms);

// Send test SMS to +255686477074
smsRouter.post("/test", sendTestSms);

export default smsRouter;
