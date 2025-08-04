import amqp from 'amqplib';

class NotificationService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private rabbitmqUrl: string;

  constructor() {
    this.rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      
      // Declare the email queue
      await this.channel.assertQueue('email_queue', { durable: true });
      
      console.log('Connected to RabbitMQ for notifications');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      // Don't throw error, let the app continue without notifications
    }
  }

  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    if (!this.channel) {
      console.warn('RabbitMQ not connected, email not sent');
      return false;
    }

    try {
      const message = {
        to,
        subject,
        body
      };

      this.channel.sendToQueue(
        'email_queue',
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );

      console.log(`Email queued for: ${to}`);
      return true;
    } catch (error) {
      console.error('Failed to queue email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const subject = 'Welcome to MealSync!';
    const body = `
Hello ${userName},

Welcome to MealSync! We're excited to have you on board.

You can now:
- Browse daily menus
- Make meal selections
- Plan your weekly meals
- View your meal history

If you have any questions, please don't hesitate to reach out.

Best regards,
The MealSync Team
    `;

    return this.sendEmail(userEmail, subject, body);
  }

  async sendMealSelectionConfirmation(userEmail: string, userName: string, mealName: string, date: string): Promise<boolean> {
    const subject = 'Meal Selection Confirmed';
    const body = `
Hello ${userName},

Your meal selection has been confirmed!

Details:
- Meal: ${mealName}
- Date: ${date}

You can always update your selection if needed.

Best regards,
The MealSync Team
    `;

    return this.sendEmail(userEmail, subject, body);
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}

export const notificationService = new NotificationService();
