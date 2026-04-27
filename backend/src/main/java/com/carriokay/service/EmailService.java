package com.carriokay.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

	@Autowired
    private JavaMailSender mailSender;

    public void sendSimpleMail(String to, String subject, String text) {
        try {
            System.out.println("Sending email to: " + to);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false);

            helper.setFrom("2400031412cse1@gmail.com"); 
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);

            mailSender.send(message);

            System.out.println("Email sent successfully");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}