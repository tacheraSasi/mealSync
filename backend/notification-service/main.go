// notifications/main.go
package main

import (
	"encoding/json"
	"log"
	"net/smtp"
	"os"

	"github.com/streadway/amqp"
)

type EmailRequest struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

func sendEmail(to, subject, body string) error {
	from := ""
	password := ""
	smtpHost := "smtp.example.com"
	smtpPort := "587"

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: " + subject + "\n\n" + body

	auth := smtp.PlainAuth("", from, password, smtpHost)
	return smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, []byte(msg))
}

func main() {
	rabbitURL := os.Getenv("RABBITMQ_URL")
	conn, err := amqp.Dial(rabbitURL)
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

	log.Println("Waiting for messages...")
	for msg := range msgs {
		var emailReq EmailRequest
		err := json.Unmarshal(msg.Body, &emailReq)
		if err != nil {
			log.Println("Invalid message:", err)
			continue
		}
		log.Println("Sending email to:", emailReq.To)
		if err := sendEmail(emailReq.To, emailReq.Subject, emailReq.Body); err != nil {
			log.Println("Failed to send email:", err)
		} else {
			log.Println("Email sent to:", emailReq.To)
		}
	}
}
