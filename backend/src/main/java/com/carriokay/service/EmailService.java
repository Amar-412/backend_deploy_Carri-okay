package com.carriokay.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Value("${BREVO_API_KEY}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendSimpleMail(String to, String subject, String text) {
        try {
            String url = "https://api.brevo.com/v3/smtp/email";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            Map<String, Object> body = new HashMap<>();

            Map<String, String> sender = new HashMap<>();
            sender.put("email", "amar.sork@gmail.com");
            sender.put("name", "CarriOkay");

            Map<String, String> toUser = new HashMap<>();
            toUser.put("email", to);

            body.put("sender", sender);
            body.put("to", new Object[]{toUser});
            body.put("subject", subject);
            body.put("textContent", text);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            restTemplate.postForEntity(url, request, String.class);

            System.out.println("Email sent via Brevo REST API");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}