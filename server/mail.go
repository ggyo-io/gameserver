package main

import (
	"crypto/tls"
	"fmt"
	"log"
	"net"
	"net/mail"
	"net/smtp"
	"os"
)

func SendEmail(to mail.Address, subj string, body string) {
	name := os.Getenv("MAIL_NAME")
	email := os.Getenv("MAIL_EMAIL")
	password := os.Getenv("MAIL_PASSWORD")
	from := mail.Address{name, email}
	log.Printf("mail sending email from %v to %v subj %v body %v\n",
		from, to, subj, body)

	// Setup headers
	headers := make(map[string]string)
	headers["From"] = from.String()
	headers["To"] = to.String()
	headers["Subject"] = subj

	// Setup message
	message := ""
	for k, v := range headers {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	message += "\r\n" + body

	// Connect to the SMTP Server
	servername := "smtp.gmail.com:587"

	host, _, _ := net.SplitHostPort(servername)

	auth := smtp.PlainAuth(name, email, password, host)

	// TLS config
	tlsconfig := &tls.Config{
		InsecureSkipVerify: true,
		ServerName:         host,
	}

	c, err := smtp.Dial(servername)
	if err != nil {
		log.Printf("mail dial error: %v", err)
	}

	err = c.StartTLS(tlsconfig)
	if err != nil {
		log.Printf("mail tls error: %v", err)
	}

	// Auth
	if err = c.Auth(auth); err != nil {
		log.Printf("mail auth error: %v", err)
	}

	// To && From
	if err = c.Mail(from.Address); err != nil {
		log.Printf("make from error: %v", err)
	}

	if err = c.Rcpt(to.Address); err != nil {
		log.Printf("make rcpt error: %v", err)
	}

	// Data
	w, err := c.Data()
	if err != nil {
		log.Printf("mail data error: %v", err)
	}

	_, err = w.Write([]byte(message))
	if err != nil {
		log.Printf("mail write error: %v", err)
	}

	err = w.Close()
	if err != nil {
		log.Printf("mail close error: %v", err)
	}

	c.Quit()
}

/*
func main() {
	to := mail.Address{"Alexander Indenbaum", "alexander.indenbaum@gmail.com"}
	subj := "This is the email subject Oh yesh"
	body := "This is an example body.\n With two lines."
	SendEmail(to, subj, body)
}
*/
