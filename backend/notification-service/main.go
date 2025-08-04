package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/smtp"
	"os"
	"time"

	"github.com/streadway/amqp"
	"github.com/tacherasasi/notify-africa-go/client"
)

type EmailRequest struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

type SmsRequest struct {
	Number  string `json:"number"`
	Message string `json:"message"`
}

func sendEmail(to, subject, body string) error {
	from := os.Getenv("SMTP_FROM")
	password := os.Getenv("SMTP_PASSWORD")
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")

	if from == "" || password == "" || smtpHost == "" || smtpPort == "" {
		log.Println("Email configuration missing, skipping email send")
		return fmt.Errorf("email configuration incomplete")
	}

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: " + subject + "\n\n" + body

	auth := smtp.PlainAuth("", smtpUser, password, smtpHost)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, []byte(msg))
	if err != nil {
		log.Printf("Failed to send email: %v", err)
		return err
	}

	log.Printf("Email sent successfully to: %s", to)
	return nil
}

func sendSms(number, message string) error {
	apiKey := os.Getenv("SMS_APIKEY")
	emailApiKey := os.Getenv("EMAIL_APIKEY")

	if apiKey == "" {
		log.Println("SMS API key not configured, skipping SMS send")
		return fmt.Errorf("SMS API key not configured")
	}

	cfg := client.Config{
		SMSApiKey:   apiKey,
		EmailApiKey: emailApiKey,
	}

	c := client.NewClient(cfg)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Send SMS
	smsResp, err := c.SMS.SendSMSWithContext(ctx, 1, message, []string{number})
	if err != nil {
		log.Printf("SMS error: %v", err)
		return err
	}
	log.Printf("SMS sent! Status: %d, Message: %s", smsResp.Status, smsResp.Message)

	return nil
}

func connectToRabbitMQ() (*amqp.Connection, error) {
	rabbitURL := os.Getenv("RABBITMQ_URL")
	if rabbitURL == "" {
		rabbitURL = "amqp://localhost:5672"
	}

	var conn *amqp.Connection
	var err error

	// Retry connection with exponential backoff
	for i := 0; i < 10; i++ {
		conn, err = amqp.Dial(rabbitURL)
		if err == nil {
			log.Printf("Connected to RabbitMQ at %s", rabbitURL)
			return conn, nil
		}

		log.Printf("Failed to connect to RabbitMQ (attempt %d/10): %v", i+1, err)
		time.Sleep(time.Duration(i+1) * time.Second)
	}

	return nil, fmt.Errorf("failed to connect to RabbitMQ after 10 attempts: %v", err)
}

func main() {
	log.Println("Starting MealSync Notification Service...")

	conn, err := connectToRabbitMQ()
	if err != nil {
		log.Fatal("Failed to connect to RabbitMQ:", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("Failed to open a channel:", err)
	}
	defer ch.Close()

	queueName := "email_queue"
	_, err = ch.QueueDeclare(queueName, true, false, false, false, nil)
	if err != nil {
		log.Fatal("Failed to declare a queue:", err)
	}

	msgs, err := ch.Consume(queueName, "", true, false, false, false, nil)
	if err != nil {
		log.Fatal("Failed to register a consumer:", err)
	}

	log.Println("Notification service is ready. Waiting for messages...")
	for msg := range msgs {
		var emailReq EmailRequest
		err := json.Unmarshal(msg.Body, &emailReq)
		if err != nil {
			log.Printf("Invalid message format: %v", err)
			continue
		}

		log.Printf("Processing email request for: %s", emailReq.To)
		if err := sendEmail(emailReq.To, emailReq.Subject, emailReq.Body); err != nil {
			log.Printf("Failed to send email to %s: %v", emailReq.To, err)
		} else {
			log.Printf("Email sent successfully to: %s", emailReq.To)
		}
	}
}
